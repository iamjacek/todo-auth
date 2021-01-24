import React, { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../context/auth"

import { Box, TextField, Button, Container } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"

import Logo from "../components/Logo"
//add styling using JSS object
import { styled } from "@material-ui/core/styles"

const CenterContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
})

const TextFieldMargin = styled(TextField)({
  marginBottom: "1rem",
})

const LinkCenter = styled(Link)({
  textAlign: "center",
})

const AlertMessage = styled(Alert)({
  marginTop: "1rem",
  marginBottom: "1rem",
})

const Login = (props) => {
  const [isError, setIsError] = useState(false)
  const [userEmail, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { setAuthTokens } = useAuth()

  const postLogin = (event) => {
    event.preventDefault()
    axios
      .post("http://localhost:1337/auth/local", {
        identifier: userEmail,
        password: password,
      })
      .then((result) => {
        if (result.status === 200) {
          setAuthTokens(result.data)
          props.history.push("/lists")
        } else {
          setIsError(true)
        }
      })
      .catch((error) => {
        setIsError(true)
        console.log(error.result)
      })
  }

  return (
    <Box style={{ minWidth: "100%" }}>
      <CenterContainer maxWidth="xs">
        <Logo />
        <form onSubmit={postLogin}>
          <TextField
            label="Name or Email"
            variant="filled"
            type="email"
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <TextFieldMargin
            label="Password"
            variant="filled"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
          <Button size="large" type="submit" variant="outlined" color="primary">
            Sign In
          </Button>
        </form>
        <LinkCenter to="/signup">Don't have an account?</LinkCenter>
        {isError && (
          <AlertMessage severity="error">
            Username or password are incorrect.
          </AlertMessage>
        )}
      </CenterContainer>
    </Box>
  )
}

export default Login
