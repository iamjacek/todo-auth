import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Login from './pages/Login'
import Signup from './pages/Signup'

import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

import { Avatar, Container, Button } from '@material-ui/core'

import { createBrowserHistory } from 'history';
let history = createBrowserHistory();

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"))
  const [authTokens, setAuthTokens] = useState(existingTokens)

  const setTokens = (data) => {
    localStorage.setItem("tokens", JSON.stringify(data))
    setAuthTokens(data)
  }

  const clearToken = () => {
    if (localStorage) {
      localStorage.removeItem("tokens")
    }
  }

  const handleSignout = () => {
    clearToken()
    //just to not wait and do callback after state has been changed and immediately remove sign out button from navbar
    setAuthTokens(null)
    history.push("/")
  }

  return (
    <AuthContext.Provider value={{authTokens, setAuthTokens: setTokens}}>
      <Router>
        <Container>
          {/* MENU NAVBAR */}
          <ul>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/lists">Lists</Link>
              </li>
            </ul>
            
            
            <ul>
            { authTokens && <li>Welcome back {authTokens.user.username}!</li>}
              { authTokens && <li><Button size="small" variant="outlined" color="primary" onClick={handleSignout} >Sign Out</Button> </li>}
              { authTokens && <li> <Avatar style={{background: "#fc6e51"}}>{authTokens.user.username.charAt(0).toUpperCase()}</Avatar></li>}
              { !authTokens && <li> <Link to="/login">Log In</Link></li>}
              { !authTokens && <li> <Link to="/signup">Register</Link></li>}
            </ul>
            
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/lists" component={Lists} />
        </Container>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
