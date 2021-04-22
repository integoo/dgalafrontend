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
    }

  }

  handleUrl = (url) =>{
    this.setState({
      url: url,
    })
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
          {this.state.isLoggedIn && this.state.url ? <Menu handler={this.handlerAppState} accessToken={this.state.accessToken} dbName={this.state.dbName} url={this.state.url} /> 
                                  : <Login handler={this.handlerAppState} onhandleUrl={this.handleUrl} />}
        </div>
      );

    }
  }

export default App;
