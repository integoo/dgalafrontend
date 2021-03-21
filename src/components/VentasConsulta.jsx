import React from 'react';

import SelectSucursales from './cmpnt/SelectSucursales'
import './VentasConsulta.css'

class VentasConsulta extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles: [],
            SucursalId:"",
            FechaInicial: this.fechaActual(),
            FechaFinal: this.fechaActual(),
            totalventa:0,
        }
    }

    fechaActual() {
        const d = new Date();
        let vfecha =
          d.getFullYear() +
          "-" +
          ("0" + (d.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + d.getDate()).slice(-2);
    
        return vfecha;
      }

      handleFechaInicial = (e) =>{
        const fecha = e.target.value
        this.setState({
            FechaInicial: fecha,
        })
      }

      handleFechaFinal =(e) => {
          const fecha = e.target.value
          this.setState({
              FechaFinal: fecha
          })
      }

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId
        })
    }

    onhandleSubmit = async (e)=>{
        e.preventDefault()
        const SucursalId = this.state.SucursalId
        const FechaIni = this.state.FechaInicial
        const FechaFin = this.state.FechaFinal 
        const url = this.props.url + `/api/ventasconsulta/${SucursalId}/${FechaIni}/${FechaFin}`
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if (data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            let totalventas=0
            for (let i =0; i< data.length; i++){
                totalventas += parseFloat(data[i].ExtPrecioVentaConImpuesto)
            }
            this.setState({
                detalles: data,
                totalventa: totalventas
            })
        } catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleRender = () =>{
        return (
        <div className="row">
            <div className="col-md-5 ventasconsultasmain">
                <form>
                    <label htmlFor="">Sucursales</label>
                    <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
                    <br />
                    <label htmlFor="">Fecha Inicial</label>
                    <input onChange={this.handleFechaInicial} type="date" id="fechaini" name="fechaini" value={this.state.FechaInicial} /> 
                    <br />
                    <label htmlFor="">Fecha Final</label>
                    <input onChange={this.handleFechaFinal} type="date" id="fechafin" name="fechafin" value={this.state.FechaFinal} />
                    <button onClick={this.onhandleSubmit} className="btn btn-primary btn-block" type="submit">Consultar</button>
                </form>
                <br />
                <div className="detalles">
                    <ul>
                        {this.state.detalles.map((element,i) => (<li key={i} value={element.Fecha}>{element.Fecha.substr(0,10)} {element.ExtPrecioVentaConImpuesto}</li>))}
                    </ul>
                </div>
                <br />
                <label htmlFor="">Total Venta</label>
                <input id="totalventa" name="totalventa" value={this.state.totalventa} readOnly />
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

export default VentasConsulta;