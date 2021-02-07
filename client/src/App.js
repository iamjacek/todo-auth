import React, { useState } from "react"
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Login from "./pages/Login"
import Signup from "./pages/Signup"

import PrivateRoute from "./PrivateRoute"
import { AuthContext } from "./context/auth"

import { Avatar, Container, Button } from "@material-ui/core"
import { styled } from "@material-ui/core/styles"

import { createBrowserHistory } from "history"

import { ApolloProvider } from "@apollo/client"
import { ApolloClient, InMemoryCache } from "@apollo/client"
const apiUrl = "https://todo001-001.herokuapp.com/graphql"
let history = createBrowserHistory()
const client = new ApolloClient({
  uri: apiUrl,
  cache: new InMemoryCache(),
})

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
    setAuthTokens(null)
    history.push("/")
  }

  const Wrapper = styled(Container)({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  })

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
        <Router>
          <Wrapper>
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
                {authTokens && (
                  <li>Welcome back {authTokens.user.username}!</li>
                )}
                {authTokens && (
                  <li>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      onClick={handleSignout}
                    >
                      Sign Out
                    </Button>{" "}
                  </li>
                )}
                {authTokens && (
                  <li>
                    {" "}
                    <Avatar style={{ background: "#fc6e51" }}>
                      {authTokens.user.username.charAt(0).toUpperCase()}
                    </Avatar>
                  </li>
                )}
                {!authTokens && (
                  <li>
                    {" "}
                    <Link to="/login">Log In</Link>
                  </li>
                )}
                {!authTokens && (
                  <li>
                    {" "}
                    <Link to="/signup">Register</Link>
                  </li>
                )}
              </ul>
            </ul>
            <main>
              <Route exact path="/" component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <PrivateRoute path="/lists" component={Lists} />
            </main>
            <footer>
              <p>
                <span>ToDo Auth</span> © {new Date().getFullYear()}, Built by
                {` `}
                <a
                  href="https://www.jacekwitucki.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  Jacek Witucki
                </a>
                {` `}
              </p>
            </footer>
          </Wrapper>
        </Router>
      </AuthContext.Provider>
    </ApolloProvider>
  )
}

export default App
