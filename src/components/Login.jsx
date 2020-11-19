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

        const url = 'https://grupodgala.com:3000/login'
        try{
                const response = await fetch(url, {
                    method:'POST',
                    body: JSON.stringify(json),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                })
                const data = await response.json()
                alert(JSON.stringify(data))
                alert(data.accessToken)
                /* ***************TOKEN*************************** */
                sessionStorage.setItem('myToken', data.accessToken);
                sessionStorage.setItem('myColaborador', data.colaborador);
                /* *********************************************** */

                if(data.id === 'Success!!!' ){
                
                    //Este método corre el método del Parent Component para actualizar el state
                    this.props.handler(true)
    
                }else{
                    alert("Las Credenciales no son corrrectas!!!")
                    this.usuarioInput.current.focus();
                }
        } catch(error){
            alert(error)
            //alert("No se pudo lograr la Conexión. Por favor intente de nuevo.")
        }
        
    }

    //Este método corre el método del Parent Component para actualizar el state
    // someMethod = () => {
    //      this.props.handler(true)
    // }


    render(){

        const handler = this.props.handler
        const logo = 'https://grupodgala.com/LogoDGala.png'

        return(
        <React.Fragment>
            <div className="body-center text-center">
                <form className="form-signin" onSubmit={this.someMethod}>
                <img className="mb-4" src={'https://grupodgala.com/LogoDGala.png'} alt="" width="122" height="92" />
                {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
                <h1 className="h3 mb-3 font-weight-bold" style={{color:"darkblue"}}><i>Limpiaduría D'Gala</i></h1>
                <label for="inputEmail" className="sr-only">Email address</label>
                <input type="text" id="inputEmail" class="form-control" placeholder="Username" name="usuario" ref={this.usuarioInput} required autoFocus></input>
                <label for="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="password" required></input>
                <div className="checkbox mb-3">
                        {/* <label> */}
                        {/* <input type="checkbox" value="remember-me"> Remember me */}
                        {/* </label> */}
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

