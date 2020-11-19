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

  handlerAppState = (param) => {
    this.setState({
      isLoggedIn: param
    })
  }
  
  render(){

      return (
        <div className="App">
          {this.state.isLoggedIn ? <Menu handler={this.handlerAppState}/> : <Login handler={this.handlerAppState} history={this.props.history}/>}
        </div>
      );

    }
  }

export default App;
