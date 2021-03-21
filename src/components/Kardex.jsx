import React from 'react';

import './Kardex.css'
import SelectSucursales from './cmpnt/SelectSucursales'

class Kardex extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles:[],
            SucursalId: "",
            CodigoBarras: "",
            CodigoId: "",
            Descripcion: "",
            FechaInicial: this.fechaActual(),
            FechaFinal: this.fechaActual(),
        }
        this.refCodigoBarras = React.createRef();
    }

    componentDidMount(){
        this.refCodigoBarras.current.focus()
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

    handleCodigoBarras = (e) =>{
        const CodigoBarras = e.target.value.toUpperCase() 
        this.setState({
            CodigoBarras: CodigoBarras
        })
    }

    handleFechaInicial = (e) =>{
        const FechaInicial = e.target.value 
        this.setState({
            FechaInicial: FechaInicial
        })
    }

    handleFechaFinal = (e) => {
        const FechaFinal = e.target.value 
        this.setState({
            FechaFinal: FechaFinal
        })
    }

    onhandleBuscar = async (e) => {
        e.preventDefault()
        const id = this.state.CodigoBarras
        if(!id){
            this.refCodigoBarras.current.focus()
            return
        }
        const url = this.props.url + `/api/productodescripcion/${id}`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                this.setState({
                    CodigoBarras: "",
                })
                return
            }
            this.setState({
                CodigoId: data[0].CodigoId,
                Descripcion: data[0].Descripcion,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    onhandCancel = (e) => {
        e.preventDefault()
        this.setState({
            CodigoBarras: "",
            Descripcion: "",
            detalles:[],
        })
    }

    onhandleSummit = async(e) =>{
        e.preventDefault()
        const SucursalId = this.state.SucursalId
        const CodigoBarras = this.state.CodigoBarras
        const FechaInicial = this.state.FechaInicial 
        const FechaFinal = this.state.FechaFinal 
        const url = this.props.url + `/api/kardex/${SucursalId}/${CodigoBarras}/${FechaInicial}/${FechaFinal}`
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            this.setState({
                detalles: data,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }    

    handlerRender = () =>{
        return(
            <div className="row">
                <div className="col-md-5 kardexmain">
                    <form>
                        <label htmlFor="">Sucursales</label>
                        <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
                        <br />
                        <label htmlFor="codigobarras">Código Barras</label>
                        <input onChange={this.handleCodigoBarras}id="codigobarras" name="codigobarras" size="15" maxLength="13" value={this.state.CodigoBarras} style={{textTransform:"capitalize"}} ref={this.refCodigoBarras} autoComplete="off" />
                        <button onClick={this.onhandleBuscar} className="btn btn-primary btn-sm ml-1">Buscar</button>
                        <br />
                        <label htmlFor="">Descripcion</label>
                        <input id="descripcion" name="descripcion" size="37" value={this.state.Descripcion} readOnly />
                        <br />
                        <label htmlFor="">Fecha Inicial</label>
                        <input onChange={this.handleFechaInicial} type="date" value={this.state.FechaInicial} />
                        <br />
                        <label htmlFor="">Fecha Final</label>
                        <input onChange={this.handleFechaFinal} type="date" value={this.state.FechaFinal} />
                        <br />
                        <br />
                        <button onClick={this.onhandleSummit} className="btn btn-primary">Consultar</button>
                        <button onClick={this.onhandCancel} className="btn btn-danger ml-3">Cancelar</button>
                    </form>
                    <div className="contenido">
                        <table>
                            <thead>
                                <tr>
                                    <th>Movimiento</th>
                                    <th>Folio</th>
                                    <th>Unidades</th>
                                    <th>Unidades Inventario Antes</th>
                                    <th>Unidades Inventario Despues</th>
                                    <th>Costo Compra</th>
                                    <th>Costo Promedio</th>
                                    <th>Precio Venta Sin Imp</th>
                                    <th>Precio Venta Con Imp</th>
                                    <th>Fecha Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                    {this.state.detalles.map((element,i) =>(<tr key={i}><td>{element.Movimiento}</td>
                                                                                <td>{element.FolioId}</td>
                                                                                <td>{element.Unidades}</td>
                                                                                <td>{element.UnidadesInventarioAntes}</td>
                                                                                <td>{element.UnidadesInventarioDespues}</td>
                                                                                <td>{element.CostoCompra}</td>
                                                                                <td>{element.CostoPromedio}</td>
                                                                                <td>{element.PrecioVentaSinImpuesto}</td>
                                                                                <td>{element.PrecioVentaConImpuesto}</td>
                                                                                <td>{element.FechaHora}</td>
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
                    <this.handlerRender />
                </div>
            </React.Fragment>
        )
    }
}
export default Kardex