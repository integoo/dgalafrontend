import React, {Component} from 'react'

class Login extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SignIn: false,
            user:"eugalde",
            password:"clean1972"
        }
        //this.Firmarse = this.Firmarse.bind(this)
        this.usuarioInput = React.createRef();
    }
    // Firmarse (e) {
    //     e.preventDefault();
    //     if(e.target.elements.usuario.value === this.state.user && e.target.elements.password.value === this.state.password ){
    //         //alert(e.target.elements.usuario.value+" "+e.target.elements.password.value)
    //         //await this.setState({SignIn: true})
    //         this.setState((state, props) =>({
    //             SignIn:true
    //         }))
    //         alert("SIII :" +this.state.SignIn)
    //     }else{
    //         alert("Las Credenciales no son corrrectas!!!")
    //         this.usuarioInput.current.focus();
    //     }
    // }


    someMethod =  (e) => {
        e.preventDefault();
        if(e.target.elements.usuario.value === this.state.user && e.target.elements.password.value === this.state.password ){

            //Este método corre el método del Parent Component para actualizar el state
            this.props.handler(true)

        }else{
            alert("Las Credenciales no son corrrectas!!!")
            this.usuarioInput.current.focus();
        }
    }

    //Este método corre el método del Parent Component para actualizar el state
    // someMethod = () => {
    //      this.props.handler(true)
    // }

    render(){
        const handler = this.props.handler
        //const logo = 'https://picsum.photos/100'
        const logo = 'https://grupodgala.com/LogoDGala.png'

        const styleLogo = {
            width:"130px",
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
            height: "50vh",
            alignItems: "center"
        }

        const styleInput = {
            margin: "1px",
            width: "250px",
            height: "40px",
            padding:"0 0 0 10px" 
        }


        // function Greeting(props){
        //     const isLoggedIn = props.isLoggedIn
        //     if(isLoggedIn){
        //         return <div>Menu Page</div>
        //     }else{
        //         return 
        //          <div>Menu Page</div>
                    
                
                
        //     }
        //}

        return(
                <React.Fragment>
                    <div style={styleBody}>
                    <div className="container" style={styleContainer}>
                {/* return <button onClick={this.someMethod}>PRESIONAR</button> */}
                        {/* <form style={styleForm} onSubmit={this.Firmarse}> */}
                        <form style={styleForm} onSubmit={this.someMethod}>
                        <img src={logo} style={styleLogo} alt="logo" />
                            <h3 className="font-weight-bold font-italic mt-4">Grupo D'Gala</h3>
                            <input style={styleInput} type="text" placeholder="Usuario" name="usuario" ref={this.usuarioInput} autoFocus />
                            <input style={styleInput} type="password" placeholder="Password" name="password"/>
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