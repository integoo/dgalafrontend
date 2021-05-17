import React from "react";

import "./InputCodigoBarras.css";

class InputCodigoBarras extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SucursalId: sessionStorage.getItem("SucursalId"),
      CodigoBarras: this.props.vCodigoBarrasProp,
      Descripcion: "",
      detalles: [],
      UnidadesInventario: 0,
      disabled:false,
    };
    this.refCodigoBarras = React.createRef();
    this.refDescripcion = React.createRef();
  }

  componentDidMount() {
    this.refCodigoBarras.current.focus();
  }

  handleCodigoBarras = (e) => {
    e.preventDefault();
    const CodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: CodigoBarras,
      detalles: [],
    });
    this.props.handleCodigoBarrasProp(CodigoBarras);
  };

  handleCodigoBarrasKeyPress = (e) => {
    if (e.key === "Enter") {
      this.handleConsulta(e);
    }else{
      const CodigoBarras = e.target.value.toUpperCase();
      this.setState({
        CodigoBarras: CodigoBarras,
        detalles: [],
    });
    this.props.handleCodigoBarrasProp(CodigoBarras);
    }
  };

  onhandleDescripcionKeyPress = (e) => {
    if (e.key === "Enter") {
        this.refCodigoBarras.current.focus();
    }
  };


  getProductosDescripcion = async (Descripcion) => {
    const SucursalId = parseInt(this.state.SucursalId)
    const url =
      this.props.url + `/api/productosdescripcioncompraventa/${SucursalId}/${Descripcion}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getProductoCodigoBarras = async (CodigoBarras) => {
    const SucursalId = this.state.SucursalId
    const url =
      this.props.url +
      `/api/productodescripcionporcodigobarras/${SucursalId}/${CodigoBarras}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  addRowHandlers = () => {
    const table = document.getElementById("table1");
    const rows = table.getElementsByTagName("tr");
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
          this.setState({
            CodigoBarras: vcodigobarras,
            Descripcion: vdescripcion,
            UnidadesInventario: vUnidadesInventario,
            disabled: true,
          });

          this.props.handleCodigoBarrasProp(vcodigobarras);
          this.props.handleConsultaProp(vcodigobarras, vdescripcion, vUnidadesInventario);
          document.querySelector("#tableInputCodigoBarras").style.display =
            "none";
        };
      };
      currentRow.onclick = createClickHandler(currentRow);
    }
  };

  onhandleDescripcion = async (e) => {
    e.preventDefault();
    const Descripcion = e.target.value.toUpperCase();
    this.setState({
      Descripcion: Descripcion,
    });
    let arreglo = [];
    if (Descripcion.length >= 3) {
      arreglo = await this.getProductosDescripcion(Descripcion);
    }
    if (arreglo.error) {
      console.log(arreglo.error);
      alert(arreglo.error);
      return;
    }
    this.setState({
      detalles: arreglo,
    });
    this.addRowHandlers();
  };


  handleConsulta = async (e) => {
    e.preventDefault();
    if (!this.state.CodigoBarras) {
      if (
        document.querySelector("#tableInputCodigoBarras").style.display ===
        "block"
      ) {
        document.querySelector("#tableInputCodigoBarras").style.display =
          "none";
        this.refCodigoBarras.current.focus();
      } else {
        document.querySelector("#tableInputCodigoBarras").style.display =
          "block";
        this.setState({
          CodigoBarras: "",
          Descripcion: "",
          detalles: [],
          UnidadesInventario: 0,
        });
        this.refDescripcion.current.focus();
      }
    } else {
      const jsonProducto = await this.getProductoCodigoBarras(
        this.state.CodigoBarras
      );
      if(jsonProducto.length == []){
        alert("Producto no Existe")
        this.setState({
          CodigoBarras:"",
          Descripcion:"",
          UnidadesInventario: 0,
        })
        this.refCodigoBarras.current.focus()
        return
      }
      const DescripcionParameter = jsonProducto[0].Descripcion;
      const UnidadesInventarioParameter = parseInt(jsonProducto[0].UnidadesInventario)
      this.props.handleConsultaProp(
        this.state.CodigoBarras,
        DescripcionParameter,
        UnidadesInventarioParameter
      );
      this.setState({
        disabled: true
      })
    }
  };

  handleRefCodigoBarrasInput = () =>{
    this.setState({
      disabled: false,
      CodigoBarras: "",
    },()=> {this.refCodigoBarras.current.focus()})  //Lo puse aquí para que funcionara el Focus
    //this.refCodigoBarras.current.focus()
  }

  handleRefSucursalId = (SucursalId) =>{
    this.setState({
      SucursalId: SucursalId,
    })
  }

  handleRender = () => {
    return (
      <div className="mainInputCodigoBarras">
        <label htmlFor="codigobarras">Código Barras</label>
        <input
          onChange={this.handleCodigoBarras}
          onKeyPress={this.handleCodigoBarrasKeyPress}
          id="codigobarras"
          name="codigobarras"
          value={this.state.CodigoBarras}
          size="15"
          maxLength="13"
          style={{ textTransform: "capitalize" }}
          ref={this.refCodigoBarras}
          autoComplete="off"
          disabled={(this.state.disabled) ? "disabled" : ""}
          required
        />
        <button
          className="btn btn-success btn-sm ml-1"
          onClick={this.handleConsulta}
        >
          Consulta
        </button>
        <div id="tableInputCodigoBarras">
          <label htmlFor="descripcion">Descripcion</label>
          <input
            onChange={this.onhandleDescripcion}
            onKeyPress={this.onhandleDescripcionKeyPress}
            id="descripcion"
            name="descripcion"
            value={this.state.Descripcion}
            ref={this.refDescripcion}
            autoComplete="off"
          />
          <table id="table1" onClick={this.handlerRowClicked}>
            <thead>
              <tr>
                <th>Código</th>
                <th>Código Barras</th>
                <th>Descripción</th>
                <th>Unidades Inventario</th>
              </tr>
            </thead>
            <tbody>
              {this.state.detalles.map((element, i) => (
                <tr key={i}>
                  <td>{element.CodigoId}</td>
                  <td>{element.CodigoBarras}</td>
                  <td>{element.Descripcion}</td>
                  <td>{element.UnidadesInventario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <this.handleRender />
      </React.Fragment>
    );
  }
}
export default InputCodigoBarras;
