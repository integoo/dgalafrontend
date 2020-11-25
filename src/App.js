import React, { Component } from 'react'

import Login from './components/Login'
import Menu from './components/Menu'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      isLoggedIn:false,
      accessToken: ''
    }

  }

  handlerAppState = (param, param2) => {
    this.setState({
      isLoggedIn: param,
      accessToken: param2
    })
  }

  render(){
      return (
        <div className="App">
          {this.state.isLoggedIn ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} /> : <Login handler={this.handlerAppState} />}
        </div>
      );

    }
  }

export default App;
