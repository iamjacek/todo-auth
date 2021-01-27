import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  TextField,
  Tooltip,
  Button,
  CircularProgress,
  Divider,
} from "@material-ui/core"
import Logo from "../components/Logo"
import Icon from "@material-ui/core/Icon"

import { useAuth } from "../context/auth"
// import { setListsToStorage, getListsFromStorage } from "../utils"

//add styling using JSS object
import { styled } from "@material-ui/core/styles"

import { useQuery, useMutation, gql } from "@apollo/client"

const apiUrl = process.env.API_URL || "http://localhost:1337/"

const LIST_DATA = gql`
  query pullList {
    lists {
      users_permissions_user {
        _id
      }
      _id
      name
      description
      items {
        itemName
        itemDescription
        _id
        checked
      }
    }
  }
`

const CREATE_LIST = gql`
  mutation CreateList($name: String!, $description: String, $user: ID) {
    createList(
      input: {
        data: {
          name: $name
          description: $description
          users_permissions_user: $user
        }
      }
    ) {
      list {
        name
        description
        users_permissions_user {
          _id
        }
      }
    }
  }
`

const CREATE_ITEM = gql`
  mutation CreateItem($name: String, $listID: ID, $checked: Boolean) {
    createItem(
      input: { data: { itemName: $name, list: $listID, checked: $checked } }
    ) {
      item {
        itemName
        _id
      }
    }
  }
`

const DELETE_LIST = gql`
  mutation DeleteList($listId: ID!) {
    deleteList(input: { where: { id: $listId } }) {
      list {
        _id
      }
    }
  }
`

const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(input: { where: { id: $id } }) {
      item {
        id
      }
    }
  }
`

const UPDATE_ITEM = gql`
  mutation UpdateItem($itemId: ID!, $isChecked: Boolean) {
    updateItem(
      input: { where: { id: $itemId }, data: { checked: $isChecked } }
    ) {
      item {
        checked
      }
    }
  }
