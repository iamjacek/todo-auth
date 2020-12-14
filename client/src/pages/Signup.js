import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'
import axios from 'axios'
import { useAuth } from '../context/auth' 

import { Box, TextField, Button, Container } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert';

//add styling using JSS object
import { styled } from '@material-ui/core/styles'

const Logo = styled(Box)({
    width: '100px',
    height: '100px',
    background: `url(${logo})`,
    backgroundSize: 'cover',
    margin: '2rem auto 2rem auto',
})

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

const Signup = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isError, setIsError] = useState(false)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const { setAuthTokens } = useAuth()

    const postRegister = (event) => {
        event.preventDefault()
        if (password === passwordConfirmation) {
            setIsError(true)
            console.log("passwords don't match")
            return
        }
        axios.post("http://localhost:1337/auth/local/register", {
            userName,
            password,
            passwordConfirmation
        }).then(result => {
            if (result.status === 200) {
                setAuthTokens(result.data)
                setIsLoggedIn(true)
            } else {
                setIsError(true)
            }
        }).catch(error => {
            setIsError(true)
            console.log(error.result);
        })
    }

    return (
        <Box>
            <CenterContainer maxWidth="xs">
                <Logo />
                <form onSubmit={postRegister}>
                    <TextField label="Name" variant="filled" onChange={e => {
                    setUserName(e.target.value)
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
                    <AlertMessage severity="error">Username or password are incorrect. Passwords must match.</AlertMessage>
                }
            </CenterContainer>
        </Box>
    )
}

export default Signup
