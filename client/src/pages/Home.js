import React from "react"
import { Box, Container, Typography } from '@material-ui/core'
import Logo from "../components/Logo"

//add styling using JSS object
import { styled } from '@material-ui/core/styles'

const CenterContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
})

const TypographyMarginBottom = styled(Typography)({
  marginBottom: "2rem"
})

const Home = () => {
  return  (
    <Box>
      <CenterContainer maxWidth="xs">
          <Logo />
          <Typography variant="h3" component="h1">
            Create your list!
          </Typography>
          <Typography component="subtitle1" gutterBottom={true}>
            Accomplish your goals!
          </Typography>
          <Typography component="body1">
            Register for free today and create your list. Access them from your browser everywhere. On your phone and desktop. From work and from home!
          </Typography>
      </CenterContainer>
    </Box>
  )
}

export default Home
