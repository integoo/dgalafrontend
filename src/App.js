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
      Version: " v1.56",
      VersionFecha: " 2023 Abr 09",
    }

  }

  handleUrl = (url) =>{
    this.setState({
      url: url,
    })
  }

  handlerAppState = (param, param2,paramDB, Administrador, PerfilTransacciones) => {
    this.setState({
      isLoggedIn: param,
      accessToken: param2,
      dbName: paramDB,
      Administrador: Administrador,
      PerfilTransacciones: PerfilTransacciones
    })
  }

  render(){
    const jsonVersion = {
      Version: this.state.Version,
      VersionFecha: this.state.VersionFecha
    }

      return (
        <div className="App">
          {this.state.isLoggedIn && this.state.url 
            ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} dbName={this.state.dbName} url={this.state.url} Administrador={this.state.Administrador} Version={this.state.Version} PerfilTransacciones={this.state.PerfilTransacciones}/> 
            // : <Login handler={this.handlerAppState} onhandleUrl={this.handleUrl} Version={this.state.Version} VersionFecha={this.state.VersionFecha} />
            : <Login handler={this.handlerAppState} onhandleUrl={this.handleUrl} jsonv={jsonVersion} />
          }
        </div>
      );

    }
  }

export default App;
