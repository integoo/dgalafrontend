import React, {Component} from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SignIn: false
        }
        //this.Firmarse = this.Firmarse.bind(this)
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

        const styleLogo = {
            //width:"130px",
            width:"8em",
            height:"90px"
        }

        const styleBody = {
            width: "100vw",
            height: "100vh",
            background: "gainsboro"
        }

        const styleContainer = {
            display: "flex",
            justifyContent: "center",
            height: "60vh",
            alignItems: "center"

        }
        const styleForm = {
            width: "250px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "80vh",
            alignItems: "center"
        }

        const styleInput = {
            margin: "1px",
            width: "250px",
            height: "40px",
            padding:"0 0 0 10px" 
        }

        return(
                <React.Fragment>
                    <div style={styleBody}>
                    <div className="container" style={styleContainer}>
                        <form style={styleForm} onSubmit={this.someMethod}>
                        <img src={logo} style={styleLogo} alt="logo" />
                            <h3 className="font-weight-bold font-italic mt-4">Grupo D'Gala</h3>
                            <input style={styleInput} type="text" placeholder="Usuario" name="usuario" ref={this.usuarioInput} autoFocus />
                            <input style={styleInput} type="password" placeholder="Password" name="password" />
                            <button type="submit" className="btn btn-primary btn-block m-4">Entrar</button>
                            <p>&copy; 2020-10-09</p>
                        </form>
                    </div>
                </div>
                </React.Fragment>
        )
    }
}

export default Login