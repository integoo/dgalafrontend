//import { render } from '@testing-library/react';
import React from 'react';

export default class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SignIn: false
        }

        this.usuarioInput = React.createRef();
        this.passwordInput = React.createRef();
    }

    someMethod =  async (e) => {
        e.preventDefault();
        const user = e.target.elements.usuario.value.toLowerCase()
        let json = {
            user: e.target.elements.usuario.value.toLowerCase(),
            password: e.target.elements.password.value
        };

        let port;
        if(user === 'desarrollo'){
            port = 4001
        }else{
            port = 3001
        }
        //const url = 'http://decorafiestas.com:3001/login'
        //const url = `http://decorafiestas.com:${port}/login`
        const protocol = `http`
        const domain = `decorafiestas.com`
        const path = `/login`
        
        const url = `${protocol}://${domain}:${port}`

        try{
                const response = await fetch(url+path, {
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
                    sessionStorage.setItem('ColaboradorId', data.ColaboradorId)
                    sessionStorage.setItem('SucursalId', data.SucursalId)
                    /* *********************************************** */
                    this.props.handler(true, data.accessToken,data.db_name,data.Administrador)
                    this.props.onhandleUrl(url)
                } else{
                    console.log(data.error)
                    alert("Error: "+data.error)
                    if(data.error === 'Usuario No Existe'){
                        this.usuarioInput.current.focus();
                    }else{
                        this.passwordInput.current.focus();
                    }
                }
        } catch(error){
            console.log(error)
            alert(error)
            this.usuarioInput.current.focus();
            
        }
        
    }

    render(){

        const logo = 'https://grupodgala.com/LogoDGala.png'

        return(
        <React.Fragment>
            <div className="body-center text-center">
                <form className="form-signin" onSubmit={this.someMethod}>
                {/* <img className="mb-4" src={'https://grupodgala.com/LogoDGala.png'} alt="" width="122" height="92" /> */}
                <img className="mb-4" src={logo} alt="" width="122" height="92" />
                {/* <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1> */}
                <h1 className="h3 mb-3 font-weight-bold" style={{color:"darkblue"}}><i>Grupo D'Gala</i></h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input type="text" id="inputEmail" className="form-control" placeholder="Username" name="usuario" ref={this.usuarioInput} required autoFocus></input>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input type="password" id="inputPassword" className="form-control" placeholder="Password" name="password" ref={this.passwordInput} required></input>
                <div className="checkbox mb-3">
                        <label style={{fontSize: ".8em"}}>
                             <input type="checkbox" value="remember-me"/> Remember me 
                        </label>
                        
                </div>
                    <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    <p className="mt-5 mb-3 text-muted">&copy; 2021 Ver 1.1 (May-01)</p>
                </form>
            </div>
        </React.Fragment>
        )
    }
}

