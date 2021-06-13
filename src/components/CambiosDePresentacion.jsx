import React from 'react';

import SelectSucursales from './cmpnt/SelectSucursales';

import './CambiosDePresentacion.css'
class CambiosDePresentacion extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            CodigoIdPadre:"",
            CodigoBarrasPadre:"",
            DescripcionPadre:"",
            UnidadesInventarioPadre: 0,
            CodigoIdHijo:"",
            CodigoBarrasHijo:"",
            DescripcionHijo:"",
            FactorConversion: "",
            UnidadesInventarioHijo: 0,
            UnidadesConvertir:"",
            detallesPadres:[],
            detallesHijos:[],
            disabledPadre: false,
            disabledPadreBuscar: false,
            disbledPadreDescripcion: false,
            disabledUnidadesConvertir: true,
            UnidadesHijoRecibe:0,
        }
    this.CodigoBarrasInput = React.createRef()
    this.DescripcionInput = React.createRef()
    this.UnidadesConvertirInput = React.createRef()

    }

    componentDidMount(){
        this.CodigoBarrasInput.current.focus()
    }

    //########
    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId,
        })
        this.CodigoBarrasInput.current.focus()
    }

    //#######

    onhandleCodigoBarrasPadre = (e) =>{
        const CodigoBarras = e.target.value.toUpperCase() 
        this.setState({
            CodigoBarrasPadre: CodigoBarras,
        })
    }

    onhandleCodigoBarraPadreKeyDown = (e) =>{
        if(e.key === 'Enter' && this.state.CodigoBarrasPadre === ""){
            this.handleBuscar()
        }
    }

    onhandleDescripcion = (e) =>{
        const Descripcion = e.target.value.toUpperCase();
        
        this.setState({
            DescripcionPadre: Descripcion,
        })
        this.handleconsultaPadres(Descripcion)
    }

    handleconsultaPadres = async(DescripcionPadre)=>{
        const SucursalId = parseInt(this.state.SucursalId)

        if (DescripcionPadre === ""){
            DescripcionPadre = null
        }

        const url = this.props.url+ `/api/consultaproductospadres/${SucursalId}/${DescripcionPadre}`
        try{
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
            this.setState({
                detallesPadres: data
            })
            this.addRowHandlers();


        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleBuscar = () =>{
        if (document.querySelector(".tablaBusquedaProductos").style.display === "none" || document.querySelector(".tablaBusquedaProductos").style.display === ""){
            document.querySelector(".tablaBusquedaProductos").style.display= "block"
            document.querySelector("#descripcion").disabled = false;
            this.DescripcionInput.current.focus()
            this.handleconsultaPadres(this.state.DescripcionPadre)
        }else{
            document.querySelector(".tablaBusquedaProductos").style.display= "none"
            document.querySelector("#descripcion").disabled = true;
            this.CodigoBarrasInput.current.focus()
        }
    }


    addRowHandlers = () => {
        const table = document.getElementById("table1");
        const rows = table.getElementsByTagName("tr");
        let detallesHijos=[]
        for (let i = 1; i < rows.length; i++) { //IMPORANTE: SE PONE DESDE 1 PORQUE EL 0 SON LOS ENCABEZADOS
          let currentRow = table.rows[i];
          let createClickHandler = (row) => {
            return () => {
              let cell = row.getElementsByTagName("td")[1];
              let vcodigobarras = cell.innerHTML;
              cell = row.getElementsByTagName("td")[2];
              let vdescripcion = cell.innerHTML;
              cell = row.getElementsByTagName("td")[3];
              let vUnidadesInventario = cell.innerHTML;
              cell = row.getElementsByTagName("td")[0];
              let vCodigoId = cell.innerHTML;
              if(vUnidadesInventario <=0){
                alert("El Producto Padre No tiene Existencia")
                document.querySelector(".tablaBusquedaProductos").style.display = "none";
                document.querySelector("#descripcion").disabled = true;
                this.CodigoBarrasInput.current.focus()
                return
              }
              detallesHijos = this.state.detallesPadres.find(element => parseInt(element.CodigoIdPadre) === parseInt(vCodigoId))
              this.setState({
                CodigoBarrasPadre: vcodigobarras,
                DescripcionPadre: vdescripcion,
                UnidadesInventarioPadre: vUnidadesInventario,
                CodigoIdPadre: vCodigoId,
                detallesPadres: [],
                detallesHijos: detallesHijos.detalles,
                disabledPadre: true,
                disabledPadreBuscar: true,
              });
              this.addRowHandlersHijos();

              if(detallesHijos.detalles.length === 1 ){
                this.setState({
                    CodigoIdHijo: detallesHijos.detalles[0].CodigoIdHijo,
                    CodigoBarrasHijo: detallesHijos.detalles[0].CodigoBarrasHijo,
                    DescripcionHijo: detallesHijos.detalles[0].DescripcionHijo,
                    FactorConversion: detallesHijos.detalles[0].FactorConversion,
                    UnidadesInventarioHijo: detallesHijos.detalles[0].UnidadesInventarioHijo,
                    disabledUnidadesConvertir: false,
                })
                this.UnidadesConvertirInput.current.focus()
              }else{
                document.querySelector(".tablaBusquedaHijos").style.display = "block";
              }
    
              document.querySelector(".tablaBusquedaProductos").style.display = "none";
              document.querySelector("#descripcion").disabled = true;
            };
          };
          currentRow.onclick = createClickHandler(currentRow);
        }
        
      };

      addRowHandlersHijos = () => {
        const table = document.getElementById("table2");
        const rows = table.getElementsByTagName("tr");
        //let detallesHijos=[]
        for (let i = 1; i < rows.length; i++) { //IMPORANTE: SE PONE DESDE 1 PORQUE EL 0 SON LOS ENCABEZADOS
          let currentRow = table.rows[i];
          let createClickHandler = (row) => {
            return () => {
              let cell = row.getElementsByTagName("td")[0];
              let vCodigoId = cell.innerHTML;
              cell = row.getElementsByTagName("td")[1];
              let vcodigobarras = cell.innerHTML;
              cell = row.getElementsByTagName("td")[2];
              let vdescripcion = cell.innerHTML;
              cell = row.getElementsByTagName("td")[3];
              let vUnidadesInventario = cell.innerHTML;
              cell = row.getElementsByTagName("td")[4];
              let vFactorConversion = cell.innerHTML;

              this.setState({
                CodigoBarrasHijo: vcodigobarras,
                DescripcionHijo: vdescripcion,
                UnidadesInventarioHijo: vUnidadesInventario,
                CodigoIdHijo: vCodigoId,
                FactorConversion: vFactorConversion,
                disabledUnidadesConvertir: false,
              });
              this.UnidadesConvertirInput.current.focus()

              document.querySelector(".tablaBusquedaHijos").style.display = "none";
            };
          };
          currentRow.onclick = createClickHandler(currentRow);
        }
      };

    
      onhandleUnidadesConvertir = (e) =>{
          const UnidadesConvertir = e.target.value
          const UnidadesInventarioPadre = this.state.UnidadesInventarioPadre
          if(parseInt(UnidadesConvertir) > parseInt(UnidadesInventarioPadre)){
              alert("Las Unidades Convertir No pueden Exceder su Inventario")
              return
          }
          let numbers = /^[0-9]+$/;
          if (UnidadesConvertir.match(numbers) || UnidadesConvertir === ""){
              this.setState({
                  UnidadesConvertir: UnidadesConvertir,
                  UnidadesHijoRecibe: UnidadesConvertir*parseFloat(this.state.FactorConversion)
                })
            }
      }

      onhandleGrabar = async()=>{
          const UnidadesConvertir = this.state.UnidadesConvertir
          const UnidadesInventarioPadre = this.state.UnidadesInventarioPadre
          if (UnidadesConvertir === "" || parseInt(UnidadesConvertir) <=0 || parseInt(UnidadesConvertir) > parseInt(UnidadesInventarioPadre)){
              alert("Hay datos requeridos faltantes o que no cumplen con lo requerido")
              this.UnidadesConvertirInput.current.focus()
              return
          }

          const json={
              SucursalId: this.state.SucursalId,
              CodigoIdPadre: this.state.CodigoIdPadre,
              CodigoBarrasPadre: this.state.CodigoBarrasPadre,
              UnidadesConvertir: this.state.UnidadesConvertir,
              FactorConversion: this.state.FactorConversion,
              CodigoIdHijo: this.state.CodigoIdHijo,
              CodigoBarrasHijo: this.state.CodigoBarrasHijo,
              UnidadesHijoRecibe: this.state.UnidadesHijoRecibe,
              ColaboradorId: sessionStorage.getItem('ColaboradorId'),
              Usuario: sessionStorage.getItem('user')
          }

          const url = this.props.url+`/api/cambiosdepresentacionajustes`
          try{
              const response = await fetch(url, {
                  method: "POST",
                  body: JSON.stringify(json),
                  headers: {
                      Authorization: `Bearer ${this.props.accessToken}`,
                      "Content-Type": "application/json"
                  },
              });
              const data = await response.json()

              if(data.error){
                  console.log(data.error)
                  alert(data.error)
                  return
              }
              this.onhandleCancelar()
              alert(JSON.stringify(data))
          }catch(error){
              console.log(error.message)
              alert(error.message)
          }
      }

      onhandleCancelar =()=>{
          this.setState({
              CodigoBarrasPadre: "",
              DescripcionPadre: "",
              UnidadesInventarioPadre: 0,
              CodigoBarrasHijo: "",
              DescripcionHijo: "",
              UnidadesInventarioHijo: 0,
              UnidadesConvertir: "",
              FactorConversion: "",
              UnidadesHijoRecibe:0,
              disabledPadre:false,
              disabledPadreBuscar: false,
              disabledUnidadesConvertir: true,
          },()=>this.CodigoBarrasInput.current.focus())
          
      }

    handleRender = () =>{
        return(
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <span className="badge badge-primary"><medium>Cambios de Presentación</medium></span>
                            <br />
                            <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={this.state.SucursalId} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador} />
                            <br />
                            <label htmlFor="codigobarraspadre" style={{width:"8rem"}}><small>Código Barras Padre</small></label>
                            <input onChange={this.onhandleCodigoBarrasPadre} onKeyDown={this.onhandleCodigoBarraPadreKeyDown} id="codigobarraspadre" name="codigobarraspadre" value={this.state.CodigoBarrasPadre} ref={this.CodigoBarrasInput} disabled={this.state.disabledPadre}/>
                            <button onClick={this.handleBuscar} className="btn btn-success btn-sm ml-2" disabled={this.state.disabledPadreBuscar}>Buscar</button>
                            <label htmlFor="descripcion">Descripción</label>
                            <input onChange={this.onhandleDescripcion} value={this.state.DescripcionPadre} id="descripcion" name="descripcion" style={{width:"100%"}} style={{textTransfor:"uppercase"}} ref={this.DescripcionInput} />
                            <div className="tablaBusquedaProductos mt-2">
                                <table id="table1">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Código Barras</th>
                                            <th>Descripcion</th>
                                            <th>Unidades Inventario</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.detallesPadres.map((element,i) =>(
                                            <tr key={i}>
                                                <td>{element.CodigoIdPadre}</td>
                                                <td>{element.CodigoBarrasPadre}</td>
                                                <td>{element.DescripcionPadre}</td>
                                                <td>{element.UnidadesInventarioPadre}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <label htmlFor="unidadesinventariopadre" style={{width: "12rem"}}>Unidades Inventario Padre</label>
                            <input id="unidadesinventariopadre" name="unidadesinventariopadre" style={{width:"4rem"}} value={this.state.UnidadesInventarioPadre} readOnly/>
                            <hr />
                            <div className="tablaBusquedaHijos">
                                <table id="table2">
                                            <thead>
                                                <tr>
                                                    <th>Código</th>
                                                    <th>Código Barras</th>
                                                    <th>Descripcion</th>
                                                    <th>Unidades Inventario</th>
                                                    <th>Factor Conversión</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.detallesHijos.map((element,i) =>(
                                                    <tr key={i}>
                                                        <td>{element.CodigoIdHijo}</td>
                                                        <td>{element.CodigoBarrasHijo}</td>
                                                        <td>{element.DescripcionHijo}</td>
                                                        <td>{element.UnidadesInventarioHijo}</td>
                                                        <td>{element.FactorConversion}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                </table>
                            </div>
                                <label htmlFor="codigobarrashijo" style={{width:"8rem"}}><small>Código Barras Hijo</small></label>
                                <input id="codigobarrashhijo" name="codigobarrashijo" value={this.state.CodigoBarrasHijo}  readOnly/>
                                <br />
                                <label htmlFor="descripcionhijo">Descripción</label>
                                <br />
                                <input value={this.state.DescripcionHijo} id="descripcionhijo" name="descripcionhijo" style={{width:"100%"}} readOnly/>
                                <br />
                                <label htmlFor="unidadesexistenciahijo" style={{width:"12rem"}}>Unidades Inventario Hijo</label>
                                <input id="unidadesexistenciahijo" name="unidadesexistenciahijo" value={this.state.UnidadesInventarioHijo} style={{width:"4rem"}} readOnly/>
                        </div>
                        <div className="card-footer">
                            <label htmlFor="" style={{width:"5rem"}}>Unidades Padre Convertir</label>
                            <input onChange={this.onhandleUnidadesConvertir} id="unidadesconvertir" name="unidadesconvertir" value={this.state.UnidadesConvertir} style={{width:"4rem", textAlign:"right"}} ref={this.UnidadesConvertirInput} disabled={this.state.disabledUnidadesConvertir}/>
                            <label htmlFor="factorconversion" style={{width:"5.5rem", marginLeft:"2rem"}}>Factor Conversión</label>
                            <input id="factorconversion" name="factorconversion" value={this.state.FactorConversion} style={{width:"4rem",fontSize:".7rem",textAlign:"right"}} readOnly/>
                            <label htmlFor="" style={{width:"4.5rem"}}>Unidades Hijo Recibe </label>
                            <input id="unidadeshijorecibe" name="unidadeshijorecibe" value={this.state.UnidadesHijoRecibe} style={{width:"4rem", textAlign:"right"}} readOnly/>
                            <button onClick={this.onhandleGrabar} className="btn btn-primary btn-block">Grabar</button>
                            <button onClick={this.onhandleCancelar}className="btn btn-danger btn-block">Cancelar</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    {<this.handleRender />}
                </div>
            </React.Fragment>
        )
    }

}

export default CambiosDePresentacion;