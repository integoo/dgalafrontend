import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
// import { FcKey } from 'react-icons/fc'
import { ImKey } from 'react-icons/im'
 
import Egresos from './Egresos';
import EstadoResultadosLimpiaduria from './EstadoResultadosLimpiaduria'
import VentasIngresos from './VentasIngresos'
import Productos from "./Productos"
import ComprasRecepcion from "./ComprasRecepcion"
import ComprasConsulta from "./ComprasConsulta"
import PuntoDeVenta from './PuntoDeVenta'
import RetirosDeCaja from './RetirosDeCaja'
import VentasConsultaSucursalesHoy from './VentasConsultaSucursalesHoy'
import VentasConsulta from './VentasConsulta'
import VentasBI from './VentasBI'
import ConsultaArticulo from './ConsultaArticulo'
import Kardex from './Kardex'
import ProductosMasDesplazados from './ProductosMasDesplazados'
import AjustesInventario from './AjustesInventario'
import CambiosDePresentacion from './CambiosDePresentacion'
import TraspasosSalida from './TraspasosSalida'
import InventarioCiclico from './InventarioCiclico'
import InventarioFaltantes from "./InventarioFaltantes"
import InventarioPerpetuo from './InventarioPerpetuo'
import VentasConsultaFechaProducto from './VentasConsultaFechaProducto'
import VentasConsultaCategorias from "./VentasConsultaCategorias";
import VentasBiLavamaticaTienda from "./VentasBiLavamanticaTienda";
import EgresosLimpiaduriaBI from "./EgresosLimpiaduriaBI";

import './Menu.css'


