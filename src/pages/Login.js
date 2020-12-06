import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
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

const ButtonBig = styled(Button)({
    height: '50px',
    fontSize: '1.1rem'
})

const AlertMessage = styled(Alert)({
    marginTop: '1rem',
    marginBottom: '1rem'
})

const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isError, setIsError] = useState(false)
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState()
    const { setAuthTokens } = useAuth()

    const postLogin = () => {
        axios.post("http://localhost:1337/auth/local", {
            userName,
            password
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

    if (isLoggedIn) <Redirect to="/" />

    return (
        <Box>
        <CenterContainer maxWidth="xs">
            <Logo />
            <form>
                <TextField label="Email" variant="filled" type="email" />
                <TextFieldMargin label="Password" variant="filled" type="password" />
                <ButtonBig variant="outlined" color="primary">Sign In</ButtonBig>
            </form>
            <LinkCenter to="/signup">Don't have an account?</LinkCenter>
            { isError && 
            <AlertMessage severity="error">Username or password are incorrect.</AlertMessage>
            }
        </CenterContainer>
    </Box>
    )
}

export default Login
