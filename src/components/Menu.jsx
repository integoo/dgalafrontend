import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Ingresos from './Ingresos';
import Home from "./Home";
import About from "./Ingresos";
import Shop from "./Shop";


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: this.props.accessToken
    };
  }

  componentWillUnmount(){
    <Redirect to="/" />
  }

  signOut = () => {
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
                {/* <span className="navbar-brand">D'Gala</span> */}
                {/* IMPORTANTE: SE AGREGARON LAS CLASES data-toggle="collapse" data-target=".navbar-collapse.show" PARA COLLAPSAR EL MENU MOBILE DESPUES DE DAR CLICK */}
                <span className="navbar-brand" data-toggle="collapse" data-target=".navbar-collapse.show">D'Gala</span>
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
                {/* <li className="nav-item dropdown"> */}
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Contabilidad
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/limpiaduria/catalogo" style={linkStyle}>
                        <span className="dropdown-item">Catalogo</span>
                      </Link>
                      <Link to="/limpiaduria/ingresos" style={linkStyle}>
                        <span className="dropdown-item">Ingresos</span>
                      </Link>
                      <Link to="/limpiaduria/egresos" style={linkStyle}>
                        <span className="dropdown-item">Egresos</span>
                      </Link>
                    {/* <span className="dropdown-item">Another action</span> */}
                    <div className="dropdown-divider"></div>
                    <Link to="/limpiaduria/estadoderesultados" style={linkStyle}>
                      <span className="dropdown-item">Estado de Resultados</span>
                    </Link>
                  </div>
                </li>
              </Link>

              <Link to="/puntodeventa" style={linkStyle}>
                {/* <li className="nav-item"> */}
                <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span className="nav-link">
                    Punto de Venta <span className="sr-only">(current)</span>
                  </span>
                </li>
              </Link>

              <li>
                {/* <button onClick={() => {alert("Hello Hello")}} href="#" className="btn btn-light btn-sm mt-1 ml-2">Salir</button> */}
                {/* <button onClick={this.signOut} href="#" className="btn btn-link" style={linkStyle}>Salir</button> */}
                <Link to="/">
                  <button onClick={this.signOut} href="#" className="btn btn-light btn-md mt-1 ml-2">Salir</button>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" />
          <Route path="/limpiaduria/ingresos" component={() => <Ingresos accessToken={this.state.accessToken} />} />
          <Route path="/home" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/shop" component={Shop} />
          <Route path="/dropdown/action" component={Shop} />
        </Switch>
      </Router>
    );
  }
}

export default Menu;
