import React from 'react';

import SelectSucursales from './cmpnt/SelectSucursales';
import InputCodigoBarras from './cmpnt/InputCodigoBarras';

import './AjustesInventario.css'

class AjustesInventario extends React.Component{
    constructor(props){
        super(props)

        this.state={
            SucursalId: sessionStorage.getItem("SucursalId"),
            detalles:[],
            CodigoBarras: "",
            Descripcion: "",
            TipoAjusteId: "",
            UnidadesInventario:0,
            UnidadesAjustadas: "",
            AfectaCosto: "",
            Movimiento: "",
            Administrador: this.props.Administrador,
            detallesTipoAjustes: [],
            detallesAjustesRecientes: [],
            ColaboradorId: parseInt(sessionStorage.getItem("ColaboradorId")),
            Usuario: sessionStorage.getItem("user"),
            SoloInventariable: 'S',
        }
        this.UnidadesAjustadasInput = React.createRef()
        this.CodigoBarrasInput = React.createRef()
    }
    async componentDidMount(){
        const arregloTipoAjustes = await this.handleCargaTipoAjustes()
        const TipoAjusteId = parseInt(arregloTipoAjustes[0].TipoAjusteId)
        const AfectaCosto = arregloTipoAjustes[0].AfectaCosto
        const Movimiento = arregloTipoAjustes[0].Movimiento
        const arregloAjustesRecientes = await this.handleCargaAjustes()

        this.setState({
            detallesTipoAjustes: arregloTipoAjustes,
            detallesAjustesRecientes: arregloAjustesRecientes,
            TipoAjusteId: TipoAjusteId,
            AfectaCosto:AfectaCosto,
            Movimiento: Movimiento,
        })
    }

