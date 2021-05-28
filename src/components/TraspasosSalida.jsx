import React from 'react';

import SelectSucursales from "./cmpnt/SelectSucursales"
import InputCodigoBarras from "./cmpnt/InputCodigoBarras"

import './TraspasosSalida.css'

class TraspasosSalida extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SucursalId: sessionStorage.getItem("SucursalId"),
            SucursalIdDestino: "",
            Sucursales: [],
            CodigoBarras: "",
            CodigoId: "",
            Administrador:"",
            Descripcion: "",
            UnidadesExistencia: 0,
            UnidadesDisponibles: 0,
            UnidadesPedidas: "",
            detalles: [],
            SoloInventariable: 'S',
        }

        this.CodigoBarrasInput = React.createRef(); 
        this.UnidadesPedidasInput = React.createRef();
    }

    async componentDidMount(){
        const SucursalId = this.state.SucursalId
        const Administrador = await this.handleAdministrador()
        const Sucursales = await this.handleSucursales(SucursalId)
        this.setState({
            Administrador: Administrador,
            SucursalIdDestino: Sucursales[0].SucursalId,
            Sucursales: Sucursales,
        })
    }

    async getSucursales(){
        const url = this.props.url + `/api/catalogos/10`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleSucursales = async(SucursalId) =>{
        //onst SucursalId = this.state.SucursalId
        const arregloSucursales = await this.getSucursales()
        const Sucursales = arregloSucursales.filter(element => parseInt(element.SucursalId) !== parseInt(SucursalId))
        return Sucursales
    }

    handleAdministrador = async() =>{
        const ColaboradorId = sessionStorage.getItem("ColaboradorId")
        const url = this.props.url + `/api/colaboradoradministrador/${ColaboradorId}`
        let data;
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
            if (data.error){
                console.log(data.error)
                alert(data.error)
            }
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return data[0].Administrador
    }

    handleSucursal = async(SucursalId) =>{
        const Sucursales = await this.handleSucursales(SucursalId)
        this.setState({
            SucursalId: SucursalId,
            Sucursales: Sucursales,
        })
        this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
    }

    onhandleSucursalDestino = (e) =>{
        const SucursalIdDestino = parseInt(e.target.value)
        this.setState({
            SucursalIdDestino: SucursalIdDestino,
        })
    }

    onhandleCodigoBarras = (CodigoBarras) =>{
        this.setState({
            CodigoBarras: CodigoBarras,
            Descripcion: "",
        })
    }

    onhandleConsulta = (CodigoBarras,Descripcion,UnidadesExistencia,UnidadesDisponibles,CodigoId) => {
        this.setState({
            Descripcion: Descripcion,
            UnidadesExistencia: UnidadesExistencia,
            UnidadesDisponibles: UnidadesDisponibles,
            CodigoId: CodigoId,
        })
        this.UnidadesPedidasInput.current.focus()
    }

    onhandleUnidadesPedidas = (e) =>{
        e.preventDefault()
        let UnidadesPedidas = e.target.value
        if(UnidadesPedidas === null){
            return
        }
        const UnidadesDisponibles = parseInt(this.state.UnidadesDisponibles)
        if(parseInt(UnidadesPedidas) <=0 ){
            alert("Unidades Pedidas deben ser Mayor que CERO")
            UnidadesPedidas=""
        }
        if(parseInt(UnidadesPedidas) > UnidadesDisponibles){
            alert("Unidades Pedidas NO pueden ser Mayor a Unidades Disponibles")
            UnidadesPedidas=""
        }
        this.setState({
            UnidadesPedidas: UnidadesPedidas,
        })
    }

    onhandleUnidadesPedidasKeyDown = (e) =>{
        //e.preventDefault()
        if(e.key  ==="Enter"){
            this.onhandleAgregar(e)
        }
    }

    onhandleAgregar = (e) =>{
        e.preventDefault()
        const CodigoId = this.state.CodigoId
        const CodigoBarras = this.state.CodigoBarras
        if(CodigoBarras === ""){
            this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
        }
        if(this.state.UnidadesPedidas === ""){
            this.UnidadesPedidasInput.current.focus()
            return
        }
        let arreglo = this.state.detalles
        if(arreglo.find((element) => parseInt(element.CodigoId) === parseInt(CodigoId))){
            alert("El Producto ya Existe en esta Transaccion")
            this.setState({
                CodigoBarras: "",
                Descripcion: "",
                UnidadesExistencia:0,
                UnidadesDisponibles:0,
                UnidadesPedidas: "",
                CodigoId: "",
            })
            this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            return
        }

        const json={
            CodigoId: this.state.CodigoId,
            CodigoBarras: this.state.CodigoBarras,
            Descripcion: this.state.Descripcion,
            UnidadesPedidas: this.state.UnidadesPedidas,
        }
        arreglo.push(json)

        this.setState({
            Descripcion: "",
            UnidadesExistencia: 0,
            UnidadesDisponibles: 0,
            UnidadesPedidas: "",
            detalles: arreglo,
        })
        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    onhandleCancelar = (e) => {
        e.preventDefault()
        this.setState({
            CodigoBarras: "",
            Descripcion: "",
            UnidadesExistencia:0,
            UnidadesDisponibles:0,
            UnidadesPedidas: "",
            //detalles:[],
            CodigoId: "",
        })
        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }

    onhandleCerrarTraspaso = async() =>{
        let detallesPost=[];
        let jsonPost;
        let detalles = this.state.detalles
        const CodigoBarras = this.state.CodigoBarras

        if(detalles.length === 0){
            if(CodigoBarras === ""){
                this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
            }
            return
        }

        detalles.forEach((element) =>{
            jsonPost={
                CodigoId: parseInt(element.CodigoId),
                CodigoBarras: element.CodigoBarras,
                UnidadesPedidas: parseInt(element.UnidadesPedidas)
            }
            detallesPost.push(jsonPost)
        })

        const json = {
            SucursalIdOrigen: this.state.SucursalId,
            SucursalIdDestino: this.state.SucursalIdDestino,
            ColaboradorIdOrigen: parseInt(sessionStorage.getItem("ColaboradorId")),
            Usuario: sessionStorage.getItem("user"),
            detallesPost: this.state.detalles,
        }
        const url = this.props.url + `/api/grabatraspasosalida`
        try{
            const response = await fetch(url,{
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                    'Content-Type': 'application/json',

                }
            });

            const data = await response.json()

            alert(JSON.stringify(data))



            this.setState({
                CodigoBarras: "",
                Descripcion: "",
                UnidadesExistencia:0,
                UnidadesDisponibles:0,
                UnidadesPedidas: "",
                detalles:[],
                CodigoId: "",
            })
            this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()


        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    onhandleCancelarTraspaso = () =>{
        this.setState({
            CodigoBarras: "",
            Descripcion: "",
            UnidadesExistencia:0,
            UnidadesDisponibles:0,
            UnidadesPedidas: "",
            detalles:[],
            CodigoId: "",
        })
        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
    }


    handleRender = () => {
        return(
            <div className="row">
                <div className="col-md-6">
                    <form>
                        <div className="card">
                            <div className="card-body">
                                <div className="form-group">
                                    <label htmlFor="" style={{width:"8rem"}}>Sucursal Origen</label>
                                    <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={this.state.SucursalId} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador} />
                                    <br />
                                    <label htmlFor="" style={{width:"8rem"}}>Sucursal Destino</label>
                                    <select onChange={this.onhandleSucursalDestino} id="sucursaldestino" name="sucursaldestino" value={this.state.SucursalIdDestino}>
                                        {this.state.Sucursales.map((element,i) => (
                                            <option key={i} value={element.SucursalId}>{element.Sucursal}</option>
                                        ))}
                                    </select>
                                    <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp={this.onhandleCodigoBarras} handleConsultaProp={this.onhandleConsulta} CodigoBarrasProp={this.state.CodigoBarras} SoloInventariable={this.state.SoloInventariable} ref={this.CodigoBarrasInput} />
                                    <br />
                                    <label htmlFor="codigoId">Código</label>
                                    <input id="codigoId" name="codigoId" value={this.state.CodigoId} readOnly/>
                                    <br />
                                    <label htmlFor="">Descripcion</label>
                                    <br />
                                    <input id="descripcion" name="descripcion" value={this.state.Descripcion} readOnly />
                                    <br />
                                    <br />
                                    <label htmlFor="" style={{width:"10rem"}}>Unidades Disponibles</label>
                                    <input id="unidadesdisponibles" name="unidadesdisponibles" style={{width:"4rem",textAlign:"right"}}value={this.state.UnidadesDisponibles} readOnly />
                                    <br />
                                    <label htmlFor="unidadespedidias" style={{width:"10rem"}}>Unidades Pedidas</label>
                                    <input onChange={this.onhandleUnidadesPedidas} onKeyDown={this.onhandleUnidadesPedidasKeyDown} id="unidadespedidas" name="unidadespedidas" type="number" style={{width:"4rem",textAlign:"right"}}value={this.state.UnidadesPedidas} ref={this.UnidadesPedidasInput} autoComplete="off"/>
                                    <div className="botones">
                                        <button className="btn btn-success" onClick={this.onhandleAgregar}>AGREGAR</button>
                                        <button className="btn btn-danger" onClick={this.onhandleCancelar}>CANCELAR</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </form>
                    <hr />
                    <button onClick={this.onhandleCerrarTraspaso} className="btn btn-primary btn-block">CERRAR TRASPASO</button>
                    <button onClick={this.onhandleCancelarTraspaso} className="btn btn-danger btn-block">CANCELAR TRASPASO</button>
                </div>
                <div className="col-md-6">
                    {this.state.detalles.length > 0 
                    ?
                            <table>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Código Barras</th>
                                        <th>Descripcion</th>
                                        <th>Unidades Pedidas</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.detalles.map((element,i) =>(
                                    <tr key={i}>
                                            <td>{element.CodigoId}</td>
                                            <td>{element.CodigoBarras}</td>
                                            <td>{element.Descripcion}</td>
                                            <td>{element.UnidadesPedidas}</td>
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
                    {this.state.Administrador !== "" ? <this.handleRender /> : <h3>Loading . . .</h3>}
                </div>
            </React.Fragment>
        )
    }
}

export default TraspasosSalida;