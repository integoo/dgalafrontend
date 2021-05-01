import React from "react";

import "./Productos.css"

class Productos extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            CodigoId:"",
            CodigoBarras:"",
            Descripcion: "",
            CategoriaId: 1,
            categorias:[],
            SubcategoriaId:1,
            subcategoriasCatalogo:[],
            subcategorias:[],
            MedidaCapacidadId:1,
            medidasCapacidad:[],
            UnidadesCapacidad:"",
            medidasVenta:[],
            MedidaVentaId:1,
            UnidadesVenta:"",
            marcas:[],
            MarcaId:1,
            colores:[],
            ColorId: 1,
            sabores: [],
            SaborId: 1,
            ivas:[],
            IVAId:1,
            IVA:0,
            IVACompra: "S",
            iepss:[],
            IEPSId:1,
            IEPS:0,
            productosRecientes:[],
            checked: false, //"checked" es para prender el checkbox
        }
        this.codigobarras = React.createRef();
        this.DescripcionInput = React.createRef();
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    async componentDidMount(){
        try{

            const categorias = await this.getCatalogos(1);
            if(categorias.error){
                alert(categorias.error)
                return;
            }
            const subcategorias = await this.getCatalogos(2)
            if (subcategorias.error){
                alert(subcategorias.error)
                return;
            }
            const medidasCapacidad = await this.getCatalogos(3)
            if(medidasCapacidad.error){
                alert(medidasCapacidad.error)
                return;
            }
            const medidasVenta = await this.getCatalogos(4)
            if(medidasVenta.error){
                alert(medidasVenta.error)
                return;
            }
            const marcas = await this.getCatalogos(5)
            if(marcas.error){
                alert(marcas.error)
                return;
            }
            const colores = await this.getCatalogos(6)
            if (colores.error){
                alert(colores.error)
                return;
            }
            const sabores = await this.getCatalogos(7)
            if (sabores.error){
                alert(sabores.error)
                return;
            }

            const iva = await this.getCatalogos(8)
            if (iva.error){
                alert(iva.error)
                return;
            }

            const ieps = await this.getCatalogos(9)
            if(ieps.error){
                alert(ieps.error)
                return;
            }

            const productosRecientes = await this.getProductosRecientes()
            if(productosRecientes.error){
                alert(productosRecientes.error)
                return;
            }

            this.setState({
                categorias:categorias,
                subcategoriasCatalogo: subcategorias,
                subcategorias: subcategorias.filter(element => element.CategoriaId === this.state.CategoriaId),
                medidasCapacidad: medidasCapacidad,
                medidasVenta: medidasVenta,
                marcas: marcas,
                colores: colores,
                sabores: sabores,
                ivas: iva,
                IVA: 0.00,
                iepss: ieps,
                IEPS: 0.00,
                productosRecientes: productosRecientes,

            })
            this.codigobarras.current.focus();
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    async getCatalogos(id){
        const url=this.props.url+`/api/catalogos/${id}`;
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            if(data.length === 0){
                data={"error": `No hay elementos en el Catálogo ${id}`}
            }
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    async getProductosRecientes(){
        const url=this.props.url+`/api/consultaProductosRecientes`;
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            let data = await response.json()
            // if(data.length === 0){
            //     data={"error": `No hay productos`}
            // }
            return data;
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }
    // handleCodigo = (e)=>{
    //     const vCodigoId= e.target.value 
    //     this.setState({
    //         CodigoId: vCodigoId
    //     })
    // }
    handleCodigoBarras = (e)=>{
        const vCodigoBarras = e.target.value
        this.setState({
            CodigoBarras: vCodigoBarras
        })
    }

    handleSinCodigoBarras =(e) =>{
        if(e.target.checked){
            document.querySelector('#codigobarras').disabled = true 
            this.setState({
                CodigoBarras:"I-CODE",
                checked:true,
            })
            //document.querySelector("#codigobarras").disabled = "true" 
            this.DescripcionInput.current.focus();
        }else{
            document.querySelector('#codigobarras').disabled = false
            this.setState({
                CodigoBarras:"",
                checked:false
            })
            this.codigobarras.current.focus()
        }
    }

    handleDescripcion = (e)=>{
        const vDescripcion = e.target.value
        this.setState({
            Descripcion: vDescripcion
        })
    }

    handleCategorias = (e)=>{
        const vCategoriaId = e.target.value
        const subcategorias = this.state.subcategoriasCatalogo.filter(element => element.CategoriaId === parseInt(vCategoriaId))
        this.setState({
            CategoriaId: vCategoriaId,
            subcategorias: subcategorias 
        })
    }

    handleSubcategorias = (e) =>{
        const vSubcategoriaId = e.target.value
        this.setState({
            SubcategoriaId: vSubcategoriaId
        })
    }

    handleUnidadesCapacidad = (e)=>{
        const vUnidadesCapacidad = e.target.value 
        this.setState({
            UnidadesCapacidad: vUnidadesCapacidad
        })
    }

    handleMedidaCapacidad = (e) =>{
        const vMedidaCapacidad = e.target.value 
        this.setState({
            MedidaCapacidadId: vMedidaCapacidad
        })
    }
    handleUnidadesVenta = (e) =>{
        const vUnidadesVenta = e.target.value
        this.setState({
            MedidaVentaId: vUnidadesVenta
        })
    }

    handleMedidaVenta = (e)=> {
        const vUnidadesVenta = e.target.value  
        this.setState({
            UnidadesVenta: vUnidadesVenta
        })
    }

    handleMarca = (e)=>{
        const vMarca = e.target.value
        this.setState({
            MarcaId: vMarca
        })
    }

    handleColor = (e)=>{
        const vColor = e.target.value
        this.setState({
            ColorId: vColor
        })
    }
    handleSabor = (e)=>{
        const vSabor = e.target.value  
        this.setState({
            SaborId: vSabor
        })
    }

    handleIVA = (e)=>{
        const vIVA = e.target.value 
        const arreglo = this.state.ivas.filter(element => element.IVAId === parseInt(vIVA))
        this.setState({
            IVAId: vIVA,
            IVA: arreglo[0].IVA
        })
    }

    handleIVACompra =(e) =>{
        const vIVACompra = e.target.value 
        this.setState({
            IVACompra: vIVACompra
        })
    }

    handleIEPS = (e)=>{
        const vIEPS = e.target.value 
        const arreglo = this.state.iepss.filter(element => element.IEPSId === parseInt(vIEPS))
        this.setState({
            IEPSId: vIEPS,
            IEPS: arreglo[0].IEPS
        })
    }

    async handleSubmit(event){
        event.preventDefault();
        const json={
            CodigoBarras: this.state.CodigoBarras.toUpperCase(),
            Descripcion: this.state.Descripcion.toUpperCase(),
            CategoriaId: this.state.CategoriaId,
            SubcategoriaId: this.state.SubcategoriaId,
            UnidadesCapacidad: this.state.UnidadesCapacidad,
            MedidaCapacidadId: this.state.MedidaCapacidadId,
            UnidadesVenta: this.state.UnidadesVenta,
            MedidaVentaId: this.state.MedidaVentaId,
            MarcaId: this.state.MarcaId,
            ColorId: this.state.ColorId,
            SaborId: this.state.SaborId,
            IVAId: this.state.IVAId,
            IVA: this.state.IVA,
            IVACompra: this.state.IVACompra,
            IEPSId: this.state.IEPSId,
            IEPS: this.state.IEPS,
            Usuario: sessionStorage.getItem("user")
        }

        try{
            
            const url = this.props.url+`/api/altaProductos`
            const response = await fetch(url,{
                method:"POST",
                body: JSON.stringify(json),
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()

            alert(JSON.stringify(data))

            if(data.error){
                alert ("Error antes de cargar productos")
                return
            }
                const productosRecientes = await this.getProductosRecientes()
                if(productosRecientes.error){
                    alert(productosRecientes.error)
                    return;
                }
                this.setState({
                    CodigoId:"",
                    CodigoBarras:"",
                    Descripcion:"",
                    CategoriaId: 1,
                    SubcategoriaId: 1,
                    UnidadesCapacidad: "",
                    MedidaCapacidadId:1,
                    UnidadesVenta: "",
                    MedidaVentaId: 1,
                    MarcaId: 1,
                    ColorId: 1,
                    SaborId: 1,
                    IVAId:1,
                    IEPSId: 1,
                    iva:1,
                    IVACompra:"S",
                    ieps:1,
                    productosRecientes: productosRecientes,
                    checked: true,
                })
            

            
            

            document.querySelector('#codigobarras').disabled = false
            //document.querySelector('.checkboxsincodigobarras').checked =""
            //document.querySelector('.checkboxsincodigobarras').defaultChecked = false
            
            this.codigobarras.current.focus();

        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    handleRender =()=>{
        return(
            <div className="row">
                        <div className="col-md-6 main-productos">
                            <form onSubmit={this.handleSubmit}>
                                <span className="badge badge-success "><h3>Productos</h3></span>
                                <br />
                                <label htmlFor="codigo">Código</label>
                                {/* <input onChange={this.handleCodigo} value={this.state.CodigoId} id="codigo" name="codigo" size="6" style={{backgroundColor:"lightgray"}} autoComplete="off" readOnly/> */}
                                <input value={this.state.CodigoId} id="codigo" name="codigo" size="6" style={{backgroundColor:"lightgray"}} autoComplete="off" readOnly/>
                                <br />
                                <label htmlFor="codigobarras">Código Barras</label>
                                <input onChange={this.handleCodigoBarras} value={this.state.CodigoBarras} id="codigobarras" name="codigobarras" size="15" maxLength="13" autoComplete="off" ref={this.codigobarras} required style={{"textTransform":"uppercase"}}/>
                                {/* <input onChange={this.handleSinCodigoBarras} id="checked" name="checked" type="checkbox" className="ml-2" defaultChecked={this.state.checked} /> */}
                                <input onChange={this.handleSinCodigoBarras} id="checked" name="checked" type="checkbox" className="ml-2" checked={this.state.checked} />
                                <label htmlFor="" className="ml-1" style={{fontSize:".8rem"}}>Sin Código de Barras</label>
                                <br/>
                                <label htmlFor="descripcion">Descripcion</label>
                                <input onChange={this.handleDescripcion} value={this.state.Descripcion} id="descripcion" name="descripcion" size="40" autoComplete="off" style={{textTransform:"uppercase"}} ref={this.DescripcionInput} required />
                                <br/>
                                <label htmlFor="categorias">Categorías</label>
                                <select onChange={this.handleCategorias} id="categorias" name="categorias" value={this.state.CategoriaId}>
                                    {this.state.categorias.map((element,i) => (<option key={i} value={element.CategoriaId}>{element.Categoria}</option>) )}
                                </select>
                                <br/>
                                <label htmlFor="subcategorias">Subcategorías</label>
                                <select onChange={this.handleSubcategorias} id="subcategorias" name="subcategorias" value={this.state.SubcategoriaId}>
                                    {this.state.subcategorias.map((element,i) => (<option key={i} value={element.SubcategoriaId}>{element.Subcategoria}</option>))}
                                </select>
                                <br />
                                
                                <label htmlFor="unidadesCapacidad">Unidades Capacidad</label>
                                <input  onChange={this.handleUnidadesCapacidad} value={this.state.UnidadesCapacidad} id="unidadesCapacidad" name="unidadesCapacidad" size="6" autoComplete="off" required />
                                <select onChange={this.handleMedidaCapacidad} id="MedidaCapacidad" name="MedidaCapacidad" value={this.state.MedidaCapacidadId}>
                                    {this.state.medidasCapacidad.map((element,i) => (<option key={i} value={element.MedidaCapacidadId}>{element.MedidaCapacidad}</option>))}
                                </select>
                                <br />
                                <label htmlFor="unidadesVenta">Unidades Venta</label>
                                <input onChange={this.handleMedidaVenta}  value={this.state.UnidadesVenta} id="unidadesVenta" name="unidadesVenta" size="6" autoComplete="off" required/>
                                <select onChange={this.handleUnidadesVenta} id="unidadesVenta" name="unidadesVenta" value={this.state.MedidaVentaId}>
                                    {this.state.medidasVenta.map((element,i) =>(<option key={i} value={element.MedidaVentaId}>{element.MedidaVenta}</option>))}
                                </select>
                                <br />
                                <label htmlFor="marca">Marca</label>
                                <select onChange={this.handleMarca} id="marca" name="marca" value={this.state.MarcaId}>
                                    {this.state.marcas.map((element,i)=>(<option key={i} value={element.MarcaId}>{element.Marca}</option>))}
                                </select>
                                <br />
                                <label htmlFor="color">Color</label>
                                <select onChange={this.handleColor} id="color" name="color" value={this.state.ColorId}>
                                    {this.state.colores.map((element,i) => (<option key={i} value={element.ColorId}>{element.Color}</option>))}
                                </select>
                                <br />
                                <label htmlFor="sabor">Sabor</label>
                                <select onChange={this.handleSabor} id="sabor" name="sabor" value={this.state.SaborId}>
                                    {this.state.sabores.map((element,i) => (<option key={i} value={element.SaborId}>{element.Sabor}</option>))}
                                </select>
                                <br />
                                <label htmlFor="iva">IVA</label>
                                <select onChange={this.handleIVA} id="iva" name="iva"  value={this.state.IVAId}>
                                    {this.state.ivas.map((element,i) =>(<option key={i} value={element.IVAId}>{element.Descripcion}</option>))}
                                </select>
                                <label htmlFor="ivacompra">IVA Compra</label>
                                <select onChange={this.handleIVACompra} id="ivacompra" name="ivacompra" value={this.state.IVACompra}>
                                    <option key={1} value="S">S</option>
                                    <option key={2} value="N">N</option>
                                </select>
                                <br />
                                <label htmlFor="ieps">IEPS</label>
                                <select onChange={this.handleIEPS} id="ieps" name="ieps" value={this.state.IEPSId}> 
                                    {this.state.iepss.map((element,i) =>(<option key={i} value={element.IEPSId}>{element.Descripcion}</option>))}
                                </select>
                                <br />
                                <button type="submit" className="btn btn-primary btn-block">GRABAR</button>
                            </form>
                        </div>
                        <div className="col-md-5 consulta-productos">
                            <span className="badge badge-success"><h4>Catálogo Productos</h4></span>
                            <table>
                                <thead>
                                    <tr>
                                        <th>CodigoId</th>
                                        <th>CodigoBarras</th>
                                        <th>Descripcion</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.productosRecientes.map((element,i) => (
                                    <tr key={i}>
                                        <td>{element.CodigoId}</td>
                                        <td>{element.CodigoBarras}</td>
                                        <td>{element.Descripcion}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div> 
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    {this.state.iepss.length > 0 ? <this.handleRender /> : <h1>Loading....</h1>}
                </div>
            </React.Fragment>
        )
    }
}

export default Productos;