import React from 'react';
import "./ComprasConsulta.css";
import SelectSucursales from './cmpnt/SelectSucursales'

class ComprasConsulta extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SucursalId: "",
            detalles:[],
            FechaInicial:this.fechaActual(),
            FechaFinal:this.fechaActual(),
            ExtCostoCompra: 0,
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

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId
        })
    }

    handleFechaIni = (e) =>{
        const fecha=e.target.value
        this.setState({
            FechaInicial: fecha
        })
    }
    handleFechaFin = (e) =>{
        const fecha=e.target.value
        this.setState({
            FechaFinal: fecha
        })
    }

     onhandleSubmit = async(e) =>{
         e.preventDefault()
        const SucursalId = this.state.SucursalId
        const FechaIni = this.state.FechaInicial 
        const FechaFin = this.state.FechaFinal
        try{
            const url = this.props.url + `/api/comprasconsulta/${SucursalId}/${FechaIni}/${FechaFin}`
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            let extcostocompra=0;
            for (let i=0; i<data.length; i++){
                extcostocompra = extcostocompra + parseFloat(data[i].ExtCostoCompra)
            }
            this.setState({
                detalles: data,
                ExtCostoCompra: extcostocompra,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }

    }

    handleRender=()=>{
        return(
            <div className="row">
                <div className="col-md-5 main-compras-consulta">
                    <form>
                        <label>Sucursal</label>
                        <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
                        <br />
                        <label>Fecha Inicial</label>
                        <input onChange={this.handleFechaIni} type="date" id="fechaini" name="fechaini" value={this.state.FechaInicial} />
                        <br />
                        <label>Fecha Final</label>
                        <input onChange={this.handleFechaFin} type="date" id="fechafin" name="fechafin" value={this.state.FechaFinal} />
                        <br />
                        <button onClick={this.onhandleSubmit} type="submit" className="btn btn-primary btn-block">Consultar</button>
                    </form>
                    <br />
                    <table>
                        <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Fecha Recepcion</th>
                                {/* <th>ProveedorId</th> */}
                                <th>Proveedor</th>
                                {/* <th>Numero Factura</th> */}
                                {/* <th>Total Factura</th> */}
                                {/* <th>SocioId</th> */}
                                {/* <th>Socio</th> */}
                                <th>Ext Unidades Recibidas</th>
                                {/* <th>ExtCostoCompraSinImpu</th> */}
                                {/* <th>ExtIVACostoCompra</th> */}
                                {/* <th>ExtIEPSCostoCompra</th> */}
                                <th>Ext Costo Compra</th>
                                <th>Detalles</th>
                            </tr>
                        </thead>
                        <tbody>
                                {this.state.detalles.map((element,i) => (<tr key={i}>
                                    <td>{element.FolioId}</td>
                                    <td>{element.FechaRecepcion.substr(0,10)}</td>
                                    {/* <td>{element.ProveedorId}</td> */}
                                    <td>{element.Proveedor}</td>
                                    {/* <td>{element.NumeroFactura}</td> */}
                                    {/* <td>{element.TotalFactura}</td> */}
                                    {/* <td>{element.SocioId}</td> */}
                                    {/* <td>{element.Socio}</td> */}
                                    <td>{element.ExtUnidadesRecibidas}</td>
                                    {/* <td>{element.ExtCostoCompraSinImp}</td> */}
                                    {/* <td>{element.ExtIVACostoCompra}</td> */}
                                    {/* <td>{element.ExtIEPSCostoCompra}</td> */}
                                    <td>{element.ExtCostoCompra}</td>
                                    <td><button className="btn btn-warning btn-sm">Productos</button></td>
                                    </tr>
                                    ))}
                        </tbody>
                    </table>
                    <br />
                    <label>Total Ext Costo Compra</label>
                    <input id="extcostocompra" name="extcostocompra" readOnly value={this.state.ExtCostoCompra} />
                </div>
            </div>
        )

        }
render(){
    return(
        <React.Fragment>
            <div className="container">
                {this.handleRender()}
                {/* {this.state.SucursalId === "" ? <this.handleRender /> : <h3>Loading . . .</h3> } */}
            </div>
        </React.Fragment>
        )
    }

}


export default ComprasConsulta;