class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SucursalId: this.props.onPropsMenu.SucursalId,
      ColaboradorId: this.props.onPropsMenu.ColaboradorId,
      accessToken: this.props.onPropsMenu.accessToken,
      url: this.props.onPropsMenu.url,
      perfilTransacciones: this.props.onPropsMenu.PerfilTransacciones, //analista,gerente,colaborador
      user: this.props.onPropsMenu.user,
      userScreen: false,
      userScreen2: false,
      srcrobot: null,
    };
  }

  componentDidMount(){
    //** ACCEDE A LA IMAGEN ALEATORIA DEL USUARIO (ROBOT) */
    const srcrobot = "https://robohash.org/user/"+Math.round(Math.random()*100)
    this.setState({srcrobot: srcrobot})
  }

  componentWillUnmount(){
    <Redirect to="/" />
  }

  signOut = () => {
    this.props.handler(0,false,null,null,null,null,null,0)
  }

  render() {
    const linkStyle = {
      color: "white",
    };
//***  Aquí esta el nombre de la Base de Datos como constante producciondb ******/

    let classes = "navbar navbar-expand-lg navbar-white bg-"
    classes+= (this.props.dbName) === 'dgaladb' ? "primary" : "danger"

    // const ambientePruebas = (this.props.dbName) === 'dgaladb' ? '' : 'PRUEBAS '+this.props.url
    const ambientePruebas = (this.props.dbName) === 'dgaladb' ? <span style={{fontSize:".5rem"}}>{this.props.Version}</span> : 'PRUEBAS '+this.props.url

//******************************************************************************** */
//***  ACTIVA PRIVILEGIOS O ACCESOS EN EL MENU DE ACUERDO AL "PERFIL" DEL USUARIO*/
//** ACTUALMENTE SOLO ADMINISTRA ACCESOS A OPCIONES DE MENU QUE GRABAN O INSERTAN EN LA BASE DE DATOS */
const perfilTransacciones = this.state.perfilTransacciones
let acceso = false
if(perfilTransacciones === "Gerente"){
  // spanclassname = "nav-link dropdown-toggle"
  acceso = true
}
if(perfilTransacciones === "Analista"){
  acceso = false
}
if(perfilTransacciones === "Colaborador"){
  acceso = true
}
//******************************************************************************** */
    return (
      <Router>










        {this.state.userScreen 
        ?
          <div className="userScreen">
              <div style={{height:"80px",borderRadius:"10px 10px 0 0", backgroundColor:"lightgrey"}}>
                  <div style={{position:"relative", top:"50px", display:"flex", justifyContent:"center", alignItems:"center", flexDirection:"column"}}>
                    <div>
                      <img
                            src={this.state.srcrobot}
                            alt="Robohash"
                            width={60}
                            height={60}
                            style={{
                              background: "rgb(244,240,236)",
                              borderRadius: "50%",
                              border: "4px solid red",
                              borderColor: "red yellow green orange",
                            }}
                            />
                    </div>
                    <div>
                      {this.state.user}
                    </div>
                  </div>
                </div>
            <div style={{width:"100%", fontSize:"0.7rem", margin:"60px 0 0 0 "}}>
              <div>
                <div className="userScreenOptions" onClick={()=> {
                                                                  this.setState({userScreen: false, userScreen2: true})  
                                                                  // }}><FcKey /><span style={{width: "800px", marginLeft:"5px"}}>Cambio de Password</span></div>
                                                                  }}><ImKey /><span style={{width: "800px", marginLeft:"5px"}}>Cambio de Password</span></div>
                </div>

              </div>
              <hr style={{position: "relative", top:"60px"}}/>
            </div>
        :
            null
        }

        {this.state.userScreen2
        ?
          <div className="userScreen2">
            <h1>En Construcción ...!!!</h1>
            <button>Actualizar</button>
            <button>Cancelar</button>
          </div>
        :
          null
        }













        <Redirect to="/" />
        <nav className={classes}>
          <Link to="/" style={linkStyle}>
            {/* <span className="navbar-brand">D'Gala</span> */}
            {/* IMPORTANTE: SE AGREGARON LAS CLASES data-toggle="collapse" data-target=".navbar-collapse.show" PARA COLLAPSAR EL MENU MOBILE DESPUES DE DAR CLICK */}
            <span
              className="navbar-brand"
              data-toggle="collapse"
              data-target=".navbar-collapse.show"
            >
              <span style={{ marginRight: "10px" }}>
                D'Gala {ambientePruebas}
              </span>

              {/* IMAGEN DEL USUARIO ROBOT */}
              <img
                src={this.state.srcrobot}
                alt="Robohash"
                width={60}
                height={60}
                style={{
                  background: "rgb(244,240,236)",
                  borderRadius: "50%",
                  border: "4px solid red",
                  // borderColor: "red yellow black"
                  // borderColor: "red yellow purple green",
                  borderColor: "red yellow green orange",
                }}
                onClick={()=> {
                                if(this.state.userScreen2){
                                  this.setState({userScreen2: false})
                                }else{
                                  this.setState({userScreen: !this.state.userScreen, userScreen2: false})
                                }
                              }}
              />

            </span>
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





          <div className="collapse navbar-collapse" id="navbarSupportedContent" >

            <ul className="navbar-nav mr-auto">
              <Link to="/" style={linkStyle}>
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  <span
                  //Acceso Seguro
                    className={acceso === true ? "nav-link dropdown-toggle" : "nav-link dropdown-toggle disabled"}
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

                    {/* <div className="dropdown-divider"></div>
                    <Link to="/limpiaduria/estadoderesultados" style={linkStyle}>
                      <span className="dropdown-item">Reportes</span>
                    </Link> */}
                  </div>
                </li>
              </Link>

              <Link to="/" style={linkStyle} >
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  <span
                  // Acceso Seguro
                    className={acceso === true ? "nav-link dropdown-toggle" : "nav-link dropdown-toggle disabled"}
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
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
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
                    <Link
                      to="/ventas/ventasconsultasucursaleshoy"
                      style={linkStyle}
                    >
                      <span className="dropdown-item">
                        Consulta Ventas Sucursales Hoy
                      </span>
                    </Link>

                    <Link
                      to="/ventas/consultaventascategorias"
                      style={linkStyle}
                    >
                      <span className="dropdown-item">
                        Consulta Ventas Categorías
                      </span>
                    </Link>
                    <Link to="/ventas/consulta" style={linkStyle}>
                      <span className="dropdown-item">
                        Consulta Ventas (Fecha/Folio/Ticket)
                      </span>
                    </Link>

                    <Link to="/ventas/consultafechaproductos" style={linkStyle}>
                      <span className="dropdown-item">
                        Consulta Ventas (Fecha/Producto)
                      </span>
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link to="/ventas/bi" style={linkStyle}>
                      <span className="dropdown-item">
                        Inteligencia de Negocio/BI Limpiaduría
                      </span>
                    </Link>
                    <Link
                      to="/ventas/VentasBiLavamaticaTienda"
                      style={linkStyle}
                    >
                      <span className="dropdown-item">
                        Inteligencia de Negocio/BI Lavamatica/Tienda
                      </span>
                    </Link>
                  </div>
                </li>
              </Link>

              <Link to="/" style={linkStyle}>
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
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

                    {/* Acceso Seguro*/}
                    <Link to={acceso === true ? "/limpiaduria/catalogo" : "#"} style={linkStyle}>
                    {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled"} >Catalogo</span>
                    </Link>

                      {/* Acceso Seguro*/}
                    <Link to={acceso === true ? "/contabilidad/ingresos" : "#"} style={linkStyle}>
                      {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled"}>Ingresos</span>
                    </Link>

                     {/* Acceso Seguro*/}
                    <Link to={acceso === true ? "/contabilidad/egresos" : "#"} style={linkStyle}>
                     {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled"}>Egresos</span>
                    </Link>

                    <div className="dropdown-divider"></div>
                    <Link
                      to="/limpiaduria/estadoderesultados"
                      style={linkStyle}
                    >
                      <span className="dropdown-item">
                        Estado de Resultados Limpiaduría
                      </span>
                    </Link>
                    <Link
                      to="/limpiaduria/EgresosLimpiaduriaBI"
                      style={linkStyle}
                    >
                      <span className="dropdown-item">
                        Egresos Limpiaduría BI
                      </span>
                    </Link>

                  </div>
                </li>
              </Link>

              <Link to="/" style={linkStyle}>
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
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

                    {/* Acceso Seguro*/}
                    <Link to={acceso === true ? "/compras/recepcion" : "#"} style={linkStyle}>
                    {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled" }>Compras Recepcion</span>
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
                <li
                  className="nav-item dropdown"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
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
                    <Link to="/inventario/consultaarticulo" style={linkStyle}>
                      <span className="dropdown-item">Consulta Artículo</span>
                    </Link>

                    <Link to="/inventario/kardex" style={linkStyle}>
                      <span className="dropdown-item">Kardex</span>
                    </Link>

                    <Link to="/inventario/productosmasdesplazadosmargen" style={linkStyle}>
                      <span className="dropdown-item">Productos Más Desplazados (Margen)</span>
                    </Link>

                    {/* Acceso Seguro*/}
                    <Link to={acceso === true ?"/inventario/ajustesinventario" : "#"} style={linkStyle}>
                    {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled" }>Ajustes Inventario</span>
                    </Link>

                    
                    {/* Acceso Seguro*/}
                    <Link
                      to={acceso === true ? "/inventario/cambiosdepresentacion" : "#"}
                      style={linkStyle}
                      >
                      {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled"} >
                        Cambios de Presentación
                      </span>
                    </Link>


                    {/* Acceso Seguro*/}
                    <Link to={acceso === true ? "/inventario/traspasossalida" : "#"} style={linkStyle}>
                    {/* Acceso Seguro*/}
                      <span className={acceso === true ? "dropdown-item" : "dropdown-item disabled" }>
                        Traspasos Salida/Entrada
                      </span>
                    </Link>


                    <Link to="/inventario/inventariociclico" style={linkStyle}>
                      <span className="dropdown-item">Inventario Cíclico</span>
                    </Link>

                    <Link to="/compras/inventariofaltantes" style={linkStyle}>
                      <span className="dropdown-item">
                        Faltantes Inventario
                      </span>
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
                  <button
                    onClick={this.signOut}
                    className="btn btn-light btn-md mt-1 ml-2"
                  >
                    Salir
                  </button>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" />
          <Route
            exac
            path="/catalogos/productos"
            component={() => (
              <Productos
                accessToken={this.state.accessToken}
                url={this.state.url}
              />
            )}
          />
          <Route
            exac
            path="/contabilidad/ingresos"
            component={() => (
              <VentasIngresos
                accessToken={this.state.accessToken}
                naturalezaCC="1"
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            exac
            path="/contabilidad/egresos"
            component={() => (
              <Egresos
                accessToken={this.state.accessToken}
                naturalezaCC="-1"
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            exac
            path="/limpiaduria/estadoderesultados"
            component={() => (
              <EstadoResultadosLimpiaduria
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            exac
            path="/limpiaduria/EgresosLimpiaduriaBI"
            component={() => (
              <EgresosLimpiaduriaBI
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/compras/recepcion"
            component={() => (
              <ComprasRecepcion
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/compras/consulta"
            component={() => (
              <ComprasConsulta
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/puntodeventa/puntodeventa"
            component={() => (
              <PuntoDeVenta
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/puntodeventa/retirosdecaja"
            component={() => (
              <RetirosDeCaja
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/ventasconsultasucursaleshoy"
            component={() => (
              <VentasConsultaSucursalesHoy
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/consultaventascategorias"
            component={() => (
              <VentasConsultaCategorias
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/consulta"
            component={() => (
              <VentasConsulta
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/consultafechaproductos"
            component={() => (
              <VentasConsultaFechaProducto
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/bi"
            component={() => (
              <VentasBI
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/ventas/VentasBiLavamaticaTienda"
            component={() => (
              <VentasBiLavamaticaTienda
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/consultaarticulo"
            component={() => (
              <ConsultaArticulo
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/kardex"
            component={() => (
              <Kardex
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/productosmasdesplazadosmargen"
            component={() => (
              <ProductosMasDesplazados
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/ajustesinventario"
            component={() => (
              <AjustesInventario
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/cambiosdepresentacion"
            component={() => (
              <CambiosDePresentacion
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/traspasossalida"
            component={() => (
              <TraspasosSalida
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/inventariociclico"
            component={() => (
              <InventarioCiclico
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/compras/inventariofaltantes"
            component={() => (
              <InventarioFaltantes
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
          <Route
            path="/inventario/inventarioperpetuo"
            component={() => (
              <InventarioPerpetuo
                accessToken={this.state.accessToken}
                url={this.state.url}
                Administrador={this.props.Administrador}
              />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default Menu;
