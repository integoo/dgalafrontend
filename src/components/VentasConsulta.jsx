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
            totalVentaFecha:0,
            totalVentaFolio:0,
            totalVentaTicket:0,
            detallesFolios:[],
            detallesTicket:[],
        }
    }

    componentDidMount(){
        document.querySelector('#btnFolio').disabled = true
        document.querySelector('#btnTicket').disabled = true
        document.querySelector('#table2').style.display = "none"
        document.querySelector('#table3').style.display = "none"
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

    handleTicket = async (FolioId) =>{
        const SucursalId = this.state.SucursalId
        const url = this.props.url+ `/api/ventasticket/${SucursalId}/${FolioId}`
        const response = await fetch(url,{
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
        let totalVentas = 0
        for (let i=0; i<data.length; i++){
            totalVentas+=parseFloat(data[i].Venta)
        }
        this.setState({
            detallesTicket: data,
            totalventa:totalVentas,
            totalVentaTicket: totalVentas,
        })
    }

    addRowHandlersFolios = ()=> {
        const table = document.getElementById("table2");
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
         let currentRow = table.rows[i];
         let createClickHandler =  (row) =>{
             return () => {
                 let cell = row.getElementsByTagName("td")[0];
                 let FolioId = cell.innerHTML;
                 this.handleTicket(FolioId)
                 document.querySelector('#table1').style.display = "none"
                 document.querySelector('#table2').style.display = "none"
                 document.querySelector('#table3').style.display = "block"
                 document.querySelector('#btnTicket').disabled = false;
             };
         };
         currentRow.onclick = createClickHandler(currentRow);
        }
    }

    handleFolios = async (Fecha) =>{
        const SucursalId = this.state.SucursalId
        const url = this.props.url+ `/api/ventasfolios/${SucursalId}/${Fecha}`
        const response = await fetch(url,{
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
        let totalVentas = 0
        for (let i=0; i<data.length; i++){
            totalVentas+=parseFloat(data[i].ExtVenta)
        }
        this.setState({
            detallesFolios: data,
            totalventa: totalVentas,
            totalVentaFolio: totalVentas,
        })
        this.addRowHandlersFolios()
    }

    addRowHandlers = ()=> {
        const table = document.getElementById("table1");
        const rows = table.getElementsByTagName("tr");
        for (let i = 0; i < rows.length; i++) {
         let currentRow = table.rows[i];
         let createClickHandler =  (row) =>{
             return () => {
                 let cell = row.getElementsByTagName("td")[0];
                 let Fecha = cell.innerHTML;
                 //alert(Fecha)
                 this.handleFolios(Fecha)
                 document.querySelector('#table1').style.display = "none"
                 document.querySelector('#table2').style.display = "block"
                 document.querySelector('#btnFolio').disabled = false;
             };
         };
         currentRow.onclick = createClickHandler(currentRow);
     }
    }

    handleBtnFecha =() =>{
        document.querySelector("#table1").style.display="block"
        document.querySelector("#table2").style.display = "none"
        document.querySelector("#table3").style.display = "none"
        this.setState({
            totalventa: this.state.totalVentaFecha,
        })
    }

    handleBtnFolio =()=>{
        document.querySelector("#table1").style.display="none"
        document.querySelector("#table2").style.display = "block"
        document.querySelector("#table3").style.display = "none"
        this.setState({
            totalventa: this.state.totalVentaFolio,
        })
    }
    handleBtnTicket =()=>{
        document.querySelector("#table1").style.display="none"
        document.querySelector("#table2").style.display = "none"
        document.querySelector("#table3").style.display = "block"
        this.setState({
            totalventa: this.state.totalVentaTicket,
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
                totalventa: totalventas,
                totalVentaFecha: totalventas,
            })
            this.addRowHandlers()
            document.querySelector("#btnFolio").disabled = true
            document.querySelector("#btnTicket").disabled = true

            document.querySelector("#table1").style.display="block"
            document.querySelector("#table2").style.display = "none"
            document.querySelector("#table3").style.display = "none"
        } catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleRender = () =>{
        return (
        <div className="row">
            <div className="col-md-5 ventasconsultasmain">
                <span className="badge badge-danger">Consulta Ventas(Fecha/Folio/Ticket)</span>
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
                <div className="detallesFechas">
                    <div className="tabs">
                        <ul>
                            <li><button onClick={this.handleBtnFecha} id="btnFecha" className="btn btn-warning btn-sm">Fecha</button></li>
                            <li><button onClick={this.handleBtnFolio} id="btnFolio" className="btn btn-warning btn-sm ml-1">Folio</button></li>
                            <li><button onClick={this.handleBtnTicket} id="btnTicket" className="btn btn-warning btn-sm ml-1">Ticket</button></li>
                        </ul>
                    </div>
                    <table id="table1">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Ext Venta Con Impuesto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.detalles.map((element,i) => (<tr key={i}>
                                <td>{element.Fecha.substr(0,10)}</td>
                                <td style={{textAlign:"right"}}>{element.ExtPrecioVentaConImpuesto}</td>
                                </tr>))}
                        </tbody>
                    </table>
                    <table id="table2">
                        <thead>
                            <tr>
                                <th>Folio</th>
                                <th>Productos</th>
                                <th>Unidades</th>
                                <th>ExtVenta</th>
                                <th>FechaHora</th>
                            </tr>
                        </thead>
                        <tbody>
                                {this.state.detallesFolios.map((element,i) => (
                                    <tr key={i}>
                                    <td>{element.FolioId}</td>
                                    <td style={{textAlign:"right"}}>{element.Productos}</td>
                                    <td style={{textAlign:"right"}}>{element.Unidades}</td>
                                    <td style={{textAlign:"right"}}>{element.ExtVenta}</td>
                                    <td style={{textAlign:"left"}}>{element.FechaHora.substr(0,10)} {element.FechaHora.substr(11,8)}</td>
                                </tr>))}
                        </tbody>
                    </table>
                    <table id="table3">
                        <thead>
                            <tr>
                                <th>CodigoId</th>
                                <th>Descripcion</th>
                                <th>Unidades</th>
                                <th>Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                                {this.state.detallesTicket.map((element,i) => (
                                    <tr key={i}>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.Descripcion}</td>
                                    <td style={{textAlign:"right"}}>{element.UnidadesVendidas}</td>
                                    <td style={{textAlign:"right"}}>{element.Venta}</td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
                <br />
                <label htmlFor="">Total Venta</label>
                <input id="totalventa" name="totalventa" style={{width:"5rem", textAlign:"right"}} value={"$ " +this.numberWithCommas(this.state.totalventa)} readOnly />
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