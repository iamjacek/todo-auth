import React from "react"
import { Box, Container, Typography } from '@material-ui/core'
import Logo from "../components/Logo"

//add styling using JSS object
import { styled } from '@material-ui/core/styles'

const CenterContainer = styled(Container)({
    display: 'flex',
    flexDirection: 'column',
})

const Wrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})

const Home = () => {
  return  (
    <Wrapper>
      <CenterContainer maxWidth="xs">
          <div style={{marginBottom: "2rem"}}>
            <Logo />
          </div>
          
          <Typography variant="h3" component="h1" align="center" gutterBottom={true} >
            Create your list!
          </Typography>

          <Typography variant="subtitle1" align="center" paragraph={true} >
            Accomplish your goals!
          </Typography>
          <Typography variant="body1" align="center"  >
            Register for free today and create your list. Access them from your browser on your phone and desktop. So easy!
          </Typography>
      </CenterContainer>
    </Wrapper>
  )
}

export default Home
