import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Home from "./Home";
import About from "./About";
import Shop from "./Shop";
import Login from "./Login"

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }
  render() {
    const linkStyle = {
      color: "white",
    };

    return (
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" style={linkStyle}>
                <span className="navbar-brand">Navbar</span>
            </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <Link to="/home" style={linkStyle}>
                <li className="nav-item active">
                  <span className="nav-link">
                    Home <span className="sr-only">(current)</span>
                  </span>
                </li>
              </Link>

              <Link to="/about" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">About</span>
                </li>
              </Link>
              <Link to="/about" style={linkStyle}>
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Dropdown
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                      <Link to="/dropdown/action" style={linkStyle}>
                        <span className="dropdown-item">Action</span>
                      </Link>
                    <span className="dropdown-item">Another action</span>
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-item">Something else here</span>
                  </div>
                </li>
              </Link>
              <Link to="/login" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">Salir</span>
                </li>
              </Link>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route path="/" exact  component={Home} />
          <Route path="/About" component={About} />
          <Route path="/Shop" component={Shop} />
          <Route path="/dropdown/action" component={Shop} />
          <Route path="/login"  component={Login} />
        </Switch>
      </Router>
    );
  }
}

export default Menu;
