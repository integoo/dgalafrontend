import { get } from "jquery";
import React from "react";

class PuntoDeVenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sucursales: [],
      SucursalId: "",
    };
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
  handleSucursales = (e) =>{
    const SucursalId = e.target.value
    this.setState({
        SucursalId: SucursalId
    })
  }
  
  handleCodigoBarras = (e) =>{
    const CodigoBarras = e.target.value 
    this.setState({
        CodigoBarras: CodigoBarras
    })
  }



  async getProducto(id){
      alert(id)
      const url = this.props.url + `/api/productodescripcion/${id}`;
      const response = await fetch(url, {
          headers: {
              Authorization: `Bearer ${this.props.accessToken}`
          },
      });
      let data = await response.json();
      alert(JSON.stringify(data))
      if (data.length === 0){
          data = {error: "Producto No Existe"}
      }
      return data;
  }

  handleBuscar = async (e) =>{
      e.preventDefault();
      let arreglo = []
      alert(this.state.CodigoBarras)
      if(this.state.CodigoBarras !== ""){
        arreglo = await this.getProducto(this.state.CodigoBarras)
      } else{
          alert("Código de Barras Invalido")
          return;
      }
      if(arreglo.error){
          alert(arreglo.error)
          return;
      }



  }

  handleRender = () => {
    return (
      <React.Fragment>
        <select onChange={this.handleSucursales} id="sucursales" name="sucursales" value={this.state.SucursalId}>
          {this.state.sucursales.map((element, i) => (
            <option key={i} value={element.SucursalId}>
              {element.Sucursal}
            </option>
          ))}
        </select>
        <br />
        <label htmlFor="codigobarras">Código Barras</label>
        <br />
        <input onChange={this.handleCodigoBarras} id="codigobarras" name="codigobarras" size="15" maxLength="13"/>
        <button onClick={this.handleBuscar} className="btn btn-primary">Buscar</button>
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
