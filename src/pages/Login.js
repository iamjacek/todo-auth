import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'


import { Box, TextField, Button, Container } from '@material-ui/core'

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
    height: '56px',
    fontSize: '1.1rem'
})
const Login = () => {
    return (
        <Box>
        <CenterContainer maxWidth="xs">
            <Logo />
            <form>
                <TextField label="Email" variant="filled" type="email" />
                <TextFieldMargin label="Password" variant="filled" type="password" />
                <ButtonBig variant="outlined" color="primary">Sign In</ButtonBig>
            </form>
            <LinkCenter to="/login">Don't have an account?</LinkCenter>
        </CenterContainer>
    </Box>
    )
}

export default Login
