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
            Administrador: this.props.Administrador,
            SoloInventariable: 'S',
            defaultChecked: true,
            radiovalue: "porcodigo",
        }
        this.CodigoBarrasInput = React.createRef();
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
        this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
    }

    onhandleSoloConExistencia = (e) =>{
        const soloConExistencia = !this.state.defaultChecked
        this.setState({
            defaultChecked: soloConExistencia
        })
    }

    onhandleConsulta = (CodigoBarras,Descripcion,UnidadesInventario) =>{
        this.setState({
            Descripcion: Descripcion,
            UnidadesInventario: UnidadesInventario,
        })
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

      handleradiovalue = (e) =>{
        this.setState({
            radiovalue: e.target.id
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
        const SoloConExistencia = this.state.defaultChecked
        const radiovalue = this.state.radiovalue

        if(!CodigoBarras || CodigoBarras === " "){
            CodigoBarras = 'novalor'
        }
        const url = this.props.url + `/api/inventarioperpetuo/${SucursalId}/${CodigoBarras}/${SoloConExistencia}/${radiovalue}`
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

        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    handleRender = () =>{
        return(
            <div className="contenidoInventarioPerpetuo">
                        <span className="badge badge-success">Inventario Perpetuo</span>
                        <form>
                            <label htmlFor="">Sucursales</label>
                            <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador} />
                            <br />
                            <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp = {this.onhandleCodigoBarras} handleConsultaProp={this.onhandleConsulta} SoloInventariable={this.state.SoloInventariable} ref={this.CodigoBarrasInput}/>

                            {/* RadioButton Group para Ordenamiento de Inventario */}
                            <div className="radioborder">
                                <input type="radio" onChange={this.handleradiovalue} id="porcodigo" name="ordenamiento" value={this.state.radiovalue} defaultChecked/>
                                <label htmlFor="" style={{fontSize:".7rem"}}>Por Código</label>
                                <input type="radio" onChange={this.handleradiovalue} id="porunidadesinventario" name="ordenamiento" value={this.state.radiovalue} />
                                <label htmlFor="" style={{fontSize:".7rem"}}>Por Unidades Inventario</label>
                                <input type="radio" onChange={this.handleradiovalue} id="porcategoriaunidadesinventario" name="ordenamiento" value={this.state.radiovalue} />
                                <label htmlFor="" style={{fontSize:".7rem"}}>Por Categoria / Unidades Inventario</label>

                            </div>

                            <input type="checkbox" onChange={this.onhandleSoloConExistencia} defaultChecked={this.state.defaultChecked}/>
                            <label style={{width:"10rem",marginLeft:"5px"}}>Solo Con Existencia</label>
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
                                        <th>CategoriaId</th>
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
                                                                                <td>{element.CategoriaId}</td>
                                                                                <td>{element.UnidadesInventario}</td>
                                                                                <td>{element.CostoPromedio}</td>
                                                                                <td>{element.ExtCostoPromedio}</td>
                                                                                </tr>))}
                                </tbody>
                            </table>
                        </div>
                        <div className="foot">
                            <label htmlFor="totalextcostopromedio">Total Ext Costo Promedio</label>
                            <input id="totalextcostopromedio" name="totalextcostopromedio" value={"$ "+this.numberWithCommas(this.state.totalextcostopromedio.toFixed(2))} style={{textAlign:"right"}} readOnly />
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