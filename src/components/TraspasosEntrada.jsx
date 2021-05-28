import React from 'react';

class TraspasosEntrada extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SucursalId: sessionStorage.getItem("SucursalId"),
            Administrador: "",
        }
    }

    async componentDidMount(){
        // const Administrador = await this.handleAdministrador()
        // this.setState({
        //     Administrador: Administrador,
        // })
    }

    handleAdministrador = async() =>{
        const ColaboradorId = sessionStorage.getItem("ColaboradorId")
        const url = this.props.url + `/api/colaboradoradministrador/${ColaboradorId}`
        let data;
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
            if (data.error){
                console.log(data.error)
                alert(data.error)
            }
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return data[0].Administrador
    }



    handleRender = () =>{
        return(
            <p>Hello Traspasos Entrada</p>
        )
    }

    render(){
        return(
        <React.Fragment>
            <div className="container">
                {this.state.Administrador != "" ? <this.handelRender /> :  <h3>Loading . . . </h3> }
            </div>
        </React.Fragment>
        )
    }
}
export default TraspasosEntrada