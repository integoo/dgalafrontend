import React from 'react';

export default class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SignIn: false,
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
        let domain;
        if(user === 'desarrollo'){
            domain=`localhost`
            port = 4001
        }else{
            //port = 3001
            port = 8443 //Puerto alternativo a 443 https el cual ya está ocupado por dgalafront-end Apache
            domain=`grupodgala.com`
            //domain=`decorafiestas.com`
        }
        //const url = `http://decorafiestas.com:${port}/login`
        //const protocol = `http`
        const protocol = `https`
        const path = `/api/login`
        
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
                    this.props.handler(data.SucursalId,true, data.accessToken,data.db_name,data.Administrador,data.PerfilTransacciones,data.user,data.ColaboradorId)
                    this.props.onhandleUrl(url)
                } else{
                    console.log(data.error)
                    alert("Error: "+data.error)
                    if(data.error === 'Usuario No Existe'){
                        this.usuarioInput.current.focus();
                        this.usuarioInput.current.select();
                    }else{
                        this.passwordInput.current.focus();
                        this.passwordInput.current.select();
                    }
                }
        } catch(error){
            console.log(error)
            alert(error)
            this.usuarioInput.current.focus();
            
        }
        
    }

    render(){
        //const logo = 'https://grupodgala.com/LogoDGala.png'
        const logo = 'LogoDGala.png'

        return(
        <React.Fragment>
            <div className="body-center text-center">
                <form className="form-signin" onSubmit={this.someMethod}>
                    <img className="mb-4" src={logo} alt="" width="148" height="102" />
                    <h1 className="h3 mb-3 font-weight-bold" style={{color:"darkblue"}}>Grupo D'Gala</h1>
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
                        <p className="mt-5 mb-3 text-muted">&copy;{this.props.jsonv.VersionFecha}{this.props.jsonv.Version}</p>
                        <span style={{color:"blue"}}>Powered by</span><span style={{marginLeft:"2px",color:"red"}}>Integoo.com</span>
                </form>
            </div>
        </React.Fragment>
        )
    }
}