`

const CenterContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
})

const Wrapper = styled(Box)({
  display: "flex",
})

const CardWrapper = styled(Box)({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
})

const CardList = styled(Card)({
  position: "relative",
  minWidth: "200px",
  maxWidth: "350px",
  margin: "1rem 0.5rem",
  padding: "1rem 1rem",
  display: "flex",
  flexDirection: "column",
})

const AddItem = styled(Box)({
  display: "flex",
  flexDirection: "row",
  marginBottom: "2rem",
})

const AbsoluteLoadingBox = styled(Box)({
  position: "absolute",
  left: "50%",
  zIndex: "5",
})

const Lists = () => {
  //state for input to be mutated
  const [newList, setNewList] = useState({
    listName: "",
    listDescription: "",
  })

  const [newItem, setNewItem] = useState({
    itemName: "",
    listId: "",
  })

  const [listIdToClear, setlistIdToClear] = useState("")

  const [itemIdToRemove, setItemToRemove] = useState("")

  const [listToDelete, setListToDelete] = useState("")

  const [checkItem, setCheckItem] = useState({
    id: "",
    checked: "",
    listId: "",
  })

  //enter key may be used to create lists and items
  function clicker(event) {
    if (event.keyCode === 13) {
      //add list using enter keyboard key
      const a = document.querySelector("#newListStrapiName")
      const b = document.querySelector("#newListStrapiDesc")
      if (document.activeElement === a || document.activeElement === b) {
        document.getElementById("newListStrapiButton").click()
      }
      //add item
      const c = document.querySelectorAll(".newItemName")
      c.forEach((e) => {
        if (e.getElementsByTagName("INPUT")[0] === document.activeElement) {
          e.getElementsByTagName(
            "INPUT"
          )[0].parentNode.parentNode.nextSibling.click()
        }
      })
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", clicker)
    return () => {
      window.removeEventListener("keyup", clicker)
    }
  }, [])

  const { authTokens } = useAuth()
  const ID = authTokens.user._id
  const { loading, error, data, refetch } = useQuery(LIST_DATA)

  // MUTATION FUNCTIONS *******  ***********  ************  ********  ******  *****

  const [createItem] = useMutation(CREATE_ITEM, {
    variables: {
      name: newItem.itemName,
      listID: newItem.listId,
      checked: false,
    },
    refetchQueries: [`pullList`],
  })

  const [deleteList] = useMutation(DELETE_LIST, {
    variables: {
      listId: listToDelete,
    },
    refetchQueries: [`pullList`],
  })

  const [updateItem, { loading: updating, error: updateError }] = useMutation(
    UPDATE_ITEM,
    {
      variables: {
        itemId: checkItem.id,
        isChecked: checkItem.checked,
      },
      refetchQueries: [`pullList`],
    }
  )

  const [deleteItem] = useMutation(DELETE_ITEM, {
    variables: {
      id: itemIdToRemove,
    },
    refetchQueries: [`pullList`],
  })

  useEffect(() => {
    if (listIdToClear !== "") {
      fetch(apiUrl + "lists/" + listIdToClear, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          refetch()
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [listIdToClear])

  useEffect(() => {
    if (listToDelete !== "") {
      deleteList()
    }
  }, [listToDelete])

  useEffect(() => {
    if (newItem.itemName !== "") {
      createItem()
    }
  }, [newItem])

  useEffect(() => {
    if (checkItem.id !== "") {
      updateItem()
    }
  }, [checkItem])

  useEffect(() => {
    if (itemIdToRemove !== "") {
      deleteItem()
    }
  }, [itemIdToRemove])

  const resetNewListInput = () => {
    setNewList({ listName: "", listDescription: "" })
  }

  //create list and refetch right after
  const [createList] = useMutation(CREATE_LIST, {
    variables: {
      name: newList.listName,
      description: newList.listDescription,
      user: ID,
    },
    refetchQueries: [`pullList`],
  })

  const handleDeleteList = (listToDeleteId) => {
    setListToDelete(listToDeleteId)
  }

  const handleDeleteSingleItem = (id) => {
    setItemToRemove(id)
  }

  const handleClearList = (listToDeleteId) => {
    setlistIdToClear(listToDeleteId)
  }

  const handleItemClick = (itemId, checked, listId) => {
    setCheckItem({
      id: itemId,
      checked: !checked,
      listId: listId,
    })
  }

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    )

  if (error) return <p>Error :(</p>

  return (
    <Wrapper>
      <CenterContainer>
        <div>
          <Logo />
        </div>

        <Typography variant="h3" component="h2" align="center">
          Your Lists!
        </Typography>

        <Typography variant="subtitle1" align="center" paragraph={true}>
          Simply choose one of your lists or create new
        </Typography>
        <CardWrapper id="cardWrapper">
          {/* CREATE NEW LIST IN STRAPI */}
          <CardList
            elevation={3}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "left",
              padding: "1rem",
            }}
          >
            <Typography
              component="h2"
              style={{
                marginBottom: "1rem",
                display: "flex",
                justifyContent: "center",
              }}
            >
              Create new list right in strapi here!
            </Typography>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (newList.listName !== "") {
                  createList()
                  resetNewListInput()
                }
              }}
            >
              <TextField
                id="newListStrapiName"
                label="Name"
                variant="outlined"
                value={newList.listName}
                onChange={(e) => {
                  setNewList({
                    ...newList,
                    listName: e.target.value,
                  })
                }}
                style={{ marginBottom: "1rem" }}
              />
              <TextField
                id="newListStrapiDesc"
                label="Description"
                variant="outlined"
                value={newList.listDescription}
                onChange={(e) => {
                  setNewList({
                    ...newList,
                    listDescription: e.target.value,
                  })
                }}
              />
              <Button type="submit" id="newListStrapiButton">
                <Icon
                  style={{
                    fontSize: 50,
                    margin: "0.5rem auto 0 auto",
                    cursor: "pointer",
                  }}
                >
                  add_circle
                </Icon>
              </Button>
            </form>
          </CardList>

          {/* **************** LISTS FROM STRAPI ******************** */}
          {data.lists &&
            data.lists.map(
              ({ _id, name, description, items, users_permissions_user }) =>
                users_permissions_user._id === ID && (
                  <CardList elevation={3} key={_id}>
                    <Box flexGrow={1}>
                      <Typography
                        component="h2"
                        style={{
                          maxWidth: "200px",
                          margin: "0 auto 0.5rem auto",
                          textTransform: "uppercase",
                          display: "flex",
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        {name}
                      </Typography>
                      <p
                        style={{
                          margin: "0 auto 1rem auto",
                          textAlign: "center",
                          color: "gray",
                          maxWidth: "200px",
                        }}
                      >
                        {description}
                      </p>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                        }}
                      >
                        <AddItem>
                          <TextField
                            label="New Item"
                            variant="outlined"
                            className="newItemName"
                            value={this}
                          />
                          <Button
                            type="sumbmit"
                            onClick={(e) => {
                              //set state exactly for one clicked input

                              //user click on plus icon
                              if (e.target.tagName.toLowerCase() === "span") {
                                if (
                                  e.target.parentNode.parentNode.previousSibling.getElementsByTagName(
                                    "INPUT"
                                  )[0].value !== null ||
                                  e.target.parentNode.parentNode.previousSibling.getElementsByTagName(
                                    "INPUT"
                                  )[0].value !== undefined
                                ) {
                                  setNewItem({
                                    itemName: e.target.parentNode.parentNode.previousSibling.getElementsByTagName(
                                      "INPUT"
                                    )[0].value,
                                    listId: `${_id}`,
                                  })
                                } else {
                                  console.log("no value has been submitted")
                                }
                                e.target.parentNode.parentNode.previousSibling.getElementsByTagName(
                                  "INPUT"
                                )[0].value = ""
                              }
                              if (e.target.tagName.toLowerCase() === "button") {
                                if (
                                  e.target.parentNode.getElementsByTagName(
                                    "INPUT"
                                  )[0].value !== null ||
                                  e.target.parentNode.getElementsByTagName(
                                    "INPUT"
                                  )[0].value !== undefined
                                ) {
                                  setNewItem({
                                    itemName: e.target.parentNode.getElementsByTagName(
                                      "INPUT"
                                    )[0].value,
                                    listId: `${_id}`,
                                  })
                                } else {
                                  console.log("no value has been submitted")
                                }

                                e.target.parentNode.getElementsByTagName(
                                  "INPUT"
                                )[0].value = ""
                              }
                            }}
                          >
                            <Icon
                              className="newItemButton"
                              style={{
                                fontSize: 30,
                                margin: "auto",
                                cursor: "pointer",
                              }}
                            >
                              add_circle
                            </Icon>
                          </Button>
                        </AddItem>
                      </form>
                      <Divider style={{ marginBottom: "2rem" }} />
                      {updating && _id === checkItem.listId && (
                        <AbsoluteLoadingBox>
                          <CircularProgress
                            style={{
                              position: "relative",
                              left: "-50%",
                            }}
                          />
                        </AbsoluteLoadingBox>
                      )}
                      {items.map((item) => (
                        <div
                          key={item._id}
                          style={{ margin: "0.5rem 0", display: "block" }}
                        >
                          <Tooltip title={item.description || ""}>
                            <Chip
                              label={item.itemName}
                              onClick={() =>
                                handleItemClick(item._id, item.checked, _id)
                              }
                              onDelete={() => handleDeleteSingleItem(item._id)}
                              color="default"
                              variant="outlined"
                              className={
                                item.checked
                                  ? "list__item--clicked"
                                  : "list__item"
                              }
                            />
                          </Tooltip>
                        </div>
                      ))}

                      {items.length === 0 && (
                        <Box display="flex" justifyContent="center">
                          This list is empty
                        </Box>
                      )}
                    </Box>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        style={{ marginTop: "1rem" }}
                        onClick={() => handleClearList(_id)}
                        disabled={items.length === 0}
                      >
                        CLEAR LIST
                      </Button>

                      <Button
                        style={{ marginTop: "1rem", marginLeft: "auto" }}
                        onClick={() => handleDeleteList(_id)}
                      >
                        REMOVE LIST
                      </Button>
                    </Box>
                  </CardList>
                )
            )}
        </CardWrapper>
      </CenterContainer>
    </Wrapper>
  )
}

export default Lists
