import React, { useState } from "react"
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

const handleDelete = () => {
  console.info("You clicked the delete icon.")
}

var flag = 0
var flagItems = 0

const Lists = () => {
  const [customLists, setCustomLists] = useState([])

  const { authTokens } = useAuth()
  const ID = authTokens.user._id
  const { loading, error, data } = useQuery(LIST_DATA)

  const addNewList = () => {
    const newListName = document.querySelector("#newListName").value
    const newListDesc = document.querySelector("#newListDesc").value
    if (newListName === null || newListName === "") {
      console.log("error, name is required")
    } else {
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
      document.querySelector("#newListName").value = ""
      document.querySelector("#newListDesc").value = ""
    }
  }

  const addNewItem = (e, id) => {
    //check item input ? empty and is unique for a list
    const newItem = e.currentTarget.previousSibling.getElementsByTagName(
      "INPUT"
    )[0].value
    let arrayIndex
    if (newItem === null || newItem === "") {
      console.log("please insert item name before you try to add it")
    } else {
      customLists.map((list) => {
        if (list._id === id) {
          arrayIndex = customLists.indexOf(list)
          return arrayIndex
        } else {
          return null
        }
      })

      let updatedList = [...customLists]
      console.log(updatedList)
      let listToBeUpdated = { ...customLists[arrayIndex] }
      listToBeUpdated.items.push({ itemName: newItem, _id: flagItems })
      customLists[arrayIndex] = listToBeUpdated
      flagItems++
      setCustomLists(updatedList)
      console.log(customLists)
    }
  }

  const handleClick = (e) => {
    e.currentTarget.classList.toggle("item__clicked")
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
                <TextField id="newItem" label="New Item" variant="filled" />
                <Icon
                  style={{ fontSize: 30, margin: "auto" }}
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
                    onClick={handleClick}
                    onDelete={handleDelete}
                    color="primary"
                    variant="outlined"
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
                        onDelete={handleDelete}
                        color="primary"
                        variant="outlined"
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
