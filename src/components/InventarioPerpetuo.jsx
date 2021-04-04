import React from 'react';

import './InventarioPerpetuo.css'
import SelectSucursales from './cmpnt/SelectSucursales'
import InputCodigoBarras from './cmpnt/InputCodigoBarras'

class InventarioPerpetuo extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles:[],
            SucursalId: "",
            CodigoBarras: "",
            totalextcostopromedio: 0.0,
            totalunidadesinventario:0,
        }
    }

    componentDidMout(){
    }

    onhandleCodigoBarras =(CodigoBarras, Descripcion) =>{
        this.setState({
            CodigoBarras: CodigoBarras
        })

    }

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId,
            detalles:[],
            totalextcostopromedio:0,
            totalunidadesinventario:0
        })
    }

    onhandleSubmit = async (e) =>{
        e.preventDefault()
        // if(document.querySelector("#radiosucursal").checked === false){
            //     document.querySelector("#tableInputCodigoBarras").style.display = "block";
            // }
        if(document.querySelector("#tableInputCodigoBarras").style.display === true){
            return;
        }
        const SucursalId = this.state.SucursalId 
        let CodigoBarras = this.state.CodigoBarras 
        if(!CodigoBarras || CodigoBarras === " "){
            CodigoBarras = 'novalor'
        }
        const url = this.props.url + `/api/inventarioperpetuo/${SucursalId}/${CodigoBarras}`
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                //alert("Producto No Existe")
                this.setState({
                    CodigoBarras:"",
                    detalles: []
                })
                //this.refCodigoBarras.current.focus()
                return
            }
            let vcosto=0
            let vunidades=0
            for(let i=0; i<data.length; i++){
                vcosto+=parseInt(data[i].UnidadesInventario) * parseFloat(data[i].CostoPromedio)
                vunidades+= parseInt(data[i].UnidadesInventario)
            }
            this.setState({
                detalles: data,
                totalextcostopromedio: vcosto,
                totalunidadesinventario: vunidades,
            })
            //this.refCodigoBarras.current.focus()
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }
    onhandleCancel =(e) =>{
        e.preventDefault()
        this.setState({
            CodigoBarras: "",
            detalles: [],
            totalextcostopromedio:0,
            totalunidadesinventario:0,
        })
    }

    handleRender = () =>{
        return(
            <div className="contenidoInventarioPerpetuo">
                        <span className="badge badge-success">Inventario Perpetuo</span>
                        <form>
                            <label htmlFor="">Sucursales</label>
                            <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
                            <br />
                            <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp = {this.onhandleCodigoBarras}/>
                            <br />
                            <button onClick={this.onhandleSubmit}className="btn btn-primary btn-sm" type="submit">Consultar</button>
                            <button onClick={this.onhandleCancel} className="btn btn-danger btn-sm ml-2">Cancelar</button>
                        </form>
                        <br />
                        <div className="contentInventarioPerpetuoDetalles">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Codigo Barras</th>
                                        <th>Codigo</th>
                                        <th>Descripcion</th>
                                        <th>Unidades Inventario</th>
                                        <th>Costo Promedio</th>
                                        <th>Ext Costo Promedio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.detalles.map((element,i) =>(<tr key={i}>
                                                                                <td>{element.CodigoBarras}</td>
                                                                                <td>{element.CodigoId}</td>
                                                                                <td>{element.Descripcion}</td>
                                                                                <td>{element.UnidadesInventario}</td>
                                                                                <td>{element.CostoPromedio}</td>
                                                                                <td>{element.ExtCostoPromedio}</td>
                                                                                </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div className="foot">
                            <label htmlFor="totalextcostopromedio">Total Ext Costo Promedio</label>
                            <input id="totalextcostopromedio" name="totalextcostopromedio" value={this.state.totalextcostopromedio} style={{textAlign:"right"}} readOnly />
                            <label htmlFor="totalunidadesinventario">Total Unidades Inventario</label>
                            <input id="totalunidadesinventario" name="totalunidadesinventario" value={this.state.totalunidadesinventario} style={{textAlign: "right"}} readOnly />
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
export default InventarioPerpetuo