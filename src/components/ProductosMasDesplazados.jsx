import React from 'react';
import "./ProductosMasDesplazados.css"
import InputFecha from './cmpnt/InputFecha'
import SelectSucursales from './cmpnt/SelectSucursales'
import {NumberWithCommas} from './cmpnt/FuncionesGlobales'

class ProductosMasDesplazados extends React.Component{
    constructor(props){
        super(props)

        this.state={
            arreglo: [],
            SucursalId: 0,
            FechaInicial: "",
            FechaFinal:"",
            extunidadesvendidas:0,
            extventacimp:0,
        }
    }

    handleSucursal = (SucursalId) =>{
      this.setState({
          SucursalId: SucursalId,
          arreglo:[],
          extunidadesvendidas:0,
          extventacimp:0,
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

     handleConsultar = async() =>{
        const FechaInicial = this.state.FechaInicial
        const FechaFinal = this.state.FechaFinal
        const SucursalId = this.state.SucursalId 

        const url = this.props.url +`/api/productosmasdesplazadosmargen/${FechaInicial}/${FechaFinal}/${SucursalId}`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`
                },
            });
            const data = await response.json()
            if (data.error){
                alert(data.error)
                return
            }
            let extunidadesvendidas = 0
            let extventacimp = 0
            data.forEach((element)=>{
              extunidadesvendidas+= parseInt(element.UnidadesVendidas)
              extventacimp+=parseFloat(element.ExtVtaCImp)
            })
            this.setState({
                arreglo: data,
                extunidadesvendidas: extunidadesvendidas,
                extventacimp: extventacimp,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
     }

    handleRender=()=>{
        return (
          <div className="mainpage">
            <h4>Productos Más Desplazados (Margen)</h4>

            <div className="toparea">

              <div className="area1">
                <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} Administrador={this.props.Administrador} clase={'todasyfisicas'}/>
              </div>

              <div className="area1">
                <div className="grupofechas">
                  <div className="fechas">
                    <span>Fecha Inicial</span>
                    <InputFecha onhandleFecha={this.handleFechaInicial} />
                  </div>
                  <div className="fechas">
                    <span>Fecha Final</span>
                    <InputFecha onhandleFecha={this.handleFechaFinal} />
                  </div>
                  <button className="classbutton" onClick={this.handleConsultar}>Consultar</button>
                </div>
              </div>

            </div>

            <div className="tscroll">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Descripcion</th>
                    <th>Unidades Vendidas</th>
                    <th>ExtVtaCImp</th>
                    <th>PrecioVtaCImp</th>
                    <th>MargenActual</th>
                    <th>MargenMinAño</th>
                    <th>MargenMaxAño</th>
                    <th>MargenAño</th>
                    <th>MargenAñoAnterior</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.arreglo.map((element, i) => (
                    <tr key={i}>
                      <td>{element.CodigoId}</td>
                      <td style={{textAlign:"left"}}>{element.Descripcion}</td>
                      <td>{NumberWithCommas(element.UnidadesVendidas)}</td>
                      <td>{NumberWithCommas(parseInt(element.ExtVtaCImp))}</td>
                      <td>{element.PrecioVentaConImpuesto}</td>
                      <td style={{backgroundColor:"lightblue"}}><b>{element.MargenActual}</b></td>
                      <td>{element.MargenMinAño}</td>
                      <td>{element.MargenMaxAño}</td>
                      <td>{element.MargenAño}</td>
                      <td>{element.MargenAñoAnterior}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <br />
            <span style={{margin:"20px"}}>Ext Unidades Vendidas</span>
            <span style={{margin:"20px"}}>Ext Venta C/Imp</span>
            <br />
            <input type="text" style={{margin:"0 20px", textAlign:"right"}} value={NumberWithCommas(this.state.extunidadesvendidas)} />
            <input type="text" style={{textAlign:"right"}} value={NumberWithCommas(this.state.extventacimp)}/>
          </div>
        );
    }

    render(){
        return(
            <this.handleRender />
        )
    }
}

export default ProductosMasDesplazados