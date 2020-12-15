import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from "../components/Logo"
import axios from 'axios'
import { useAuth } from '../context/auth' 

import { Box, TextField, Button, Container } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';

//add styling using JSS object
import { styled } from '@material-ui/core/styles'

const CenterContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
})

const TextFieldMargin = styled(TextField)({
    marginBottom: '1rem',
})

const LinkCenter = styled(Link)({
    textAlign: 'center',
})

const AlertMessage = styled(Alert)({
    marginTop: '1rem',
    marginBottom: '1rem'
})

const Signup = (props) => {
    const [isError, setIsError] = useState(false)
    const [isConnectionError, setIsConnectionError] = useState(false)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [userEmail, setEmail] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const { setAuthTokens } = useAuth()

    const postRegister = (event) => {
        event.preventDefault()
        if (password !== passwordConfirmation) {
            setIsError(true)
            return
        }
        axios.post("http://localhost:1337/auth/local/register", {
            username: userName,
            email: userEmail,
            password: password,
        }).then(result => {
            if (result.status === 200) {
                setAuthTokens(result.data)
                props.history.push("/lists")
            } else {
                setIsError(true)
            }
        }).catch(error => {
            setIsError(false)
            setIsConnectionError(true)
            console.log(error.result);
        })
    }

    return (
        <Box  style={{minWidth: "100%"}}>
            <CenterContainer maxWidth="xs">
                <Logo />
                <form onSubmit={postRegister}>
                    <TextField label="Name" variant="filled" onChange={e => {
                    setUserName(e.target.value)
                }} />
                    <TextField label="Email" variant="filled" type="email" onChange={e => {
                    setEmail(e.target.value)
                }} />
                    <TextField label="Password" variant="filled" type="password" onChange={e => {
                    setPassword(e.target.value)
                }} />
                    <TextFieldMargin label="Confirm Password" variant="filled" type="password" onChange={e => {
                    setPasswordConfirmation(e.target.value)
                }} />
                    <Button size="large" type="submit" variant="outlined" color="primary">Sign Up</Button>
                </form>
                <LinkCenter to="/login">Already have an account?</LinkCenter>
                { isError && 
                    <AlertMessage severity="error">Either user name or password are wrong or you did not set your passwords correctly.</AlertMessage>
                }
                { isConnectionError && 
                    <AlertMessage severity="error">Connection error. Contact us or try again later.</AlertMessage>
                }
            </CenterContainer>
        </Box>
    )
}

export default Signup
