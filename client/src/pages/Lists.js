import React, { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Card,
  Chip,
  TextField,
} from "@material-ui/core"
import Logo from "../components/Logo"
import Icon from "@material-ui/core/Icon"

import { useAuth } from "../context/auth"
import { setListsToStorage, getListsFromStorage } from "../utils"

//add styling using JSS object
import { styled } from "@material-ui/core/styles"

import { useQuery, gql } from "@apollo/client"

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
  width: "200px",
  margin: "0.5rem",
  padding: "0.5rem 1rem",
})

const AddItem = styled(Box)({
  display: "flex",
  flexDirection: "row",
})

//flags for Lits and items (avoid map unique key error)
var flag = localStorage.getItem("flag") ? localStorage.getItem("flag") : 0
var flagItems = localStorage.getItem("flagItems")
  ? localStorage.getItem("flagItems")
  : 0

const Lists = () => {
  const [customLists, setCustomLists] = useState([])

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
      console.log("please insert item name before you try to add it")
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

  if (loading) return <p>Loading...</p>

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
            <Typography component="h2" style={{ marginBottom: "0.5rem" }}>
              Create new list
            </Typography>

            <TextField id="newListName" label="Name" variant="filled" />
            <TextField id="newListDesc" label="Description" variant="filled" />
            <Icon
              style={{ fontSize: 50, margin: "0.5rem auto 0 auto" }}
              onClick={() => {
                addNewList()
              }}
            >
              add_circle
            </Icon>
          </CardList>

          {/* **************** CUSTOM LISTS ADDED LOCALLY ******************** */}
          {customLists.map(({ _id, name, description, items }) => (
            <CardList elevation={3} key={_id}>
              <h2 style={{ marginBottom: "0.2rem" }}>{name}</h2>
              <p style={{ marginBottom: "1rem", color: "gray" }}>
                {description}
              </p>
              <AddItem>
                <TextField label="New Item" variant="filled" />
                <Icon
                  style={{
                    fontSize: 30,
                    margin: "auto -5px auto 5px",
                  }}
                  onClick={(e) => {
                    addNewItem(e, _id)
                  }}
                >
                  add_circle
                </Icon>
              </AddItem>

              {items.map((item) => (
                <div
                  key={item._id}
                  style={{ margin: "0.5rem 0", display: "block" }}
                >
                  <Chip
                    label={item.itemName}
                    onClick={() => handleClick(_id, item._id)}
                    onDelete={() => handleDelete(_id, item._id)}
                    color="default"
                    variant="outlined"
                    className={item.checked ? "item__clicked" : ""}
                  />
                </div>
              ))}
            </CardList>
          ))}

          {data.lists.map(
            ({ _id, name, description, items, users_permissions_user }) =>
              users_permissions_user._id === ID && (
                <CardList elevation={3} key={_id}>
                  <h2 style={{ marginBottom: "0.2rem" }}>{name}</h2>
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
