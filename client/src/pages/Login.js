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

const AlertMessage = styled(Alert)({
    marginTop: '1rem',
    marginBottom: '1rem'
})

const Login = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isError, setIsError] = useState(false)
    const [userEmail, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const { setAuthTokens } = useAuth()

    const postLogin = (event) => {
        event.preventDefault()
        axios.post("http://localhost:1337/auth/local", {
            identifier: userEmail,
            password: password,
        }).then(result => {
            if (result.status === 200) {
                setAuthTokens(result.data)
                setIsLoggedIn(true)
                console.log('Well done!');
    console.log('User profile', result.data.user);
    console.log('User token', result.data.jwt);
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
            <form onSubmit={postLogin}>
            <TextField label="Email" variant="filled" type="email" onChange={e => {
                    setEmail(e.target.value)
                }} />
                <TextFieldMargin label="Password" variant="filled" type="password" onChange={e => {
                    setPassword(e.target.value)
                }} />
                <Button size="large" type="submit" variant="outlined" color="primary">Sign In</Button>
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
