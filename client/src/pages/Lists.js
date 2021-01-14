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
import { setListsToStorage, getListsFromStorage } from "../utils"

//add styling using JSS object
import { styled } from "@material-ui/core/styles"

import { useQuery, useMutation, gql } from "@apollo/client"

const LIST_DATA = gql`
  query {
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

//flags for Lits and items (avoid map unique key error)
var flag = localStorage.getItem("flag") ? localStorage.getItem("flag") : 0
var flagItems = localStorage.getItem("flagItems")
  ? localStorage.getItem("flagItems")
  : 0

const Lists = () => {
  //local state for list items
  const [customLists, setCustomLists] = useState([])

  //state for input to be mutated
  const [newList, setNewList] = useState({
    listName: "",
    listDescription: "",
  })

  function clicker(event) {
    console.log("enter")
    if (event.keyCode === 13) {
      //add list using enter keyboard key
      const a = document.querySelector("#newListName")
      const b = document.querySelector("#newListDesc")
      if (document.activeElement === a || document.activeElement === b) {
        document.getElementById("newListButton").click()
      }
      //add item using enter keyboard key
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

  //pull lists from storage
  useEffect(() => {
    setCustomLists(getListsFromStorage("lists"))
  }, [])

  //save lists and flags to localStorage
  useEffect(() => {
    setListsToStorage(customLists)
    if (localStorage) {
      localStorage.setItem("flag", flag)
      localStorage.setItem("flagItems", flagItems)
    }
  }, [customLists])

  const { authTokens } = useAuth()
  const ID = authTokens.user._id
  const { loading, error, data } = useQuery(LIST_DATA)

  // MUTATION FUNCTIONS *******  ***********  ************  ********  ******  *****

  const [createList] = useMutation(CREATE_LIST, {
    variables: {
      name: newList.listName,
      description: newList.listDescription,
      user: ID,
    },
  })

  const addNewList = () => {
    const newListName = document.querySelector("#newListName").value
    const newListDesc = document.querySelector("#newListDesc").value
    if (newListName === null || newListName === "") {
      document.querySelector("#newListName").classList.add("form__input--error")
    } else {
      //description is optional
      const description = newListDesc || ""
      setCustomLists([
        {
          name: newListName,
          _id: flag,
          description: description,
          items: [],
        },
        ...customLists,
      ])
      flag++
      document
        .querySelector("#newListName")
        .classList.remove("form__input--error")
      document.querySelector("#newListName").value = ""
      document.querySelector("#newListDesc").value = ""
    }
  }

  //finds index of the list with passed id within customLists state
  const findListIndex = (id) => {
    var index
    customLists.map((list) => {
      if (list._id === id) {
        index = customLists.indexOf(list)
        return null
      } else {
        return null
      }
    })
    return index
  }

  const addNewItem = (e, id) => {
    //check item input is empty and is unique for a list
    const newItem = e.currentTarget.previousSibling.getElementsByTagName(
      "INPUT"
    )[0].value

    if (newItem === null || newItem === "") {
      e.currentTarget.previousSibling
        .getElementsByTagName("INPUT")[0]
        .classList.add("form__input--error")
    } else {
      const arrayIndex = findListIndex(id)
      let updatedLists = [...customLists]
      let listToBeUpdated = { ...updatedLists[arrayIndex] }
      listToBeUpdated.items.push({
        itemName: newItem,
        _id: Number(flagItems),
        checked: false,
      })
      updatedLists[arrayIndex] = listToBeUpdated
      flagItems++
      setCustomLists(updatedLists)
      e.currentTarget.previousSibling.getElementsByTagName("INPUT")[0].value =
        ""
      e.currentTarget.previousSibling
        .getElementsByTagName("INPUT")[0]
        .classList.remove("form__input--error")
    }
  }

  //checked/mark as done
  const handleClick = (id, itemId) => {
    //find list
    const arrayIndex = findListIndex(id)
    let updatedLists = [...customLists]
    let singleList = { ...updatedLists[arrayIndex] }
    //find item
    const itemIndex = singleList.items.findIndex((item) => item._id === itemId)
    //toggle item.change
    singleList.items[itemIndex].checked = !singleList.items[itemIndex].checked
    setCustomLists(updatedLists)
  }

  const handleDelete = (id, item) => {
    //get array index of the list we want to remove our item
    const arrayIndex = findListIndex(id)
    let updatedLists = [...customLists]
    let singleList = { ...updatedLists[arrayIndex] }
    //filter clicked item and add it back to list
    const filtered = singleList.items.filter(
      (elem) => Number(elem._id) !== Number(item)
    )
    singleList.items = filtered
    updatedLists[arrayIndex] = singleList
    setCustomLists(updatedLists)
  }

  const handleRemoveList = (listId) => {
    const index = findListIndex(listId)
    let updatedLists = [...customLists]
    updatedLists.splice(index, 1)
    setCustomLists(updatedLists)
  }

  //remove all items
  const handleClearAll = (listId) => {
    const index = findListIndex(listId)
    let updatedLists = [...customLists]
    let singleList = { ...updatedLists[index] }
    singleList.items = []
    updatedLists[index] = singleList
    setCustomLists(updatedLists)
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
          {/* CREATE STRAPI LIST OFFLINE AND STORE IN LOCAL STORAGE
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
              Create new list here!
            </Typography>

            <TextField
              id="newListName"
              label="Name"
              variant="outlined"
              style={{ marginBottom: "1rem" }}
            />
            <TextField
              id="newListDesc"
              label="Description"
              variant="outlined"
            />
            <Icon
              id="newListButton"
              style={{
                fontSize: 50,
                margin: "0.5rem auto 0 auto",
                cursor: "pointer",
              }}
              onClick={() => {
                addNewList()
              }}
            >
              add_circle
            </Icon>
          </CardList> */}

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
                createList()
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
              <Button type="submit">
                <Icon
                  id="newListStrapiButton"
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
          {/* **************** CUSTOM LISTS ADDED LOCALLY ******************** */}
          {customLists.map(({ _id, name, description, items }) => (
            <CardList elevation={3} key={_id}>
              <Box flexGrow={1}>
                <Typography
                  component="h2"
                  style={{
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {name}
                </Typography>
                <p style={{ marginBottom: "1rem", color: "gray" }}>
                  {description}
                </p>
                <AddItem>
                  <TextField
                    label="New Item"
                    variant="outlined"
                    className="newItemName"
                  />
                  <Icon
                    className="newItemButton"
                    style={{
                      fontSize: 30,
                      margin: "auto -5px auto 5px",
                      cursor: "pointer",
                    }}
                    onClick={(e) => {
                      addNewItem(e, _id)
                    }}
                  >
                    add_circle
                  </Icon>
                </AddItem>

                <Divider style={{ marginBottom: "2rem" }} />
                {items.map((item) => (
                  <div
                    key={item._id}
                    style={{ margin: "0.5rem 0", display: "block" }}
                  >
                    <Tooltip title={item.description || ""}>
                      <Chip
                        label={item.itemName}
                        onClick={() => handleClick(_id, item._id)}
                        onDelete={() => handleDelete(_id, item._id)}
                        color="default"
                        variant="outlined"
                        className={
                          item.checked ? "list__item--clicked" : "list__item"
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
              <Box style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  style={{ marginTop: "1rem" }}
                  onClick={() => handleClearAll(_id)}
                  disabled={items.length === 0}
                >
                  CLEAR LIST
                </Button>

                <Button
                  style={{ marginTop: "1rem", marginLeft: "auto" }}
                  onClick={() => handleRemoveList(_id)}
                >
                  REMOVE LIST
                </Button>
              </Box>
            </CardList>
          ))}
          {/* **************** LISTS FROM STRAPI ******************** */}
          {data.lists.map(
            ({ _id, name, description, items, users_permissions_user }) =>
              users_permissions_user._id === ID && (
                <CardList elevation={3} key={_id}>
                  <Typography
                    component="h2"
                    style={{
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {name}
                  </Typography>
                  <p style={{ marginBottom: "1rem", color: "gray" }}>
                    {description}
                  </p>
                  {items.map((item) => (
                    <div
                      key={item._id}
                      style={{ margin: "0.5rem 0", display: "block" }}
                    >
                      <Chip
                        label={item.itemName}
                        onClick={handleClick}
                        onDelete={(e) => handleDelete(e)}
                        color="default"
                        variant="outlined"
                        className={item.checked ? "item__clicked" : ""}
                      />
                    </div>
                  ))}
                </CardList>
              )
          )}
        </CardWrapper>
      </CenterContainer>
    </Wrapper>
  )
}

export default Lists
