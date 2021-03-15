import React from 'react';

import SelectSucursales from './cmpnt/SelectSucursales'

class VentasConsulta extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles: [],
            SucursalId:"",
            FechaInicial: this.fechaActual(),
            FechaFinal: this.fechaActual(),
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
            this.setState({
                detalles: data,
            })
        } catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleRender = () =>{
        return (
        <div className="row">
            <div className="col-md-5">
                <form>
                    <label htmlFor="">Sucursales</label>
                    <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
                    <label htmlFor="">Fecha Inicial</label>
                    <input onChange={this.handleFechaInicial} type="date" id="fechaini" name="fechaini" value={this.state.FechaInicial} /> 
                    <label htmlFor="">Fecha Final</label>
                    <input onChange={this.handleFechaFinal} type="date" id="fechafin" name="fechafin" value={this.state.FechaFinal} />
                    <button onClick={this.onhandleSubmit} className="btn btn-primary btn-block" type="submit">Consultar</button>
                </form>
                <ul>
                    {this.state.detalles.map((element,i) => (<li key={i} value={element.FolioId}>{element.FolioId} {element.ExtPrecioVentaSinImpuesto} {element.ExtIVAMonto} {element.ExtIEPSMonto} {element.ExtPrecioVentaConImpuesto}</li>))}
                </ul>
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