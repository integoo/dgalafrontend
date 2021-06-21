import React from "react";

import SelectSucursales from "./cmpnt/SelectSucursales";

import "./InventarioCiclico.css";

class InventarioCiclico extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SucursalId: sessionStorage.getItem("SucursalId"),
      CodigoBarras: "",
      CodigoId: "",
      Descripcion: "",
      UnidadesContadas: "",
      UnidadesInventario: 0,
      UnidadesDiferencia: 0,
      Administrador: "",
      detalles: [],
      SoloInventariable: "S",
      IsDisabled: false,
      IsDisabled2: false,
      detallesDiferencias: [],
      message: ""
    };
    this.CodigoBarrasInput = React.createRef();
    this.UnidadesContadasInput = React.createRef();
  }

  componentDidMount() {
    this.CodigoBarrasInput.current.focus();
  }
  handleSucursal = (SucursalId) => {
    this.setState({
      SucursalId: SucursalId,
    });
    this.CodigoBarrasInput.current.focus()
  };

  handleCodigoBarras = (e) => {
    const CodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: CodigoBarras,
    });
  };

  onhandleKeyDownCodigoBarras = (e) => {
    if (e.key === "Enter") {
      this.handleBuscar();
    }
  };

  handleBuscar = async () => {
    const SucursalId = this.state.SucursalId;
    const CodigoBarras = this.state.CodigoBarras;
    const detalles = this.state.detalles;
    if (CodigoBarras === "") {
      this.CodigoBarrasInput.current.focus();
      return;
    }

    if (detalles.find((element) => element.CodigoBarras === CodigoBarras)) {
      alert("El producto ya existe en el Proceso de Inventario Cíclico");
      this.setState({
        CodigoBarras: "",
      });
      return;
    }

    const SoloInventariable = "S";
    const url =
      this.props.url +
      `/api/productodescripcionporcodigobarras/${SucursalId}/${CodigoBarras}/${SoloInventariable}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.message) {
        console.log(data.message);
        alert(data.message);
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }
      this.setState({
        Descripcion: data[0].Descripcion,
        CodigoId: data[0].CodigoId,
        UnidadesInventario: data[0].UnidadesInventario,
        IsDisabled: true,
      });
      this.UnidadesContadasInput.current.focus();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  onhandleAgregar = () => {
    let detalles = this.state.detalles;
    const CodigoBarras = this.state.CodigoBarras;

    const UnidadesContadas = this.state.UnidadesContadas;
    if (UnidadesContadas < 0 || UnidadesContadas === "") {
      this.UnidadesContadasInput.current.focus();
      return;
    }
    const json = {
      CodigoId: this.state.CodigoId,
      CodigoBarras: CodigoBarras,
      Descripcion: this.state.Descripcion,
      UnidadesContadas: this.state.UnidadesContadas,
      UnidadesInventario: this.state.UnidadesInventario,
      UnidadesDiferencia: parseInt(this.state.UnidadesContadas) - parseInt(this.state.UnidadesInventario)
    };

    detalles.push(json);

    this.setState({
      IsDisabled: false,
      CodigoId: "",
      CodigoBarras: "",
      Descripcion: "",
      UnidadesContadas: "",
      UnidadesInventario:0,
      UnidadesDiferencia: 0,
      detalles: detalles,
    });
    this.CodigoBarrasInput.current.focus();
  };

  onhandleonKeyDownUnidadesContadas = (e) => {
    if (e.key === "Enter") {
      this.onhandleAgregar();
    }
  };

  onhandleUnidadesContadas = (e) => {
    let UnidadesContadas = e.target.value;
    let numbers = /^[0-9]/;
    if (UnidadesContadas.match(numbers) || UnidadesContadas === "") {
      this.setState({
        UnidadesContadas: UnidadesContadas,
        IsDisabled: false,
      });
    }
  };

  onhandleProcesar = async() =>{
    const SucursalId = this.state.SucursalId
    const detalles = this.state.detalles
    const url = this.props.url+`/api/inventariociclico`
    let data;
    if(detalles.length === 0){
        return
    }

    let detallesJson = []
    let j;
    for (let i =0; i < detalles.length; i++){
        j={
            CodigoId: detalles[i].CodigoId,
            CodigoBarras: detalles[i].CodigoBarras,
            UnidadesContadas: detalles[i].UnidadesContadas,
            UnidadesInventario: detalles[i].UnidadesInventario,
            UnidadesDiferencia: detalles[i].UnidadesDiferencia
        }
        detallesJson.push(j)
    }
    
    const json = {
        SucursalId: SucursalId,
        ColaboradorId: sessionStorage.getItem("ColaboradorId"),
        Usuario: sessionStorage.getItem("user"),
        detalles: detallesJson
    }
    
    try{
        const response = await fetch(url,{
            method: 'POST',
            body: JSON.stringify(json),
            headers: {
                Authorization: `Bearer ${this.props.accessToken}`,
                'Content-Type': 'application/json',
            },
        });
        data = await response.json()
        if(data.error){
            console.log(data.error)
            alert(data.error)
            return
        }
        const detallesDiferencias = this.state.detalles.filter(element => parseInt(element.UnidadesDiferncia) !== 0)
        this.setState({
            message: "FolioId :"+ data.FolioId,
            detallesDiferencias: detallesDiferencias,
            CodigoBarras: "",
            CodigoId: 0,
            Descripcion: "",
            UnidadesContadas: "",
            IsDisabled: true,
            IsDisabled2: true,
        })
    }catch(error){
        console.log(error.message)
        alert(error.message)
    }
}

  onhandleCancelarTransaccion = () =>{
      if(!window.confirm('Desea Cancelar el Inventario Cíclico?')){
          return
      }

      this.setState({
          CodigoBarras: "",
          Descripcion: "",
          UnidadesContadas: "",
          UnidadesInventario: "",
          UnidadesDiferencia: "",
          detalles: [],
          detallesDiferencias: [],
          IsDisabled:false,
          IsDisabled2:false,
          message: "",
      },()=>this.CodigoBarrasInput.current.focus())
      //this.CodigoBarrasInput.current.focus()
  }

  handleRender = () => {
    return (
      <div className="row">
        <div className="col-md-5 contentMain">
          <div className="card">
            <div className="card-header">
              <span className="badge badge-primary">Inventario Cíclico</span>
              <br />
              <SelectSucursales
                accessToken={this.props.accessToken}
                url={this.props.url}
                SucursalAsignada={this.state.SucursalId}
                onhandleSucursal={this.handleSucursal}
                Administrador={this.state.Administrador}
              />
              <br />
              <label htmlFor="CodigoBarras">Código Barras</label>
              <input
                onChange={this.handleCodigoBarras}
                onKeyDown={this.onhandleKeyDownCodigoBarras}
                id="CodigoBarras"
                name="CodigoBarras"
                maxLength="13"
                size="14"
                style={{ textTransform: "uppercase" }}
                value={this.state.CodigoBarras}
                ref={this.CodigoBarrasInput}
                disabled={this.state.IsDisabled}
                autoComplete="off"
              />
              <button
                className="btn btn-success btn-sm ml-2"
                onClick={this.handleBuscar}
                disabled={this.state.IsDisabled2}
              >
                Buscar
              </button>
              <br />
              <label htmlFor="descripcion">Descripcion</label>
              <input
                id="descripcion"
                name="descripcion"
                style={{ width: "95%" }}
                value={this.state.Descripcion}
                disabled={this.state.IsDisabled2}
                readOnly
              />
              <label style={{ width: "6rem" }} htmlFor="unidadescontadas">
                Unidades Contadas
              </label>
              <input
                onChange={this.onhandleUnidadesContadas}
                onKeyDown={this.onhandleonKeyDownUnidadesContadas}
                id="unidadescontadas"
                name="unidadescontadas"
                style={{ width: "4rem", textAlign: "right" }}
                value={this.state.UnidadesContadas}
                ref={this.UnidadesContadasInput}
                disabled={this.state.IsDisabled2}
                autoComplete="off"
              />
              <button
                onClick={this.onhandleAgregar}
                className="btn btn-primary btn-sm ml-4"
                disabled={this.state.IsDisabled2}
              >
                Agregar
              </button>
            </div>
          </div>
          <div className="contentDetalles">
            <table>
              <thead>
                <tr>
                  <th>Codigo Barras</th>
                  <th>Descripcion</th>
                  <th>Unidades Contadas</th>
                </tr>
              </thead>
              <tbody>
                {this.state.detalles.map((element, i) => (
                  <tr key={i}>
                    <td>{element.CodigoBarras}</td>
                    <td>{element.Descripcion}</td>
                    <td>{element.UnidadesContadas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="botonesProceso">
            <button onClick={this.onhandleProcesar} className="btn btn-success btn-block" disabled={this.state.IsDisabled2}>Procesar</button>
            <button onClick={this.onhandleCancelarTransaccion} className="btn btn-danger btn-block">Cancelar</button>
          </div>
        </div>
        <div className="col-md-5 contentDetalesDiferencias">
            <span className="badge badge-primary">{this.state.message}</span>
            <table>
                <thead>
                    <tr>
                        <th>Código Barras</th>
                        <th>Descripcion</th>
                        <th>Unidades Contadas</th>
                        <th>Unidades Inventario</th>
                        <th>Unidades Diferencia</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.detallesDiferencias.map((element,i) =>(
                        <tr key={i}>
                            <td>{element.CodigoBarras}</td>
                            <td>{element.Descripcion}</td>
                            <td>{element.UnidadesContadas}</td>
                            <td>{element.UnidadesInventario}</td>
                            <td>{parseInt(element.UnidadesContadas) - parseInt(element.UnidadesInventario)}</td>
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
        <div className="container">
          <this.handleRender />
        </div>
      </React.Fragment>
    );
  }
}

export default InventarioCiclico;
