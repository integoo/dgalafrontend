import React from 'react';

class SelectSucursales extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            sucursales:[],
            SucursalId: ""
        }
    }

    async componentDidMount(){
        let arregloSucursales = await this.getSucursales();
        const SucursalAsignada = parseInt(this.props.SucursalAsignada)
        if(SucursalAsignada !== 100){
            arregloSucursales = arregloSucursales.filter(element => element.SucursalId === SucursalAsignada)
        }
        if(arregloSucursales.error){
            console.log(arregloSucursales.error)
            alert(arregloSucursales.error)
            return;
        }
        this.setState({
            sucursales: arregloSucursales,
            SucursalId: arregloSucursales[0].SucursalId
        })
        try{
            this.props.onhandleSucursal(arregloSucursales[0].SucursalId)
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    async getSucursales(){
        const url = this.props.url + `/api/catalogos/10`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleSucursales = (e) =>{
        const SucursalId = e.target.value
        this.setState({
            SucursalId: SucursalId,
        })
        this.props.onhandleSucursal(SucursalId)
    }
    handleRender = () =>{
        return(
            <select onChange={this.handleSucursales}>
                {this.state.sucursales.map((element,i) => (<option key={i} value={element.SucursalId}>{element.Sucursal}</option>))}
            </select>
        )
    }

    render(){
        return(
            <React.Fragment>
                <this.handleRender />
            </React.Fragment>
        )
    }
}

export default SelectSucursales;