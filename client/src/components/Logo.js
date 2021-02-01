import React from 'react'
import logo from '../img/logo.png'
import { styled } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'

const Wrapper = styled(Box)({
    width: '100px',
    height: '100px',
    background: `url(${logo})`,
    backgroundSize: 'cover',
    margin: '2rem auto 2rem auto',
})



const Logo = () => {
    return (
        <Wrapper>
            
        </Wrapper>
    )
}

export default Logo
