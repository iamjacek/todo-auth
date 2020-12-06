import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import Home from "./pages/Home"
import Lists from "./pages/Lists"
import Login from './pages/Login'
import Signup from './pages/Signup'

import PrivateRoute from './PrivateRoute';
import { AuthContext } from "./context/auth";

function App(props) {
  return (
    <AuthContext.Provider value={false}>
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/lists">Lists</Link>
            </li>
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
