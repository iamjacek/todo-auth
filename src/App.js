import { BrowserRouter as Router, Link, Route } from "react-router-dom"
import Home from "./pages/Home"
import Lists from "./pages/Lists"

function App() {
  return (
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
        <Route path="/lists" component={Lists} />
      </div>
    </Router>
  )
}

export default App
