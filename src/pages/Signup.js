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
    height: '50px',
    fontSize: '1.1rem'
})

const Signup = () => {
    return (
        <Box>
            <CenterContainer maxWidth="xs">
                <Logo />
                <form>
                    <TextField label="Email" variant="filled" type="email" />
                    <TextField label="Password" variant="filled" type="password" />
                    <TextFieldMargin label="Password" variant="filled" type="password" />
                    <ButtonBig variant="outlined" color="primary">Sign Up</ButtonBig>
                </form>
                <LinkCenter to="/login">Already have an account?</LinkCenter>
            </CenterContainer>
        </Box>
    )
}

export default Signup
