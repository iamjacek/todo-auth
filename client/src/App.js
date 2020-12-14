import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Login from './pages/Login'
import Signup from './pages/Signup'

import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

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
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/lists">Lists</Link>
            </li>
            { authTokens && <button onClick={handleSignout} >Sign Out</button> }
          </ul>
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <PrivateRoute path="/lists" component={Lists} />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