    handleCargaTipoAjustes = async() =>{
        try{
            const url = this.props.url+`/api/consultatipoajustes`
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            return data             
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleCargaAjustes = async() =>{
        const SucursalId = this.state.SucursalId
        try{
            const url = this.props.url + `/api/consultaajustesinventariorecientes/${SucursalId}`
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            return data
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId,
        })
        this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
    }

    onhandleCodigoBarras = (CodigoBarras) =>{
        this.setState({
            CodigoBarras: CodigoBarras,
            Descripcion: "",
            UnidadesInventario:0,
            UnidadesAjustadas:"",
        })
    }

    onhandleConsulta = (CodigoBarras,Descripcion,UnidadesInventario) =>{
        this.setState({
            Descripcion: Descripcion,
            UnidadesInventario: UnidadesInventario,
        })
        this.UnidadesAjustadasInput.current.focus()
    }

    handleTipoAjuste = (e) =>{
        const TipoAjusteId = parseInt(e.target.value)
        const arregloTipoAjustes = this.state.detallesTipoAjustes.filter(element => parseInt(element.TipoAjusteId) === TipoAjusteId)
        const AfectaCosto = arregloTipoAjustes[0].AfectaCosto
        const Movimiento = arregloTipoAjustes[0].Movimiento
        this.setState({
            TipoAjusteId: TipoAjusteId,
            AfectaCosto: AfectaCosto,
            Movimiento: Movimiento,

        })
        this.UnidadesAjustadasInput.current.focus()
    }

    onChange =(e) =>{
        const UnidadesAjustadas = e.target.value
        const Movimiento = this.state.Movimiento
        
        if(UnidadesAjustadas > 10 || UnidadesAjustadas < -10){
            if(!window.confirm("El Ajuste es por más de 10 piezas. ¿Desea Continuar?")){
                return
            }
        }


        let re = /^[-0-9\b]+$/; //Permite números ENTEROS POSITIVOS Y NEGATIVOS

        if(Movimiento === "+-"){
            re = /^[-0-9\b]+$/; //Permite números ENTEROS POSITIVOS Y NEGATIVOS
        }
        if(Movimiento === "+"){
            re = /^[0-9\b]+$/; //Permite número ENTEROS sólo POSITIVOS
        }
        if(Movimiento === "-" && UnidadesAjustadas > 0){
            alert("El Tipo de Ajuste sólo permite Ajuste de Unidades Negativo")
            return;
        }
        if (UnidadesAjustadas === '' || re.test(UnidadesAjustadas)) {
           this.setState({
               UnidadesAjustadas: e.target.value,
            })
        }
     }

     onhandleSubmit = async(e) => {
        e.preventDefault()
        const UnidadesAjustadas = this.state.UnidadesAjustadas
        const UnidadesInventario = this.state.UnidadesInventario


        if(UnidadesInventario < 0){
            if(UnidadesAjustadas < 0){
                this.setState({
                    UnidadesAjustadas: "",
                })
                alert("No se permite un Ajuste Negativo porque el Inventario es Negativo")
                return
            }
        }
        if((parseInt(UnidadesInventario) + parseInt(UnidadesAjustadas)) < 0 ){
            alert("Error....El Ajuste da Inventario Negativo")
            this.setState({
                UnidadesAjustadas: "",
            })
            return
        }


        const json={
            SucursalId: this.state.SucursalId,
            CodigoBarras: this.state.CodigoBarras,
            TipoAjusteId: this.state.TipoAjusteId,
            AfectaCosto: this.state.AfectaCosto,
            UnidadesAjustadas: this.state.UnidadesAjustadas,
            ColaboradorId: this.state.ColaboradorId,
            Usuario: this.state.Usuario,
        }
        try{
            const url = this.props.url+ `/api/grabaajustesinventario`
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json()
            if(data.error){
                alert(data.error)
                return
            }

            const arregloAjustesRecientes = await this.handleCargaAjustes()
            this.setState({
                detallesAjustesRecientes: arregloAjustesRecientes,
                Descripcion: "",
                UnidadesInventario:0,
                UnidadesAjustadas:"",
            })
            this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            alert(JSON.stringify(data))

        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    onhandleCancelar = () =>{
        this.setState({
            Descripcion: "",
            UnidadesInventario: 0,
            UnidadesAjustadas: "",
        })
        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    onhandleRender = () =>{
        return(
            <div className="main">
                <div className="col-md-6 xheader">
                    <form onSubmit={this.onhandleSubmit}>
                        <h4>Ajustes Inventario</h4>
                        <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={this.state.SucursalId} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador} />
                        <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp = {this.onhandleCodigoBarras} handleConsultaProp = {this.onhandleConsulta} CodigoBarrasProp = {this.state.CodigoBarras} SoloInventariable={this.state.SoloInventariable} ref={this.CodigoBarrasInput}/>               
                        <label htmlFor="">Descripcion</label>
                        <input id="descripcion" name="descripcion" size="40" maxLength="38" value={this.state.Descripcion} readOnly/>
                        <br />
                        <label htmlFor="">Unidades Inventario</label>
                        <input id="unidadesinventario" name="unidadesinventario" size="6" value={this.state.UnidadesInventario} readOnly/>
                        <br />
                        <label htmlFor="">Tipo Ajuste</label>
                        <select value={this.state.TipoAjusteId} onChange={this.handleTipoAjuste}>
                            {this.state.detallesTipoAjustes.map((element,i) => 
                            <option key={i} value={element.TipoAjusteId}>{element.Ajuste}</option>)}
                        </select>
                        <span className="badge badge-secondary ml-2">{this.state.Movimiento}</span>
                        <br />
                        <label>Unidades Ajustadas</label>
                        <input onChange={this.onChange} id="unidadesajustadas" name="unidadesajustadas" value={this.state.UnidadesAjustadas}ref={this.UnidadesAjustadasInput} autoComplete="off" required/>
                        <br />
                        <br />
                        <div className="displaybuttons">
                            <button type="submit" id="buttonSubmit" className="btn btn-primary btn-block mr-1">GRABAR</button>
                            <br />
                            <button type="reset" id="reset" className="btn btn-danger btn-block ml-1" onClick={this.onhandleCancelar}>CANCELAR</button>
                        </div>
                    </form>
                </div>
                <div className="col-md-6 xfooter">
                    {this.state.detallesAjustesRecientes ?
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Folio</th>
                                            <th>Tipo Ajuste</th>
                                            <th>Descripcion</th>
                                            <th>Unidades Ajustadas</th>
                                            <th>FechaHora</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                            {this.state.detallesAjustesRecientes.map((element,i) => (
                                        <tr key={i}>
                                                <td>{element.FolioId}</td>
                                                <td>{element.TipoAjuste}</td>
                                                <td>{element.Descripcion}</td>
                                                <td>{element.UnidadesAjustadas}</td>
                                                <td>{element.FechaHora}</td>
                                        </tr>
                                            ))}

                                    </tbody>
                                </table>
                                : null} 
                </div>

            </div>
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    {this.state.detallesTipoAjustes.length > 0 ? <this.onhandleRender /> : <h3>"Loading..."</h3>  }
                </div>
            </React.Fragment>
        )
    }
}
export default AjustesInventario;