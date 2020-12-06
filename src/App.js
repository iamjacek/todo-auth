import React from "react";
import { BrowserRouter as Router, Link, Route } from "react-router-dom"

import Home from "./pages/Home"
import Lists from "./pages/Lists"

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
          <PrivateRoute path="/lists" component={Lists} />
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
