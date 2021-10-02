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
      Version: " v1.26",
      VersionFecha: "Oct02",
    }

  }

  handleUrl = (url) =>{
    this.setState({
      url: url,
    })
  }

  handlerAppState = (param, param2,paramDB, Administrador) => {
    this.setState({
      isLoggedIn: param,
      accessToken: param2,
      dbName: paramDB,
      Administrador: Administrador,
    })
  }

  render(){
      return (
        <div className="App">
          {this.state.isLoggedIn && this.state.url ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} dbName={this.state.dbName} url={this.state.url} Administrador={this.state.Administrador} Version={this.state.Version}/> 
                                  : <Login handler={this.handlerAppState} onhandleUrl={this.handleUrl} Version={this.state.Version} VersionFecha={this.state.VersionFecha} />}
        </div>
      );

    }
  }

export default App;
