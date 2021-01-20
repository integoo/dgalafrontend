import React from "react";
import "./ComprasRecepcion.css"

class ComprasRecepcion extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles:[],
            sucursales:[],
            SucursalId: 1,
            proveedores:[],
            ProveedorId: 1,
            NumeroFactura:"",
            TotalFactura:"",
            CodigoId:0,
            IVAId:0,
            IVA:0,
            IVAMonto:0.0,
            extIVAMonto:0.0,
            IEPSId:0,
            IEPS:0,
            IEPSMonto:0.0,
            extIEPSMonto:0.0,
            CodigoBarras:"",
            Descripcion:"",
            Unidades:"",
            CostoCompraSinIva:"",
            extCostoCompraSinImpuestos:0.0,
            extCostoCompraConImpuestos:0.0
        }
        this.unidadesInput = React.createRef();
        this.costoCompraInput = React.createRef();
        this.codigoBarrasInput = React.createRef();
        this.facturaInput = React.createRef();
    }

    async componentDidMount(){
        const arregloSucursales = await this.getSucursales()
        if(arregloSucursales.error){
            alert(arregloSucursales.error)
            return;
        }

        const arregloProveedores = await this.getProveedores()
        if(arregloProveedores.error){
            alert(arregloProveedores.error)
            return;
        }

        this.setState({
            sucursales: arregloSucursales,
            proveedores: arregloProveedores,
        })
    }

    async getSucursales(){
        const url = this.props.url+`/api/catalogos/10`
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            if(data.length === 0){
                data={"error": "Error en Sucursales"}
            }
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    async getProveedores(){
        const url=this.props.url+`/api/catalogos/11`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            if(data.length===0){
                data={"error": "Error en Proveedores"}
            }
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    async getProducto(id){
        const url = this.props.url+`/api/productodescripcion/${id}`
        const response = await fetch(url,{
            headers:{
                Authorization: `Bearer ${this.props.accessToken}`,
            },
        });
        let data = await response.json()
        if(data.length===0){
            data={"error": "Producto No Existe"}
        }
        return data
    }

    handleSucursales = (e)=>{
        const SucursalId = e.target.value
        this.setState({
            SucursalId: SucursalId
        })
    }

    handleProveedores = (e) =>{
        const ProveedorId = e.target.value 
        this.setState({
            ProveedorId: ProveedorId
        })
        this.facturaInput.current.focus()
    }

    handleFactura = (e) =>{
        const NumeroFactura = e.target.value
        this.setState({
            NumeroFactura: NumeroFactura
        })
    }

    handleTotalFactura = (e) => {
        const TotalFactura = e.target.value
        this.setState({
            TotalFactura: TotalFactura
        })
    }

    handleCodigoBarras = (e) =>{
        const vCodigoBarras = e.target.value
        this.setState({
            CodigoBarras: vCodigoBarras
        })
    }
    
    handleCodigoBarrasEnter = (e) =>{
        if(e.key ==='Enter'){
            if(this.state.CodigoBarras != ""){
                this.handleConsultar(e)
            }else{
                alert("Código de Barras Inválido")
                return
            }
        }
    }

     handleConsultar = async (e) =>{
        e.preventDefault();
        let arreglo=[]
        if(this.state.CodigoBarras != ""){
            arreglo = await this.getProducto(this.state.CodigoBarras)
        }else{
            alert("Código de Barras Inválido")
            return
        }
        if(arreglo.error){
            alert(arreglo.error)
            return
        }
        this.setState({
            CodigoId: arreglo[0].CodigoId,
            Descripcion:arreglo[0].Descripcion,
            IVAId: arreglo[0].IVAId,
            IVA: arreglo[0].IVA,
            IEPSId: arreglo[0].IEPSId,
            IEPS: arreglo[0].IEPS
        })
        document.querySelector("#codigobarras").disabled=true
        this.unidadesInput.current.focus();
    }

    handleAgregarCancelar = (e) =>{
        e.preventDefault()
        this.setState({
            CodigoId:0,
            CodigoBarras:"",
            Descripcion:"",
            Unidades:"",
            CostoCompraSinIva:""
        })

        this.codigoBarrasInput.current.focus()
    }

    handleUnidades = (e) =>{
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            const Unidades = e.target.value
            if(Unidades < 0){
                alert("No se permite recibir Unidades NEGATIVAS")
                return
            }
            this.setState({
                Unidades: Unidades
            })
        }
    }
    
    handleUnidadesEnter = (e) =>{
        if (e.key === 'Enter'){
            this.costoCompraInput.current.focus()
        }
    }

    handleCostoCompra = (e) =>{
        const CostoCompraSinIva = e.target.value 
        if(CostoCompraSinIva < 0){
            alert("No se permite registrar Costo Compra Unitario S/IVA NEGATIVO")
            return
        }
        this.setState({
            CostoCompraSinIva: CostoCompraSinIva
        })
    }

    handleAgregar = (e) =>{
        if (this.state.CodigoBarras === "" || this.state.Descripcion === "" || this.state.Unidades === "" || this.state.CostoCompraSinIva ==="") {
            alert("Error en Dato. Revise los campos de la Forma")
            return;
        }
        let detallesAux = this.state.detalles



        //Valida si ya existe el producto en el proceso de recepción
        // for(let i=0; i < detallesAux.length; i++){
        //     if(detallesAux[i].CodigoBarras === this.state.CodigoBarras){
        //         alert("El Producto ya existe en el Proceso de Recepción")
        //         return;
        //     }
        // }

        
        

        const json = {
            CodigoId: this.state.CodigoId,
            CodigoBarras: this.state.CodigoBarras,
            Descripcion: this.state.Descripcion,
            UnidadesRecibidas: this.state.Unidades,
            CostoCompraSinIva: this.state.CostoCompraSinIva,
            IVAId: this.state.IVAId,
            IVA: this.state.IVA,
            IVAMonto: parseFloat(this.state.CostoCompraSinIva) * parseFloat(this.state.Unidades) * parseFloat(this.state.IVA)/100,
            IEPSId: this.state.IEPSId,
            IEPS: this.state.IEPS,
            IEPSMonto: parseFloat(this.state.CostoCompraSinIva) * parseFloat(this.state.Unidades) * parseFloat(this.stateIEPS)/100 ,
        }

        detallesAux.push(json)
        alert(JSON.stringify(detallesAux))

        this.setState({
            detalles: detallesAux
        })
        let extCostoCompraSinImpuestos = 0
        let extIVAMonto = 0
        let extIEPSMonto = 0
        let extCostoCompraConImpuestos = 0
        detallesAux.map((element,i) =>{
            extCostoCompraSinImpuestos += parseInt(element.UnidadesRecibidas) * parseFloat(element.CostoCompraSinIva)
            extIVAMonto += parseInt(element.UnidadesRecibidas) * parseFloat(element.CostoCompraSinIva) * (parseFloat(element.IVA)/100)
            extIEPSMonto += parseInt(element.UnidadesRecibidas) * parseFloat(element.CostoCompraSinIva) * (parseFloat(element.IEPS)/100)
        })

        document.querySelector("#sucursales").disabled= true;
        document.querySelector("#proveedores").disabled= true;
        document.querySelector("#factura").disabled= true;
        document.querySelector("#totalfactura").disabled= true;
        this.setState({
            CodigoId: 0,
            CodigoBarras:"",
            Descripcion:"",
            Unidades:"",
            CostoCompraSinIva:"",
            extCostoCompraSinImpuestos: extCostoCompraSinImpuestos,
            extIVAMonto: extIVAMonto,
            extIEPSMonto: extIEPSMonto,
            extCostoCompraConImpuestos: extCostoCompraSinImpuestos + extIVAMonto + extIEPSMonto,
        })

        document.querySelector("#codigobarras").disabled = false;

        this.codigoBarrasInput.current.focus()
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleSubmit = (e) =>{
        e.preventDefault();
    }

    handleRender=()=>{
        return(
            <React.Fragment>
                <div className="container">
                    <form onSubmit={this.handleSubmit}>
                        <span className="badge badge-success"><h3>Compras Recepcion</h3></span>
                        <br />
                        <label htmlFor="sucursales">Sucursales</label>
                        <select onChange={this.handleSucursales} id="sucursales" name="sucursales" value={this.state.SucursalId}>
                            {this.state.sucursales.map((element,i) =>(<option key={i} value={element.SucursalId}>{element.Sucursal}</option>))}
                        </select>
                        <br />
                        <label htmlFor="proveedores">Proveedores</label>
                        <select onChange={this.handleProveedores} id="proveedores" name="proveedores" value={this.state.ProveedorId}>
                            {this.state.proveedores.map((element,i) => (<option key={i} value={element.ProveedorId}>{element.Proveedor}</option>))}
                        </select>
                        <br />
                        <label htmlFor="factura">Factura</label>
                        <input onChange={this.handleFactura} id="factura" name="factura" autoComplete="off" style={{textTransform:"uppercase"}} value={this.state.NumeroFactura} ref={this.facturaInput} />
                        <br />
                        <label htmlFor="totalfactura">Total Factura</label>
                        <input onChange={this.handleTotalFactura} id="totalfactura" name="totalfactura" type="number" step="0.01" value={this.state.TotalFactura} />
                        <br />
                        <label htmlFor="codigoBarras">Código Barras</label>
                        <br />
                        <input onChange={this.handleCodigoBarras} onKeyDown={this.handleCodigoBarrasEnter} id="codigobarras" name="codigobarras" size="15" maxLength="13" value={this.state.CodigoBarras} ref={this.codigoBarrasInput} autoComplete="off" />
                        <button type="button" onClick={this.handleConsultar} id="btn-consultar" className="btn btn-primary btn-sm ml-1">Consultar</button>
                        <br />
                        <label htmlFor="descripcion">Descripción</label>
                        <br />
                        <input id="descripcion" name="descripcion" size="65" value={this.state.Descripcion} readOnly/>
                        <br />
                        <label htmlFor="unidades">Unidades</label>
                        <label htmlFor="costocompra">Costo Compra Unitario S/IVA</label>
                        <br />
                        <input onChange={this.handleUnidades} onKeyDown={this.handleUnidadesEnter} type="number" id="unidades" name="unidades" size="15" autocomplete="off" value={this.state.Unidades} ref={this.unidadesInput} />
                        <input onChange={this.handleCostoCompra} type="number" step="0.01" id="costocompra" name="costocompra" size="15" autocomplete="off" value={this.state.CostoCompraSinIva} ref={this.costoCompraInput} />
                        <button type="button" onClick={this.handleAgregar} className="btn btn-success btn-sm ml-1">Agregar</button>
                        <button type="button" onClick={this.handleAgregarCancelar} className="btn btn-danger btn-sm ml-1">Cancelar</button>
                        <br />
                        <br />
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Código Barras</th>
                                    <th>Descripcion</th>
                                    <th>Unidades Recibidas</th>
                                    <th>Costo Compra Sin Impuestos</th>
                                    <th>Ext Costo Compra Sin Impuestos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.detalles.map((element,i) =>(<tr>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.CodigoBarras}</td>
                                    <td>{element.Descripcion}</td>
                                    <td style={{textAlign:"right"}}>{element.UnidadesRecibidas}</td>
                                    <td style={{textAlign:"right"}}>$ {this.numberWithCommas(parseFloat(element.CostoCompraSinIva).toFixed(2))}</td>
                                    <td style={{textAlign:"right"}}>$ {this.numberWithCommas(parseFloat(element.CostoCompraSinIva * parseInt(element.UnidadesRecibidas)).toFixed(2))}</td>
                                </tr>))}
                            </tbody>
                        </table>
                        <label>Ext Costo Compra Sin Impuestos</label>
                        <label>Ext IVA</label>
                        <label>Ext IEPS</label>
                        <label>Ext Costo Compra Con Impuestos</label>
                        <br />
                        <input id="extCostoCompraSinImpuestos" name="extCostoCompraSinImpuestos" style={{textAlign:"right"}} value={"$ " +this.numberWithCommas(this.state.extCostoCompraSinImpuestos.toFixed(2))}/>
                        <input id="extIVAMonto" name="extIVAMonto" style={{textAlign:"right"}} value={"$ "+this.state.extIVAMonto.toFixed(2)} />
                        <input id="extIEPSMonto" name="extIEPSMonto" style={{textAlign:"right"}} value={"$ "+this.state.extIEPSMonto.toFixed(2)} />
                        <input id="extCostoCompraConImpuestos" name="extCostoCompraConImpuestos" style={{textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.extCostoCompraConImpuestos.toFixed(2))} />
                        <br />
                        <button type="submit" className="btn btn-success btn-lg m-2">Grabar</button>
                        <button className="btn btn-danger btn-lg">Cancelar</button>
                    </form>
                </div>
            </React.Fragment>
        )
    }
    render(){
        return(
                <this.handleRender />
        )
    }
}

export default ComprasRecepcion;