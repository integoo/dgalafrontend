import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import Ingresos from './Ingresos';
import Productos from "./Productos"
import ComprasRecepcion from "./ComprasRecepcion"
import ComprasConsulta from "./ComprasConsulta"
import PuntoDeVenta from './PuntoDeVenta'
import RetirosDeCaja from './RetirosDeCaja'
import VentasConsultaSucursalesHoy from './VentasConsultaSucursalesHoy'
import VentasConsulta from './VentasConsulta'
import Kardex from './Kardex'
import AjustesInventario from './AjustesInventario'
import TraspasosSalida from './TraspasosSalida'
import InventarioCiclico from './InventarioCiclico'
import InventarioPerpetuo from './InventarioPerpetuo'
import VentasConsultaFechaProducto from './VentasConsultaFechaProducto'
import VentasConsultaCategorias from "./VentasConsultaCategorias";


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: this.props.accessToken,
      //url: "http://decorafiestas.com:3001"
      url: this.props.url,
    };
  }

  componentWillUnmount(){
    <Redirect to="/" />
  }

  signOut = () => {
    this.props.handler(false,null,null)
  }

  render() {
    const linkStyle = {
      color: "white"
    };
//***  Aquí esta el nombre de la Base de Datos como constante producciondb ******/

    let classes = "navbar navbar-expand-lg navbar-white bg-"
    classes+= (this.props.dbName) === 'dgaladb' ? "primary" : "danger"

    // const ambientePruebas = (this.props.dbName) === 'dgaladb' ? '' : 'PRUEBAS '+this.props.url
    const ambientePruebas = (this.props.dbName) === 'dgaladb' ? <span style={{fontSize:".5rem"}}>{this.props.Version}</span> : 'PRUEBAS '+this.props.url

//******************************************************************************** */

    return (
      <Router>
        <Redirect to="/" />
        <nav className={classes} >
            <Link to="/" style={linkStyle}>
                {/* <span className="navbar-brand">D'Gala</span> */}
                {/* IMPORTANTE: SE AGREGARON LAS CLASES data-toggle="collapse" data-target=".navbar-collapse.show" PARA COLLAPSAR EL MENU MOBILE DESPUES DE DAR CLICK */}
                <span className="navbar-brand" data-toggle="collapse" data-target=".navbar-collapse.show">D'Gala {ambientePruebas}</span>
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
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Catálogos
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/catalogos/productos" style={linkStyle}>
                        <span className="dropdown-item">Productos</span>
                    </Link>
                      
                    <div className="dropdown-divider"></div>
                    <Link to="/limpiaduria/estadoderesultados" style={linkStyle}>
                      <span className="dropdown-item">Estado de Resultados</span>
                    </Link>
                  </div>
                </li>
              </Link>





              <Link to="/" style={linkStyle}>
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Punto de Venta
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/puntodeventa/puntodeventa" style={linkStyle}>
                        <span className="dropdown-item">Punto de Venta</span>
                    </Link>
                      
                    <div className="dropdown-divider"></div>
                    <Link to="/puntodeventa/retirosdecaja" style={linkStyle}>
                      <span className="dropdown-item">Retiros de Caja</span>
                    </Link>
                  </div>
                </li>
              </Link>








              {/* <Link to="/puntodeventa" style={linkStyle}>
                <li className="nav-item" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span className="nav-link">
                    Punto de Venta <span className="sr-only">(current)</span>
                  </span>
                </li>
              </Link> */}






              <Link to="/" style={linkStyle}>
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Ventas
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/ventas/ventasconsultasucursaleshoy" style={linkStyle}>
                      <span className="dropdown-item">Consulta Ventas Sucursales Hoy</span>
                    </Link>
                    
                    <Link to="/ventas/consultaventascategorias" style={linkStyle}>
                      <span className="dropdown-item">Consulta Ventas Categorías</span>
                    </Link>
                    <Link to="/ventas/consulta" style={linkStyle}>
                        <span className="dropdown-item">Consulta Ventas (Fecha/Folio/Ticket)</span>
                    </Link>

                    <Link to="/ventas/consultafechaproductos" style={linkStyle}>
                        <span className="dropdown-item">Consulta Ventas (Fecha/Producto)</span>
                    </Link>

                      
                    <div className="dropdown-divider"></div>
                    <Link to="/ventas/estadoventas" style={linkStyle}>
                      <span className="dropdown-item">Estado de Resultados</span>
                    </Link>
                  </div>
                </li>
              </Link>






              <Link to="/" style={linkStyle}>
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
                    <Link to="/contabilidad/ingresos" style={linkStyle}>
                        <span className="dropdown-item">Ingresos</span>
                    </Link>
                    <Link to="/contabilidad/egresos" style={linkStyle}>
                        <span className="dropdown-item">Egresos</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <Link to="/limpiaduria/estadoderesultados" style={linkStyle}>
                      <span className="dropdown-item">Estado de Resultados</span>
                    </Link>
                  </div>
                </li>
              </Link>






              <Link to="/" style={linkStyle}>
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Compras
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/compras/recepcion" style={linkStyle}>
                        <span className="dropdown-item">Compras Recepcion</span>
                    </Link>
                      
                    <Link to="/compras/consulta" style={linkStyle}>
                        <span className="dropdown-item">Compras Consulta</span>
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link to="/compras/estadoderesultados" style={linkStyle}>
                      <span className="dropdown-item">Reportes</span>
                    </Link>
                  </div>
                </li>
              </Link>
              




              <Link to="/" style={linkStyle}>
                <li className="nav-item dropdown" data-toggle="collapse" data-target=".navbar-collapse.show">
                  <span
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Inventario
                  </span>
                  <div
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <Link to="/inventario/kardex" style={linkStyle}>
                        <span className="dropdown-item">Kardex</span>
                    </Link>

                    <Link to="/inventario/ajustesinventario" style={linkStyle}>
                        <span className="dropdown-item">Ajustes Inventario</span>
                    </Link>

                    <Link to="/inventario/traspasossalida" style={linkStyle}>
                      <span className="dropdown-item">Traspasos Salida/Entrada</span>
                    </Link>

                    <Link to="/inventario/inventariociclico" style={linkStyle}>
                      <span className="dropdown-item">Inventario Ciclico</span>
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link to="/inventario/inventarioperpetuo" style={linkStyle}>
                      <span className="dropdown-item">Inventario Perpetuo</span>
                    </Link>
                  </div>
                </li>
              </Link>





            
              <li>
                <Link to="/">
                  <button onClick={this.signOut} className="btn btn-light btn-md mt-1 ml-2">Salir</button>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" />
          <Route exac path="/catalogos/productos" component={() => <Productos accessToken={this.state.accessToken} url={this.state.url}/>} />
          <Route exac path="/contabilidad/ingresos" component={() => <Ingresos accessToken={this.state.accessToken} naturalezaCC="1" />} />
          <Route exac path="/contabilidad/egresos" component={() => <Ingresos accessToken={this.state.accessToken} naturalezaCC="-1" />} />
          <Route path="/compras/recepcion" component={() => <ComprasRecepcion accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path="/compras/consulta" component={() => <ComprasConsulta accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path="/puntodeventa/puntodeventa" component={() => <PuntoDeVenta accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path="/puntodeventa/retirosdecaja" component={() => <RetirosDeCaja accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path="/ventas/ventasconsultasucursaleshoy" component={() => <VentasConsultaSucursalesHoy accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path='/ventas/consultaventascategorias' component={() => <VentasConsultaCategorias accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path='/ventas/consulta' component={() => <VentasConsulta accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador}/>} />
          <Route path='/ventas/consultafechaproductos' component={() => <VentasConsultaFechaProducto accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador}/>} />
          <Route path='/inventario/kardex' component={() => <Kardex accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path='/inventario/ajustesinventario' component={() => <AjustesInventario accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path='/inventario/traspasossalida' component={() => <TraspasosSalida accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador}/>} />
          <Route path='/inventario/inventariociclico' component={() => <InventarioCiclico accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador} />} />
          <Route path='/inventario/inventarioperpetuo' component={() => <InventarioPerpetuo accessToken={this.state.accessToken} url={this.state.url} Administrador={this.props.Administrador}/>} />
        </Switch>
      </Router>
    );
  }
}

export default Menu;
