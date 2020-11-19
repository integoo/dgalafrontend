import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Home from "./Home";
import About from "./About";
import Shop from "./Shop";

// class Exit extends React.Component{
//   render(){
//     return(
//       <div>
//         <button onClick={()=> {this.props.handler(false)}}>Esta seguro que desea Salir?</button>
//       </div>
//     )
//   }
// }


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  signOut = () => {
    // alert("Hello signOut")
    {this.props.handler(false)}
  }

  render() {
    const linkStyle = {
      color: "white",
    };

    return (
      <Router>
        {/* {true ? <Redirect to="/" /> : () =>{alert("hoy")} } */}
        <Redirect to="/" />
        {/* <nav className="navbar navbar-expand-lg navbar-light bg-light"> */}
        <nav className="navbar navbar-expand-lg navbar-white bg-primary">
            <Link to="/" style={linkStyle}>
                <span className="navbar-brand">D'Gala</span>
            </Link>
          <button
            className="navbar-toggler navbar-light bg-light"
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
            <Link to="/" style={linkStyle}>
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Limpiaduría
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                      <Link to="/limpiaduria/ingresos" style={linkStyle}>
                        <span className="dropdown-item">Ingresos</span>
                      </Link>
                      <Link to="/limpiaduria/egresos" style={linkStyle}>
                        <span className="dropdown-item">Egresos</span>
                      </Link>
                    {/* <span className="dropdown-item">Another action</span> */}
                    <div className="dropdown-divider"></div>
                    <span className="dropdown-item">Something else here</span>
                  </div>
                </li>
              </Link>

              <Link to="/home" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">
                    Catálogos <span className="sr-only">(current)</span>
                  </span>
                </li>
              </Link>

              <Link to="/about" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">Ingresos</span>
                </li>
              </Link>
              <Link to="/home" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">Egresos</span>
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
                    Otros
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
              {/* <Link to="/exit" style={linkStyle}>
                <li className="nav-item">
                  <span className="nav-link">Salir</span>
                </li>
              </Link> */}
              <li>
                {/* <button onClick={() => {alert("Hello Hello")}} href="#" className="btn btn-light btn-sm mt-1 ml-2">Salir</button> */}
                {/* <button onClick={this.signOut} href="#" className="btn btn-link" style={linkStyle}>Salir</button> */}
                <button onClick={this.signOut} href="#" className="btn btn-light btn-sm mt-1 ml-2">Salir</button>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          {/* <Route exact path="/" >
            <Redirect to="/home" />
          </Route> */}
          <Route exact path="/" />
          <Route path="/home" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/shop" component={Shop} />
          <Route path="/dropdown/action" component={Shop} />
          {/* <Route path="/exit" component={(props)=><Exit handler={this.props.handler}/>} /> */}
          
        </Switch>
      </Router>
    );
  }
}

export default Menu;
