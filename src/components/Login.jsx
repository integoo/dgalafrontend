import { render } from '@testing-library/react';
import React, { Component } from 'react';

export default class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SignIn: false
        }

        this.usuarioInput = React.createRef();
    }

    someMethod =  async (e) => {
        e.preventDefault();

        let json = {
            user: e.target.elements.usuario.value.toLowerCase(),
            password: e.target.elements.password.value
        };

        const url = 'http://decorafiestas.com:3001/login'
        try{
                const response = await fetch(url, {
                    method:'POST',
                    body: JSON.stringify(json),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                if(data.error === ""){
                    /* ***************TOKEN*************************** */
                    sessionStorage.setItem('myToken', data.accessToken);
                    sessionStorage.setItem('user', data.user);
                    /* *********************************************** */
                    this.props.handler(true, data.accessToken)
                } else{
                    console.log(data.error)
                    alert("Error: "+data.error)
                    this.usuarioInput.current.focus();
                }
        } catch(error){
            console.log(error)
            alert(error)
            this.usuarioInput.current.focus();
            
            //alert("No se pudo lograr la Conexión. Por favor intente de nuevo.")
        }
        
    }

    //Este método corre el método del Parent Component para actualizar el state
    // someMethod = () => {
    //      this.props.handler(true)
    // }


    render(){

        //const handler = this.props.handler
        //const logo = 'https://grupodgala.com/LogoDGala.png'

        return(
        <React.Fragment>
            <div className="body-center text-center">
                <form className="form-signin" onSubmit={this.someMethod}>
                <img className="mb-4" src={'https://grupodgala.com/LogoDGala.png'} alt="" width="122" height="92" />
                {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
                <h1 className="h3 mb-3 font-weight-bold" style={{color:"darkblue"}}><i>Limpiaduría D'Gala</i></h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="text" id="inputEmail" className="form-control" placeholder="Username" name="usuario" ref={this.usuarioInput} required autoFocus></input>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="password" required></input>
                <div className="checkbox mb-3">
                        <label>
                             <input type="checkbox" value="remember-me" /> Remember me 
                        </label>
                        
                </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2017-2020</p>
                </form>
            </div>
        </React.Fragment>


        )
    }
}

