import React from 'react'

import Login from './components/Login'
import Menu from './components/Menu'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      url: "",
      isLoggedIn:false,
      accessToken: '',
      dbName: '',
      Administrador: "",
      Version: " v1.4",
      VersionFecha: " 2024 Oct 05",
      PerfilTransacciones: "",
      user: "",
    }
  }

  handleUrl = (url) =>{
    this.setState({
      url: url,
    })
  }

  handlerAppState = (sucursalId,trueFalse, accessToken,dbName, Administrador, PerfilTransacciones, user, colaboradorId) => {
    this.setState({
      SucursalId: sucursalId,
      isLoggedIn: trueFalse,
      accessToken: accessToken,
      dbName: dbName,
      Administrador: Administrador,
      PerfilTransacciones: PerfilTransacciones,
      user: user,
      ColaboradorId: colaboradorId,
    })
  }

  render(){
    const jsonVersion = {
      Version: this.state.Version,
      VersionFecha: this.state.VersionFecha
    }

    const propsMenu = {
      SucursalId: this.state.SucursalId,
      ColaboradorId: this.state.ColaboradorId,
      accessToken: this.state.accessToken,
      dbName: this.state.dbName,
      url: this.state.url,
      Administrador: this.state.Administrador,
      Version: this.state.Version,
      user: this.state.user,
      PerfilTransacciones: this.state.PerfilTransacciones,
    }

      return (
        <div className="App">
          {this.state.isLoggedIn && this.state.url 
            // ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} dbName={this.state.dbName} url={this.state.url} Administrador={this.state.Administrador} Version={this.state.Version} PerfilTransacciones={this.state.PerfilTransacciones} user={this.state.user}/> 
            ? <Menu handler={this.handlerAppState} onPropsMenu={propsMenu} /> 
            : <Login handler={this.handlerAppState} onhandleUrl={this.handleUrl} jsonv={jsonVersion} />
          }
        </div>
      );

    }
  }

export default App;
