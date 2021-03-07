import React, { Component } from "react";

import "./Ingresos.css";

class Ingresos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fecha: "",
      monto: "",
      ingresos: [],
      ingresosCadena:[],
      ingresosTotal:0,
      sucursales: [],
      sucursalnombre:"",
      unidadesdenegocio: [],
      unidadesdenegociocatalogo:[],
      cuentascontables: [],
      cuentascontablescatalogo:[],
      subcuentascontables: [],
      subcuentascontablescatalogo:[],
      selectedValueSucursal: "1",
      selectedValueUnidadDeNegocio: "1",
      selectedValueCuentaContable: "10000",
      selectedValueSubcuentaContable: "001",
      comentarios: "",
      periodoabierto:"",
      primerdiames:""
    };

    this.handleFecha = this.handleFecha.bind(this);
    this.HandleSucursales = this.HandleSucursales.bind(this);
    this.HandleUnidadesDeNegocio = this.HandleUnidadesDeNegocio.bind(this);
    this.HandleCuentasContables = this.HandleCuentasContables.bind(this);
    this.HandleSubcuentasContables = this.HandleSubcuentasContables.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // this.monto = React.createRef();
    
  }

  fechaActual() {
    const d = new Date();
    let vfecha =
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2);

    return vfecha;
  }

  async componentDidMount() {
    try{

      this.monto = React.createRef();
  
      const dataSucursales = await this.getSucursales();
      if (dataSucursales.error) {
        alert(dataSucursales.error);
        return;
      }
      // const dataSucursales = dataSucursales2.filter(
      //   (element) => element.TipoSucursal != "P"
      // );
      const vsucursalnombre = dataSucursales[0].SucursalNombre
  
  
  
  
      const dataUnidadesNegocioCatalogo = await this.getUnidadesNegocioCatalogo();
      if (dataUnidadesNegocioCatalogo.error){
        alert(dataUnidadesNegocioCatalogo.error)
        return;
      }
      const dataUnidadesNegocio = dataUnidadesNegocioCatalogo.filter(element => element.SucursalId === dataSucursales[0].SucursalId)
  
      const dataCuentasContablesCatalogo = await this.getCuentasContablesCatalogo();
      if (dataCuentasContablesCatalogo.error) {
        alert(dataCuentasContablesCatalogo.error);
        return;
      }
      const dataCuentasContables = dataCuentasContablesCatalogo.filter(element => element.SucursalId === dataSucursales[0].SucursalId && element.UnidadDeNegocioId === dataUnidadesNegocio[0].UnidadDeNegocioId && parseInt(element.NaturalezaCC) === parseInt(this.props.naturalezaCC))
  
      const dataSubcuentasContablesCatalogo = await this.getSubcuentasContablesCatalogo()
      if (dataSubcuentasContablesCatalogo.error) {
        alert(dataSubcuentasContablesCatalogo.error);
        return;
      }
      const dataSubcuentasContables = dataSubcuentasContablesCatalogo.filter( element => element.SucursalId === dataSucursales[0].SucursalId && element.UnidadDeNegocioId === dataUnidadesNegocio[0].UnidadDeNegocioId && element.CuentaContableId === dataCuentasContables[0].CuentaContableId )
  
  
  
      const dataGetIngresosCadena = await this.getIngresos(
        // this.fechaActual(),dataSucursales[0].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId,
        // dataCuentasContables[0].CuentaContableId,dataSubcuentasContables[0].SubcuentaContableId
        this.fechaActual(),dataSucursales[0].SucursalId
      );

      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }
      const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === dataSucursales[0].SucursalId && element.UnidadDeNegocioId === dataUnidadesNegocio[0].UnidadDeNegocioId && element.CuentaContableId === dataCuentasContables[0].CuentaContableId && element.SubcuentaContableId === dataSubcuentasContables[0].SubcuentaContableId)
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))
      vtotal = vtotal.toFixed(2)
  
      const dataPeriodoAbierto = await this.getPeriodoAbierto()
      if (dataPeriodoAbierto.error){
        alert(dataPeriodoAbierto.error)
        return;
      }
  
  
      this.setState({
        fecha: this.fechaActual(),
        sucursales: dataSucursales,
        sucursalnombre: vsucursalnombre,
        unidadesdenegocio: dataUnidadesNegocio,
        unidadesdenegociocatalogo: dataUnidadesNegocioCatalogo,
        cuentascontables: dataCuentasContables,
        cuentascontablescatalogo: dataCuentasContablesCatalogo,
        subcuentascontables: dataSubcuentasContables,
        subcuentascontablescatalogo: dataSubcuentasContablesCatalogo,
        selectedValueSucursal: dataSucursales[0].SucursalId,
        selectedValueUnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocioId,
        selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
        selectedValueSubcuentaContable:
          dataSubcuentasContables[0].SubcuentaContableId,
        ingresos: dataGetIngresos,
        ingresosCadena: dataGetIngresosCadena,
        ingresosTotal: vtotal,
        periodoabierto:dataPeriodoAbierto.rows[0].Periodo,
        primerdiames:dataPeriodoAbierto.rows[0].PrimerDiaMes.substr(0,10)
      });
  
      //try {
        this.monto.current.focus();
      //} catch (error) {
      //  console.log(error.message);
      //  alert(error.message);
      //}
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }

  }

  async getSucursales() {
    const  naturalezaCC = this.props.naturalezaCC;
    const url = `http://decorafiestas.com:3001/api/sucursales/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if(data.length === 0){
        data={"error": "No hay Sucursales"}
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getUnidadesNegocioCatalogo(){
    const naturalezaCC = this.props.naturalezaCC;
    const url = `http://decorafiestas.com:3001/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try{
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if(data.length === 0){
        data={"error": "No hay Unidades de Negocio"}
      }
      return data;
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }
  }

  async getCuentasContablesCatalogo() {
    const naturalezaCC = this.props.naturalezaCC;
    const url = `http://decorafiestas.com:3001/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if(data.length === 0){
        data = {"error": "No hay Cuentas Contables"}
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getSubcuentasContablesCatalogo() {
    const naturalezaCC = this.props.naturalezaCC;
    const url = `http://decorafiestas.com:3001/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if(data.length === 0){
        data = {"error":"No hay Subcuentas Contables"}
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  // async getIngresos(vfecha,vsucursal,vunidaddenegocio,vcuentacontable,vsubcuentacontable) {
  //   const url = `http://decorafiestas.com:3001/ingresos/getingresos/${vfecha}/${vsucursal}/${vunidaddenegocio}/${vcuentacontable}/${vsubcuentacontable}`;
  async getIngresos(vfecha,vsucursal) {
    const url = `http://decorafiestas.com:3001/ingresos/getingresos/${vfecha}/${vsucursal}`;
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
  }

  async getPeriodoAbierto(){
    const url = `http://decorafiestas.com:3001/periodoabierto`
    try{
      const response = await fetch(url,{
        headers:{
          Authorization: `Bearer ${this.props.accessToken}`
        },
      });
      const data = await response.json();
      return data;
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }
  }

  async handleFecha(event) {
    const vfecha = event.target.value;
    try{
      const dataGetIngresosCadena = await this.getIngresos(
        // event.target.value
        // vfecha,this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,
        // this.state.selectedValueCuentaContable, this.state.selectedValueSubcuentaContable
        vfecha,this.state.selectedValueSucursal
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }
      const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))
  
  
      this.setState({
        fecha: vfecha,
        ingresosCadena: dataGetIngresosCadena,
        ingresos: dataGetIngresos,
        ingresosTotal: vtotal
      });
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }
  }

  HandleSucursales(event) {
    let vsucursalnombre="";
    const datasucursales = this.state.sucursales
    datasucursales.map(element => {
      if(element.SucursalId === parseInt(event.target.value)){
        vsucursalnombre = element.SucursalNombre
      }
      return null;
    })
    this.setState({ selectedValueSucursal: event.target.value,
                    sucursalnombre: vsucursalnombre }, async () => {
        const dataUnidadesNegocio = this.state.unidadesdenegociocatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal))

        const dataCuentasContables = this.state.cuentascontablescatalogo.filter(element => parseInt(element.SucursalId) ===  parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) && element.NaturalezaCC.toString() === this.props.naturalezaCC.toString())

        const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) ===  parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) && parseInt(element.CuentaContableId) === parseInt(dataCuentasContables[0].CuentaContableId) )
        
        //const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
        const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) && element.CuentaContableId === parseInt(dataCuentasContables[0].CuentaContableId) && element.SubcuentaContableId === dataSubcuentasContables[0].SubcuentaContableId)
        let vtotal=parseFloat(0.0)
        dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))
  
      this.setState({
        unidadesdenegocio: dataUnidadesNegocio,
        cuentascontables: dataCuentasContables,
        subcuentascontables: dataSubcuentasContables,
        selectedValueUnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocioId,
        selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
        selectedValueSubcuentaContable:
          dataSubcuentasContables[0].SubcuentaContableId,
        ingresos: dataGetIngresos,
        ingresosTotal: vtotal
      });



    });
    this.monto.current.focus();
  }

  HandleUnidadesDeNegocio(event) {
    this.setState(
      {
        selectedValueUnidadDeNegocio: event.target.value,
      },() => {
        const dataCuentasContables = this.state.cuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio))

        const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio) && parseInt(element.CuentaContableId) === parseInt(dataCuentasContables[0].CuentaContableId))

        const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
        let vtotal=parseFloat(0.0)
        dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))

        this.setState({
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
            ingresos: dataGetIngresos,
            ingresosTotal: vtotal
        });
      }
    );
    this.monto.current.focus();
  }

  HandleCuentasContables(event) {
    this.setState(
      {
        selectedValueCuentaContable: event.target.value,
      },

      () =>{
      const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio) && parseInt(element.CuentaContableId) === parseInt(this.state.selectedValueCuentaContable))

      const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))

        this.setState({
          subcuentascontables: dataSubcuentasContables,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
            ingresos: dataGetIngresos,
            ingresosTotal: vtotal
        });
      }
    );
    this.monto.current.focus();
  }

  HandleSubcuentasContables(event) {
    this.setState({
      selectedValueSubcuentaContable: event.target.value,
    },
    ()=>{
      const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))

        this.setState({
          ingresos: dataGetIngresos,
          ingresosTotal: vtotal
        })
    }
    );
    this.monto.current.focus();
  }

  handleChange = (event) => {
    // let { value, min, max, step } = event.target;
    let { value } = event.target;
    this.setState({ monto: value });
  };

  handleComentarios = (event) => {
    let { value } = event.target;
    this.setState({ comentarios: value });
  };

  // handleKeyPress = (event) => {};

  async handleSubmit(event) {
    event.preventDefault();
    const d1 = new Date(this.state.fecha)
    const d2 = new Date(this.state.primerdiames)
    if(d1 < d2){
      alert("ERROR : La Fecha debe ser mayor o igual que "+this.state.primerdiames)
      return
    }
    //#################################### VALIDA INPUT FLOAT #################################
    let value = event.target.monto.value;
    let bandera = true;

    //Valida que no haya más de un punto (.)
    let count = 0;
    for (let i = 0; i < value.toString().length; i++) {
      if (value.charAt(i) === ".") {
        count++;
      }
    }
    if (count > 1) {
      bandera = false;
    }
    //Valida que si tiene un solo caracter que no sea punto (.)
    if (count === 1) {
      if (value.length === 1) {
        bandera = false;
      }
    }

    //Valida que el último caracter no sea un punto (.)
    if (value.charAt(value.length - 1) === ".") {
      bandera = false;
    }

    //Valida que solo haya números y punto
    const arreglo = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    for (let i = 0; i < value.toString().length; i++) {
      let arregloFiltro = arreglo.filter(
        (element) => element === value.charAt(i).toString()
      );
      if (!arregloFiltro.length) {
        bandera = false;
      }
    }
    if (!bandera) {
      alert("Error en Monto Pesos");
      this.setState({ monto: "" });
      this.monto.current.focus();
      return;
    }
    //#######################################################################################

    let json = {
      SucursalId: this.state.selectedValueSucursal,
      UnidadDeNegocioId: this.state.selectedValueUnidadDeNegocio,
      CuentaContableId: this.state.selectedValueCuentaContable,
      SubcuentaContableId: this.state.selectedValueSubcuentaContable,
      Fecha: this.state.fecha,
      Monto: this.state.monto*parseInt(this.props.naturalezaCC),
      Comentarios: this.state.comentarios,
      Usuario: sessionStorage.getItem("user")
    };

    try {
      const url = `http://decorafiestas.com:3001/ingresos/grabaingresos`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json), //JSON.stringify(data)
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      //const data = await response.json()
      const data = await response.text();

      //####### Actualiza Ingresos #########
      const dataGetIngresosCadena = await this.getIngresos(
        //this.state.selectedValueSucursal,
        // this.state.fecha, this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,
        // this.state.selectedValueCuentaContable,this.state.selectedValueSubcuentaContable
        this.state.fecha, this.state.selectedValueSucursal
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }

      const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal) && element.UnidadDeNegocioId === parseInt(this.state.selectedValueUnidadDeNegocio) && element.CuentaContableId === parseInt(this.state.selectedValueCuentaContable) && element.SubcuentaContableId === this.state.selectedValueSubcuentaContable)
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))
      vtotal = vtotal.toFixed(2)

      //####################################
      this.setState({ monto: "", 
                      comentarios:"",
                      ingresosCadena:dataGetIngresosCadena,
                      ingresos: dataGetIngresos,
                      ingresosTotal: vtotal
                    });
      this.monto.current.focus();
      alert(data);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  deleteItem(event) {
    alert(event.target.value);
    alert(event.target.name);
    alert("Si borra");
    //alert(event.target.value)
    console.log(event);
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleRender = () =>{
    const styleLabel = {
      display: "inlineBlock",
      fontSize: ".8em",
      width: "150px",
      padding: "0 10px 0 10px",
    };

    const styleMonto = {
      textAlign: "right",
      margin: "0 0 10px 0",
    };

    const styleSelect = {
      display: "inlineBlock",
      width: 205,
    };

    return (
      // <React.Fragment>
        <div className="container">
          <div className="row">
            <form
              className="col-md-5 seccionIngresos"
              onSubmit={this.handleSubmit}
            >
              <h2>
                {(this.props.naturalezaCC === "1") ? <span className="badge badge-success mb-1">Ingresos</span> : <span className="badge badge-danger mb-1">Egresos</span>}
              </h2>
              <div className="text-right">
                <span className="badge badge-secondary mr-1">
                  Periodo Abierto:
                </span>
                <span className="badge badge-warning">{this.state.periodoabierto}</span>
              </div>
              <br />
              <label htmlFor="fecha" style={styleLabel}>
                Fecha :
              </label>
              <input
                onChange={this.handleFecha}
                type="date"
                name="fecha"
                id="fecha"
                value={this.state.fecha}
              />
              <br />

              <label htmlFor="sucursales" style={styleLabel}>
                Sucursal:
              </label>
              <select
                style={styleSelect}
                onChange={this.HandleSucursales}
                id="sucursal"
                name="sucursal"
                value={this.state.selectedValueSucursal}
              >
                {this.state.sucursales.map((element, i) => (
                  <option key={i} value={element.SucursalId}>
                    {element.Sucursal}
                  </option>
                ))}
              </select>

              <br />
              <label htmlFor="unidadesdenegocio" style={styleLabel}>
                Unidad de Negocio:
              </label>

              <select
                style={styleSelect}
                onChange={this.HandleUnidadesDeNegocio}
                id="unidadesdenegocio"
                name="unidadesdenegocio"
                value={this.state.selectedValueUnidadDeNegocio}
              >
                {this.state.unidadesdenegocio.map((element, i) => (
                  <option key={i} value={element.UnidadDeNegocioId}>
                    {element.UnidadDeNegocio}
                  </option>
                ))}
              </select>

              <br />
              <label style={styleLabel} htmlFor="cuentaContable">
                Cuenta Contable:
              </label>

              <select
                style={styleSelect}
                onChange={this.HandleCuentasContables}
                id="cuentaContable"
                name="cuentaContable"
                value={this.state.selectedValueCuentaContable}
              >
                {this.state.cuentascontables.map((element, i) => (
                  <option key={i} value={element.CuentaContableId}>
                    {element.CuentaContable}
                  </option>
                ))}
              </select>

              <br />
              <label htmlFor="subcuentaContable" style={styleLabel}>
                SubCuenta Contable:
              </label>

              <select
                style={styleSelect}
                onChange={this.HandleSubcuentasContables}
                id="subcuentaContable"
                name="subcuentaContable"
                value={this.state.selectedValueSubcuentaContable}
              >
                {this.state.subcuentascontables.map((element, i) => (
                  <option key={i} value={element.SubcuentaContableId}>
                    {element.SubcuentaContable}
                  </option>
                ))}
              </select>
              <br />

              <label htmlFor="monto" style={styleLabel}>
                Monto Pesos
              </label>
              <input
                style={styleMonto}
                type="numeric"
                step="0.01"
                placeholder="Monto $$$"
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                value={this.state.monto}
                id="monto"
                name="monto"
                autoComplete="off"
                min="0.01"
                max="99999"
                size="12"
                maxLength="9"
                required
                ref={this.monto}
              />
              <br />
              <textarea
                id="comentariosTextarea"
                name="comentariosTextarea"
                cols="30"
                row="2"
                maxLength="75"
                placeholder="Comentarios..."
                onChange={this.handleComentarios}
                value={this.state.comentarios}
              ></textarea>
              <br />
              <br />
              <button
                className="btn btn-primary btn-lg btn-block mb-3"
                type="submit"
              >
                Save
              </button>
              <button
                className="btn btn-primary btn-lg btn-block mb-3"
                type="reset"
              >
                Clear
              </button>
            </form>

            <div className="col-md-5 seccionDespliegaIngresos">
              <h2>
                {this.props.naturalezaCC === '1' ?
                <span className="badge badge-success">Ingresos {this.state.sucursalnombre}</span>
                :
                <span className="badge badge-danger">Egresos {this.state.sucursalnombre}</span>
                }
              </h2>
              <div className="text-right">
                <span className="badge badge-secondary mr-1">Fecha:</span>
                <span className="badge badge-warning">{this.state.fecha}</span>
                <span className="badge badge-secondary mr-1">Total:</span>
                <span className="badge badge-warning">$ {this.numberWithCommas(this.state.ingresosTotal)}</span>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Unidad de Negocio</th>
                    <th>Cuenta Contable</th>
                    <th>Subcuenta Contable</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                    <th>Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.ingresos.map((element, i) => (
                    <tr key={i}>
                      <td>{element.FolioId}</td>
                      <td>{element.UnidadDeNegocioNombre}</td>
                      <td>{element.CuentaContable}</td>
                      <td>{element.SubcuentaContable}</td>
                      <td>{element.Fecha.substr(0,10)}</td>
                      <td className="text-right">$ {this.numberWithCommas(element.Monto)}</td>
                      <td><button onClick={()=>alert("Proceso de Borrar en Construccion...")}className="btn btn-danger btn-sm">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      // </React.Fragment>
    );
  }

  render() {
    return(
      <React.Fragment>
        {this.state.periodoabierto!=="" ? <this.handleRender /> : <h3>Loading...</h3>}
      </React.Fragment>
    )
  }
}

export default Ingresos;
