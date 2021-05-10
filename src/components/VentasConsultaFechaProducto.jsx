import React, {Component} from 'react';

import "./VentasConsultaFechaProducto.css";

import SelectSucursales from './cmpnt/SelectSucursales';
import InputFecha from './cmpnt/InputFecha';

class VentasConsultaFechaProducto extends Component{
    constructor(props){
        super(props)

        this.state={
            SucursalId:0,
            FechaIncial:"",
            FechaFinal: "",
            detalles:[],
        }
    }

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId,
        })
    }

    handleFechaInicial = (Fecha) =>{
       this.setState({
           FechaInicial: Fecha
       })
    }

    handleFechaFinal = (Fecha) =>{
        this.setState({
            FechaFinal: Fecha
        })
    }

    handleConsultar = async() => {
        const SucursalId = this.state.SucursalId 
        const FechaInicial = this.state.FechaInicial
        const FechaFinal = this.state.FechaFinal
        const url = this.props.url + `/api/ventasconsultafechaproducto/${SucursalId}/${FechaInicial}/${FechaFinal}`
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`
                },
            });
            const data = await response.json()
            if (data.error){
                alert(data.error)
                return
            }
            this.setState({
                detalles: data,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    handleRender = () =>{
        return(
            <div className="row">
                <div className="col-md-5 consultaventafechaproductomain">
                    <span className="badge badge-danger">Consulta Ventas(Fecha/Producto)</span>
                    <br />
                    <label htmlFor="">Sucursales</label>
                    <br />
                    <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} Administrador={this.props.Administrador} />
                    <br />
                    <label htmlFor="">Fecha Inicial</label>
                    <InputFecha onhandleFecha={this.handleFechaInicial}/>
                    <label htmlFor="">Fecha Final</label>
                    <InputFecha onhandleFecha={this.handleFechaFinal} />
                    <br />
                    <button onClick={this.handleConsultar} className="btn btn-success btn-block">Consultar</button>
                    <div className="detalles">
                        <table>
                            <thead>
                                <tr>
                                    <th>CodigoId</th>
                                    <th>CodigoBarras</th>
                                    <th>Descripcion</th>
                                    <th>ExtUnidadesVendidas</th>
                                    <th>ExtVenta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.detalles.map((element,i) => (<tr key={i}>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.CodigoBarras}</td>
                                    <td>{element.Descripcion}</td>
                                    <td>{element.ExtUnidadesVendidas}</td>
                                    <td>{element.ExtVenta}</td>
                                </tr>))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <this.handleRender />
                </div>
            </React.Fragment>
        )
    }
}
export default VentasConsultaFechaProducto;