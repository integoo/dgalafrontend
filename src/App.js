import React, { Component } from 'react'

import Login from './components/Login'
import Menu from './components/Menu'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      isLoggedIn:false
    }

  }

  handler = (param) => {
    this.setState({
      isLoggedIn: param
    })
  }
  
  render(){

      return (
        <div className="App">
          {this.state.isLoggedIn ? <Menu /> : <Login handler={this.handler}/>}
        </div>
      );

    }
  }

export default App;
