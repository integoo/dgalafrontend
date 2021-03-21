import React from 'react'

import Login from './components/Login'
import Menu from './components/Menu'

class App extends React.Component{
  constructor(props){
    super(props)

    this.state={
      isLoggedIn:false,
      accessToken: '',
      dbName: '',
    }

  }

  handlerAppState = (param, param2,paramDB) => {
    this.setState({
      isLoggedIn: param,
      accessToken: param2,
      dbName: paramDB,
    })
  }

  render(){
      return (
        <div className="App">
          {this.state.isLoggedIn ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} dbName={this.state.dbName} /> 
                                  : <Login handler={this.handlerAppState} />}
        </div>
      );

    }
  }

export default App;
