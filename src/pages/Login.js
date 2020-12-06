import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo.png'

import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const Login = () => {
    return (
        <Box>
            <Box>
                <Box><img src={logo} /></Box>
                <form>
                    <TextField label="Email" variant="filled" type="email" />
                    <TextField label="Password" variant="filled" type="password" />
                    <Button variant="outlined" color="primary">Sign In</Button>
                </form>
                <Link to="/signup">Don't have an account?</Link>
            </Box>
        </Box>
    )
}

export default Login
