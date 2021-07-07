import React, { Component } from "react";

import InputFecha from "./cmpnt/InputFecha";
import "./VentasIngresos.css";

class VentasIngresos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // SucursalId: "",
      unidadesDeNegocio: [],
      unidadesDeNegocioCatalogo: [],
      UnidadDeNegocioId: "",

      cuentasContables: [],
      cuentasContablesCatalogo: [],
      cuentasContablesDeUnidadDeNegocio: [],
      CuentaContableId: "",

      subcuentasContables: [],
      subcuentasContablesCatalogo: [],
      subcuentasContablesDeUnidadDeNegocio: [],
      SubcuentaContableId: "",

      SucursalesCatalogo: [],
      Sucursales: [],
      SucursalesIngresos: [],

      Fecha: "",
      arregloVentasIngresos:[],
    };
  }

  async componentDidMount() {
    await this.getUnidadesDeNegocio();
    await this.getCuentasContables();
    await this.getSubcuentasContables();
    await this.getSucursales();

    let arregloCC = this.state.cuentasContablesCatalogo.filter(
      (element) => element.UnidadDeNegocioId === this.state.UnidadDeNegocioId
    );
    let arregloScC = this.state.subcuentasContablesCatalogo.filter(
      (element) =>
        element.UnidadDeNegocioId === this.state.UnidadDeNegocioId &&
        element.CuentaContableId === this.state.CuentaContableId
    );
    this.setState({
      cuentasContablesDeUnidadDeNegocio: arregloCC,
      subcuentasContablesDeUnidadDeNegocio: arregloScC,
    });
    const arregloSucursales = this.state.subcuentasContables.filter(
      (element) =>
        element.UnidadDeNegocioId === this.state.UnidadDeNegocioId &&
        element.CuentaContableId === this.state.CuentaContableId &&
        element.SubcuentaContableId === this.state.SubcuentaContableId
    );

    const sucursales = arregloSucursales.map((element) => element.SucursalId);

    let SucursalesIngresos = [];
    sucursales.forEach((element) => {
      let arregloTemp = this.state.SucursalesCatalogo.filter(
        (e) => parseInt(e.SucursalId) === parseInt(element)
      );
      let json = {
        SucursalId: arregloTemp[0].SucursalId,
        Sucursal: arregloTemp[0].Sucursal,
        Monto: "",
      };
      SucursalesIngresos.push(json);
    });
    this.setState({
      SucursalesIngresos: SucursalesIngresos,
    });

    this.handleConsultaIngresos()
  }

  getUnidadesDeNegocio = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();

      let catalogo = [];
      for (let i = 0; data.length > i; i++) {
        let json = {
          UnidadDeNegocioId: data[i].UnidadDeNegocioId,
          UnidadDeNegocio: data[i].UnidadDeNegocio,
        };
        let arregloTemp =
          catalogo.find(
            (element) => data[i].UnidadDeNegocioId === element.UnidadDeNegocioId
          ) || [];
        if (arregloTemp.length === 0) {
          catalogo.push(json);
        }
      }
      this.setState({
        unidadesDeNegocio: data, //Tienes duplicados ver api
        unidadesDeNegocioCatalogo: catalogo, //Formé un catálogo para este Component
        UnidadDeNegocioId: catalogo[0].UnidadDeNegocioId, //Valor Inicial al cargar el Component
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getCuentasContables = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      let catalogo = [];
      for (let i = 0; data.length > i; i++) {
        let json = {
          UnidadDeNegocioId: data[i].UnidadDeNegocioId,
          CuentaContableId: data[i].CuentaContableId,
          CuentaContable: data[i].CuentaContable,
        };
        let arregloTemp =
          catalogo.find(
            (element) =>
              data[i].UnidadDeNegocioId === element.UnidadDeNegocioId &&
              data[i].CuentaContableId === element.CuentaContableId
          ) || [];
        if (arregloTemp.length === 0) {
          catalogo.push(json);
        }
      }
      this.setState({
        cuentasContables: data,
        cuentasContablesCatalogo: catalogo,
        CuentaContableId: catalogo[0].CuentaContableId,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getSubcuentasContables = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      let catalogo = [];
      for (let i = 0; data.length > i; i++) {
        let json = {
          UnidadDeNegocioId: data[i].UnidadDeNegocioId,
          CuentaContableId: data[i].CuentaContableId,
          SubcuentaContableId: data[i].SubcuentaContableId,
          SubcuentaContable: data[i].SubcuentaContable,
        };
        let arregloTemp =
          catalogo.find(
            (element) =>
              data[i].UnidadDeNegocioId === element.UnidadDeNegocioId &&
              data[i].CuentaContableId === element.CuentaContableId &&
              element.SubcuentaContableId === data[i].SubcuentaContableId
          ) || [];
        if (arregloTemp.length === 0) {
          catalogo.push(json);
        }
      }
      this.setState({
        subcuentasContables: data,
        subcuentasContablesCatalogo: catalogo,
        SubcuentaContableId: catalogo[0].SubcuentaContableId,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getSucursales = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    const url = this.props.url + `/api/sucursales/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      // let catalogo = []
      // for (let i=0; data.length > i; i++){
      //     let json = {
      //         UnidadDeNegocioId: data[i].UnidadDeNegocioId,
      //         CuentaContableId: data[i].CuentaContableId,
      //         SubcuentaContableId: data[i].SubcuentaContableId,
      //         SubcuentaContable: data[i].SubcuentaContable
      //     }
      //     let arregloTemp = catalogo.find(element => data[i].UnidadDeNegocioId === element.UnidadDeNegocioId && data[i].CuentaContableId === element.CuentaContableId && element.SubcuentaContableId === data[i].SubcuentaContableId) || []
      //     if(arregloTemp.length === 0){
      //         catalogo.push(json)
      //     }
      // }
      this.setState({
        SucursalesCatalogo: data,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  handleDespliegaSucursales = (
    UnidadDeNegocioId,
    CuentaContableId,
    SubcuentaContableId
  ) => {
    const arregloSucursales = this.state.subcuentasContables.filter(
      (element) =>
        element.UnidadDeNegocioId === UnidadDeNegocioId &&
        element.CuentaContableId === CuentaContableId &&
        element.SubcuentaContableId === SubcuentaContableId
    );

    const sucursales = arregloSucursales.map((element) => element.SucursalId);

    let SucursalesIngresos = [];
    sucursales.forEach((element) => {
      let arregloTemp = this.state.SucursalesCatalogo.filter(
        (e) => parseInt(e.SucursalId) === parseInt(element)
      );
      let json = {
        SucursalId: arregloTemp[0].SucursalId,
        Sucursal: arregloTemp[0].Sucursal,
        Monto: "",
      };
      SucursalesIngresos.push(json);
    });
    this.setState({
      SucursalesIngresos: SucursalesIngresos,
    });
  };

  handleUnidadDeNegocio = (e) => {
    const UnidadDeNegocioId = parseInt(e.target.value);
    const arregloTemp = this.state.cuentasContablesCatalogo.filter(
      (element) => parseInt(element.UnidadDeNegocioId) === UnidadDeNegocioId
    );
    const CuentaContableId = parseInt(arregloTemp[0].CuentaContableId);
    const arregloTempScC = this.state.subcuentasContablesCatalogo.filter(
      (element) =>
        parseInt(element.UnidadDeNegocioId) === UnidadDeNegocioId &&
        parseInt(element.CuentaContableId) === CuentaContableId
    );
    const SubcuentaContableId = arregloTempScC[0].SubcuentaContableId;
    this.setState({
      UnidadDeNegocioId: UnidadDeNegocioId,
      cuentasContablesDeUnidadDeNegocio: arregloTemp,
      subcuentasContablesDeUnidadDeNegocio: arregloTempScC,
      CuentaContableId: CuentaContableId,
      SubcuentaContableId: SubcuentaContableId,
    });

    this.handleDespliegaSucursales(
      UnidadDeNegocioId,
      CuentaContableId,
      SubcuentaContableId
    );
  };

  handleCuentaContable = (e) => {
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId;
    const CuentaContableId = parseInt(e.target.value);
    const arregloTemp = this.state.subcuentasContablesCatalogo.filter(
      (element) =>
        parseInt(element.UnidadDeNegocioId) === UnidadDeNegocioId &&
        parseInt(element.CuentaContableId) === parseInt(CuentaContableId)
    );
    const SubcuentaContableId = arregloTemp[0].SubcuentaContableId;
    this.setState({
      CuentaContableId: CuentaContableId,
      subcuentasContablesDeUnidadDeNegocio: arregloTemp,
      SubcuentaContableId: SubcuentaContableId,
    });

    this.handleDespliegaSucursales(
      UnidadDeNegocioId,
      CuentaContableId,
      SubcuentaContableId
    );
  };

  handleSubcuentaContable = (e) => {
    const SubcuentaContableId = parseInt(e.target.value);
    this.setState({
      SubcuentaContableId: SubcuentaContableId,
    });
    this.handleDespliegaSucursales(
      this.stateUnidadDeNegocioId,
      this.state.CuentaContableId,
      SubcuentaContableId
    );
  };

  handleConsultaIngresos = async() =>{
    const Fecha = this.state.Fecha
    const naturalezaCC = this.props.naturalezaCC
    const url = this.props.url + `/ingresos/getIngresosEgresos/${Fecha}/${naturalezaCC}`
    // /api/validamovimientoingresosegresos/:SucursalId/:UnidadDeNegocioId/:CuentaContableId/:SubcuentaContableId/:Fecha

    try{
      const response = await fetch(url,{
        headers:{
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json()
      this.setState({
        arregloVentasIngresos:data,
      })
    }catch(error){
        console.log(error.message)
        alert(error.message)
    }
  }

  handleFecha = (Fecha) => {
    this.setState({
      Fecha: Fecha,
    });
  };

  handleMonto = (e) => {

    let { value } = e.target;
    value = value.toString().replace(",", "");

    if (value[0] === " ") {
      return;
    }

    let numbers = /^[0-9 .]+$/;
    if (value.match(numbers) || value === "") {



      //this.setState({ monto: value });


      const SucursalId = parseInt(e.target.id);
      let SucursalesIngresos = this.state.SucursalesIngresos;
      SucursalesIngresos[SucursalId].Monto = value;
      this.setState({
        SucursalesIngresos: SucursalesIngresos,
      });
    }



    // let numbers = /^[0-9]+$/;
    // if (e.target.value.match(numbers) || e.target.value === ""){
      
    //   let Monto = parseFloat(e.target.value);
    //   if (e.target.value.length === 0 || e.target.value[0] == " ") {
    //     Monto = "";
    //   }
    //}
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleGrabar = async()=>{

  }

  handleRender = () => {
    const styleLabel = { width: "10rem" };
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="Principal">
            <label htmlFor="" style={styleLabel}>
              Unidad De Negocio
            </label>
            <select onChange={this.handleUnidadDeNegocio}>
              {this.state.unidadesDeNegocioCatalogo.map((element, i) => (
                <option key={i} value={element.UnidadDeNegocioId}>
                  {element.UnidadDeNegocio}
                </option>
              ))}
            </select>
            <br />
            <label htmlFor="" style={styleLabel}>
              Cuenta Contable
            </label>
            <select onChange={this.handleCuentaContable}>
              {this.state.cuentasContablesDeUnidadDeNegocio.map(
                (element, i) => (
                  <option key={i} value={element.CuentaContableId}>
                    {element.CuentaContable}
                  </option>
                )
              )}
            </select>
            <br />
            <label htmlFor="" style={styleLabel}>
              Subcuenta Contable
            </label>
            <select onChange={this.handleSubcuentaContable}>
              {this.state.subcuentasContablesDeUnidadDeNegocio.map(
                (element, i) => (
                  <option key={i} value={element.SubcuentaContableId}>
                    {element.SubcuentaContable}
                  </option>
                )
              )}
            </select>
            <br />
            <label htmlFor="" style={styleLabel}>
              Fecha
            </label>
            <InputFecha onhandleFecha={this.handleFecha} />
            <br />
            <br />
            {this.state.SucursalesIngresos.map((element, i) => (
              <div className="sucursalesDiv">
                <label htmlFor="" key={i}>
                  {element.Sucursal}
                </label>
                {i === 0 ? (
                  <input
                    onChange={this.handleMonto}
                    value={this.numberWithCommas(this.state.SucursalesIngresos[i].Monto)}
                    id={i}
                    name={element.SucursalId}
                    autoComplete="off"
                    autoFocus
                    />
                    ) : (
                      <input
                      onChange={this.handleMonto}
                      value={this.numberWithCommas(this.state.SucursalesIngresos[i].Monto)}
                      id={i}
                      name={element.SucursalId}
                      autoComplete="off"
                      />
                )}
              </div>
            ))}
            <button onClick={this.handleGrabar} className="btn btn-success ">Grabar</button>
            <button className="btn btn-danger m-4">Cancelar</button>
          </div>
          <div className="PrincipalDia">
            <h5>Día</h5>
          </div>
        </div>
        <div className="col-md-8">
            <div className="Secundario">
                <h5>Mes</h5>
                  <table>
                    <thead>
                      <tr>
                        <th>Sucursal</th>
                        <th>Unidad De Negocio</th>
                        <th>Folio</th>
                        <th>Fecha</th>
                        <th>Cuenta Contable</th>
                        <th>Subcuenta Contable</th>
                        <th>Monto</th>

                      </tr>
                    </thead>
                    <tbody>
                      {this.state.arregloVentasIngresos.map((element,i) =>(
                        <tr key={i}>
                          <td>{element.SucursalNombre}</td>
                          <td>{element.UnidadDeNegocioNombre}</td>
                          <td>{element.FolioId}</td>
                          <td>{element.Fecha.substring(0,10)}</td>
                          <td>{element.CuentaContable}</td>
                          <td>{element.SubcuentaContable}</td>
                          <td>{element.Monto}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
            </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          {this.state.cuentasContables.length > 0 ? (
            <this.handleRender />
          ) : (
            <h2>Loading ...</h2>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default VentasIngresos;
