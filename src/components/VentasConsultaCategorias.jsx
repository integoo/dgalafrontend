import React from 'react'

import SelectSucursales from './cmpnt/SelectSucursales'
import InputFecha from './cmpnt/InputFecha'

import './VentasConsultaCategorias.css'

class VentasConsultaCategorias extends React.Component{
    constructor(props){
        super(props)

        this.state={
            SucursalId: sessionStorage.getItem("SucursalId"),
            Administrador: '',
            FechaInicial:"",
            FechaFinal: "",
            ventasCategorias:[],
            totalVenta:0.00,
        }
    }
    async componentDidMount(){
        const Administrador = await this.handleAdministrador()

        this.setState({
            Administrador: Administrador,
        })
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

    handleSucursal = (SucursalId)=>{
        this.setState({
            SucursalId: SucursalId,
            ventasCategorias:[],
            totalVenta:0.00,
        })

    }
    handleFechaInicial = (FechaInicial)=>{
        this.setState({
            FechaInicial: FechaInicial,
            ventasCategorias:[],
            totalVenta:0.00,
        })

    }
    handleFechaFinal = (FechaFinal) =>{
        this.setState({
            FechaFinal: FechaFinal,
            ventasCategorias:[],
            totalVenta:0.00,
        })
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    handleConsultar = async() =>{
        const SucursalId = this.state.SucursalId 
        const FechaInicial = this.state.FechaInicial 
        const FechaFinal = this.state.FechaFinal 
        const url = this.props.url + `/api/consultaventascategorias/${SucursalId}/${FechaInicial}/${FechaFinal}`

        try{
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if (data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            let vtotalVenta=0
            data.forEach(element =>{
                vtotalVenta += parseFloat(element.ExtVenta)
            })
            this.setState({
                ventasCategorias: data,
                totalVenta: vtotalVenta,
            })

        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }

    }

    handleCancelar = () =>{
        this.setState({
            ventasCategorias:[],
            totalVenta:0.00,
        })
    }

    handleRender = () =>{
        return(
                <div className="row">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <span className="badge badge-success">Consulta Ventas por Categoría</span>
                                <br />
                                <label htmlFor="" >Sucursal</label>
                                <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={this.state.SucursalId} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador} />
                                <br />
                                <label htmlFor="">Fecha Inicial</label>
                                <InputFecha onhandleFecha={this.handleFechaInicial} />
                                <label htmlFor="">Fecha Final</label>
                                <InputFecha onhandleFecha={this.handleFechaFinal} />
                            </div>
                            <div className="card-body">
                                <button className="btn btn-success btn-block" onClick={this.handleConsultar}>Consultar</button>
                                <button className="btn btn-danger btn-block" onClick={this.handleCancelar}>Cancelar</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <table>
                            <thead>
                                <tr>
                                    <th>Categoria</th>
                                    <th>Ext Venta</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.state.ventasCategorias.map((element,i) =>(
                                        <tr key={i}>
                                            <td>{element.Categoria}</td>
                                            <td style={{textAlign: "right"}}>{this.numberWithCommas(element.ExtVenta)}</td>
                                        </tr>
                                    )
                                    )}
                            </tbody>
                        </table>
                        <hr />
                        <div className="cvcfooter">
                            <label htmlFor="">Total Venta</label>
                            <input id="totalVenta" name="totalVenta" value={"$ "+this.numberWithCommas(this.state.totalVenta.toFixed(2))} readOnly />
                        </div>
                    </div>
                </div>
                )
        
    }
    
    render(){
        return(
                <div className="container">
                    {this.state.Administrador !== '' ? <this.handleRender /> : <h3>Loading . . .</h3>} 
                </div>
        )
    }

}
export default VentasConsultaCategorias