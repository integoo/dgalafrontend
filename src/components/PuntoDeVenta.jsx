import React from "react";
import "./PuntoDeVenta.css"

class PuntoDeVenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
        sucursales: [],
        SucursalId: "",
        detalles: [],
        CodigoBarras:"",
        totalTicket:0.00,
        VentanaDescripcion:"",
        VentanaDescripcionDetalles:[],
    };
    this.CodigoBarrasInput = React.createRef();
    this.ventanadescripcionInput = React.createRef();
  }

  async componentDidMount() {
    const arregloSucursales = await this.getSucursales();
    if (arregloSucursales.error) {
      alert(arregloSucursales.error);
      return;
    }

    this.setState({
      sucursales: arregloSucursales,
      SucursalId: arregloSucursales[0].SucursalId
    });
    this.CodigoBarrasInput.current.focus();
    document.querySelector(".ventanaproductos").style.display="none";
    
  }

   addRowHandlers = ()=> {
       const table = document.getElementById("table1");
       const rows = table.getElementsByTagName("tr");
       for (let i = 0; i < rows.length; i++) {
        let currentRow = table.rows[i];
        let createClickHandler =  (row) =>{
            return () => {
                let cell = row.getElementsByTagName("td")[1];
                let vcodigobarras = cell.innerHTML;
                this.setState({
                    CodigoBarras: vcodigobarras,
                    VentanaDescripcion: "",
                    VentanaDescripcionDetalles: []
                })
                document.querySelector(".ventanaproductos").style.display = "none"
                this.CodigoBarrasInput.current.focus()
            };
        };
        currentRow.onclick = createClickHandler(currentRow);
    }
}

  async getSucursales() {
    const url = this.props.url + `/api/catalogos/10`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = response.json();
      if (data.lenght === 0) {
        data = { error: "Error en Sucursales" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

onGrabarVentas = async () =>{
    if(this.state.detalles.length === 0){
        alert("No hay productos")
        return
    }

    const detalles = this.state.detalles 

    
    let arreglo=[]
    detalles.map((element,i) =>{
        let jsonDetalles={
            SerialId: i+1,
            CodigoId: element.CodigoId,
            CodigoBarras: element.CodigoBarras,
            Descripcion: element.Descripcion,
            UnidadesVendidas: 1,
            PrecioVentaConImpuesto : element.PrecioVentaConImpuesto
        }
        arreglo.push(jsonDetalles)
    })


    const json = {
        SucursalId: this.state.SucursalId,
        CajeroId: sessionStorage.getItem("ColaboradorId"),
        VendedorId: sessionStorage.getItem("ColaboradorId"),
        Usuario: sessionStorage.getItem("user"),
        // detalles: this.state.detalles, 
        detalles: arreglo,
    }

    try{
            //if (window.config('Desea Cerrar la Venta')){
                const url = this.props.url + `/api/grabaventas`;
                const response = await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(json),
                    headers:{
                        Authorization: `Bear ${this.props.accessToken}`,
                        "Content-Type": "application/json"
                    },
                });
                const data = await response.json()
                alert("FOLIO VENTA: "+data.Success)
                this.setState({
                    CodigoBarras: "",
                    detalles:[],
                    totalTicket: 0.00,
                })
                this.CodigoBarrasInput.current.focus();
            //}
            }catch(error){
                console.log(error.message)
                alert(error.message)
            }

}

  handleSucursales = (e) =>{
    const SucursalId = e.target.value
    this.setState({
        SucursalId: SucursalId
    })
    this.CodigoBarrasInput.current.focus();
  }
  
  handleCodigoBarras = (e) =>{
    const CodigoBarras = e.target.value.toUpperCase()
    this.setState({
        CodigoBarras: CodigoBarras
    })
  }



  async getProducto(id){
      const SucursalId = this.state.SucursalId
      const url = this.props.url + `/api/productosventa/${SucursalId}/${id}`;
      const response = await fetch(url, {
          headers: {
              Authorization: `Bearer ${this.props.accessToken}`
          },
      });
      let data = await response.json();
      if (data.length === 0){
          data = {error: "Producto No Existe"}
      }
      return data;
  }

  async getProductosDescripcion(desc){
      const url = this.props.url + `/api/productosdescripcion/${desc}`;
      const response = await fetch(url, {
          headers: {
              Authorization: `Bearer ${this.props.accessToken}`
          },
      });
      let data = await response.json();
      return data;
  }

  handleBuscar = async (e) =>{
      e.preventDefault();
      const CodigoBarras = this.state.CodigoBarras
      let arreglo = []
      if(CodigoBarras !== ""){
        arreglo = await this.getProducto(CodigoBarras)
        if(arreglo.error){
            alert(arreglo.error)
            this.setState({
                CodigoBarras: ""
            })
            this.CodigoBarrasInput.current.focus()
            return
        }
        if (arreglo[0].PrecioVentaConImpuesto <= 0){
            alert("Este producto No tiene Precio de Venta")
            this.setState({
                CodigoBarras: ""
            })
            this.CodigoBarrasInput.current.focus()
            return
        }
      } else{
          //alert("Código de Barras Invalido")
          
          if (document.querySelector(".ventanaproductos").style.display==="none"){
              document.querySelector(".ventanaproductos").style.display="block";
              this.ventanadescripcionInput.current.focus();
            }else{
                this.setState({
                    VentanaDescripcion:"",
                    VentanaDescripcionDetalles:[],
                })
                document.querySelector(".ventanaproductos").style.display="none";
                this.CodigoBarrasInput.current.focus();
          }
          return;
      }
      if(arreglo.error){
          alert(arreglo.error)
          this.CodigoBarrasInput.current.focus();
          return;
      }
      let totalTicket = parseFloat(this.state.totalTicket) + parseFloat(arreglo[0].PrecioVentaConImpuesto)
      let arregloDetalles = this.state.detalles 
      let json={
          CodigoId: arreglo[0].CodigoId,
          CodigoBarras: this.state.CodigoBarras,
          Descripcion: arreglo[0].Descripcion,
          PrecioVentaConImpuesto : arreglo[0].PrecioVentaConImpuesto
      }
      arregloDetalles.push(json)
      this.setState({
          detalles: arregloDetalles,
          totalTicket: totalTicket,
          CodigoBarras:"",
      })
      this.CodigoBarrasInput.current.focus();
  }

  handleBuscarEnter =(e)=>{
      if(e.key === "Enter"){
        this.handleBuscar(e);
      }
  }

  handleVentanaDescripcion = async(e)=>{
      const VentanaDescripcion = e.target.value.toUpperCase()
      this.setState({
          VentanaDescripcion: VentanaDescripcion
        })
        let arreglo = []
            if(VentanaDescripcion.length >= 3){
                arreglo = await this.getProductosDescripcion(VentanaDescripcion)
            }
    if (arreglo.error){
        alert(arreglo.error)
        return
    }
    this.setState({
        VentanaDescripcionDetalles: arreglo,
    })
    this.addRowHandlers()
  }

  handleEliminar = (e)=>{
    e.preventDefault()
    let id = e.target.id
    let arregloDetalles = this.state.detalles 
    //arregloDetalles = arregloDetalles.filter(element => (element.Id !== parseInt(id)))
    arregloDetalles = arregloDetalles.filter((element,i) => (i !== parseInt(id)))
    
        // const reducer = (accumulator , currentValue) => accumulator + currentValue;
        let vtotalTicket=0
        for (let i =0; i < arregloDetalles.length; i++){
            vtotalTicket+= parseFloat(arregloDetalles[i].PrecioVentaConImpuesto)
        }

    this.setState({
        detalles: arregloDetalles,
        totalTicket: vtotalTicket,
    })
  }


  handleRender = () => {
    return (
      <React.Fragment>
          {/* <div className="container"> */}
          {/* <div className="row"> */}
            <div className="col-md-5 header">
                <select onChange={this.handleSucursales} id="sucursales" name="sucursales" value={this.state.SucursalId}>
                {this.state.sucursales.map((element, i) => (
                    <option key={i} value={element.SucursalId}>
                    {element.Sucursal}
                    </option>
                ))}
                </select>
                <br />
                <label htmlFor="codigobarras">Código Barras</label>
                <input onChange={this.handleCodigoBarras} onKeyPress={this.handleBuscarEnter} id="codigobarras" name="codigobarras" size="15" maxLength="13" value={this.state.CodigoBarras} ref={this.CodigoBarrasInput} />
                <button onClick={this.handleBuscar} className="btn btn-primary btn-sm ml-3">Buscar</button>
                <br />




                <div className="ventanaproductos">
                    <label htmlFor="ventanadescripcion">Descripcion</label>
                    <input onChange={this.handleVentanaDescripcion} id="ventanadescripcion" name="ventanadescripcion" value={this.state.VentanaDescripcion} ref={this.ventanadescripcionInput} autoComplete="off" />
                    <table id="table1" onClick={this.handlerRowClicked}>
                        <thead>
                            <tr>
                                <th>Codigo</th>
                                <th>Codigo Barras</th>
                                <th>Descripcion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.VentanaDescripcionDetalles.map((element,i) => (
                                <tr key={i}>
                                    <td>{element.CodigoId}</td>
                                    <td>{element.CodigoBarras}</td>
                                    <td>{element.Descripcion}</td>
                                </tr>   
                            ))}
                        </tbody>
                    </table>
                </div>





                <label>Total Unidades</label>
                <input id="totalUnidades" name="totalUnidades" size="3" maxLength="3" type="text" value={this.state.detalles.length} style={{textAlign:"right"}} readOnly/>
                <button className="btn btn-danger btn-sm ml-5">CANCELAR TICKET</button>
                <br />
            </div>
            <div className="col-md-5 content">
                    <ul>
                        {/* {this.state.detalles.map((element,i) =>(<li key={i}>{element.CodigoBarras} <br /> {element.Descripcion} {element.PrecioVentaConImpuesto}<button onClick={this.handleEliminar} id={i} className="btn btn-danger btn-sm">Eliminar</button></li>))} */}
                        {this.state.detalles.map((element,i) =>(<li key={i}>{element.CodigoBarras} <br /> {element.Descripcion} {element.PrecioVentaConImpuesto}<button onClick={(e) => {if (window.confirm('Are you sure you wish to delete this item?')) this.handleEliminar(e) }} id={i} className="btn btn-danger btn-sm">Eliminar</button></li>))}
                    </ul>
            </div>
            <div className="col-md-5 footer">


            <label>Total Ticket</label>
                <input id="totalTicket" name="totalTicket" size="8" maxLength="8" type="text" value={"$"+this.state.totalTicket} style={{textAlign:"right"}} readOnly/>

                    <button onClick={this.onGrabarVentas} className="btn btn-success btn-sm" id="btn-registrarventa">REGISTRAR VENTA</button>
            </div>

          {/* </div> */}
          {/* </div> */}
      </React.Fragment>
    );
  };
  render() {
    return this.state.sucursales.length ? (
      <this.handleRender />
    ) : (
      <h3>Loading...</h3>
    );
  }
}

export default PuntoDeVenta;
