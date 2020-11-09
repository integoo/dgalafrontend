import React, {Component} from 'react'

class Login extends React.Component{
    render(){
        const logo = 'https://picsum.photos/100'

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
            //border: "2px solid red",
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

        
        return(
            <React.Fragment>
                <div style={styleBody}>
                    <div className="container" style={styleContainer}>
                        <form style={styleForm}>
                        <img src={logo}  alt="logo" />
                            <h3 className="font-weight-bold font-italic mt-4">Grupo D'Gala</h3>
                            <input style={styleInput} type="text" placeholder="Usuario" autoFocus />
                            <input style={styleInput} type="password" placeholder="Password" />
                            <button className="btn btn-primary btn-block m-4">Entrar</button>
                        </form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Login