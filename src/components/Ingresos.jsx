import React, { Component } from "react";

import "./Ingresos.css";

class Ingresos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      //count: 0,
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
      periodoabierto:""
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
    this.monto = React.createRef();

    const dataSucursales2 = await this.getSucursales();
    const dataSucursales = dataSucursales2.filter(
      (element) => element.TipoSucursal != "P"
    );
    if (dataSucursales.error) {
      alert(dataSucursales.error);
      return;
    }
    const vsucursalnombre = dataSucursales[0].SucursalNombre

    // const dataUnidadesNegocio = await this.getUnidadesNegocio(
    //   dataSucursales[0].SucursalId
    // );
    // if (dataUnidadesNegocio.error) {
    //   alert(dataUnidadesNegocio.error);
    //   return;
    // }

    const dataUnidadesNegocioCatalogo = await this.getUnidadesNegocioCatalogo();
    if (dataUnidadesNegocioCatalogo.error){
      alert(dataUnidadesNegocioCatalogo.error)
      return;
    }
    const dataUnidadesNegocio = dataUnidadesNegocioCatalogo.filter(element => element.SucursalId === dataSucursales[0].SucursalId)

    // const dataCuentasContables = await this.getCuentasContables(
    //   dataSucursales[0].SucursalId,
    //   dataUnidadesNegocio[0].UnidadDeNegocioId
    // );
    // if (dataCuentasContables.error) {
    //   alert(dataCuentasContables.error);
    //   return;
    // }

    const dataCuentasContablesCatalogo = await this.getCuentasContablesCatalogo();
    if (dataCuentasContablesCatalogo.error) {
      alert(dataCuentasContablesCatalogo.error);
      return;
    }
    const dataCuentasContables = dataCuentasContablesCatalogo.filter(element => element.SucursalId === dataSucursales[0].SucursalId && element.UnidadDeNegocioId === dataUnidadesNegocio[0].UnidadDeNegocioId)


    // const dataSubcuentasContables = await this.getSubcuentasContables(
    //   dataSucursales[0].SucursalId,
    //   dataUnidadesNegocio[0].UnidadDeNegocioId,
    //   dataCuentasContables[0].CuentaContableId
    // );
    // if (dataSubcuentasContables.error) {
    //   alert(dataSubcuentasContables.error);
    //   return;
    // }

    const dataSubcuentasContablesCatalogo = await this.getSubcuentasContablesCatalogo()
    if (dataSubcuentasContablesCatalogo.error) {
      alert(dataSubcuentasContablesCatalogo.error);
      return;
    }
    const dataSubcuentasContables = dataSubcuentasContablesCatalogo.filter( element => element.SucursalId === dataSucursales[0].SucursalId && element.UnidadDeNegocioId === dataUnidadesNegocio[0].UnidadDeNegocioId && element.CuentaContableId === dataCuentasContables[0].CuentaContableId )

    const dataGetIngresosCadena = await this.getIngresos(
      this.fechaActual()
    );
    if (dataGetIngresosCadena.error) {
      alert(dataGetIngresosCadena.error);
      return;
    }
    const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === dataSucursales[0].SucursalId)
    let vtotal=parseFloat(0.0)
    dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))

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
      periodoabierto:dataPeriodoAbierto.rows[0].Periodo
    });

    try {
      this.monto.current.focus();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }

  }

  async getSucursales() {
    const url = `http://decorafiestas.com:3001/ingresos/sucursales`;
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

  // async getUnidadesNegocio(vsucursal) {
  //   const url = `http://decorafiestas.com:3001/ingresos/unidadesdenegocio/${vsucursal}`;
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${this.props.accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.log(error.message);
  //     alert(error.message);
  //   }
  // }

  
  async getUnidadesNegocioCatalogo(){
    const url = `http://decorafiestas.com:3001/ingresos/unidadesdenegociocatalogo`;
    try{
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      return data;
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }
  }

  // async getCuentasContables(vsucursal, vunidadnegocio) {
  //   const url = `http://decorafiestas.com:3001/ingresos/cuentascontables/${vsucursal}/${vunidadnegocio}`;
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${this.props.accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.log(error.message);
  //     alert(error.message);
  //   }
  // }

  async getCuentasContablesCatalogo() {
    const url = `http://decorafiestas.com:3001/ingresos/cuentascontablescatalogo`;
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

  // async getSubcuentasContables(vsucursal, vunidadnegocio, vcuentacontable) {
  //   const url = `http://decorafiestas.com:3001/ingresos/subcuentascontables/${vsucursal}/${vunidadnegocio}/${vcuentacontable}`;
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${this.props.accessToken}`,
  //       },
  //     });
  //     const data = await response.json();
  //     return data;
  //   } catch (error) {
  //     console.log(error.message);
  //     alert(error.message);
  //   }
  // }

  async getSubcuentasContablesCatalogo() {
    const url = `http://decorafiestas.com:3001/ingresos/subcuentascontablescatalogo`;
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

  async getIngresos(vfecha) {
    const url = `http://decorafiestas.com:3001/ingresos/getingresos/${vfecha}`;
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
      const dataGetIngresosCadena = await this.getIngresos(
        // event.target.value
        vfecha
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }
      // const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === dataSucursales[0].SucursalId)
      const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal))
      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))
  
  
      this.setState({
        fecha: vfecha,
        ingresosCadena: dataGetIngresosCadena,
        ingresos: dataGetIngresos,
        ingresosTotal: vtotal
      });
  }

  HandleSucursales(event) {
    // this.setState({ selectedValueSucursal: event.target.value }, async () => {
    //   const dataUnidadesNegocio = await this.getUnidadesNegocio(
    //     this.state.selectedValueSucursal
    //   );
    let vsucursalnombre="";
    const datasucursales = this.state.sucursales
    datasucursales.map(element => {
      if(element.SucursalId === parseInt(event.target.value)){
        vsucursalnombre = element.SucursalNombre
      }
    })

    this.setState({ selectedValueSucursal: event.target.value,
                    sucursalnombre: vsucursalnombre }, async () => {
        const dataUnidadesNegocio = this.state.unidadesdenegociocatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal))
  

      // const dataCuentasContables = await this.getCuentasContables(
      //   this.state.selectedValueSucursal,
      //   dataUnidadesNegocio[0].UnidadDeNegocioId
      // );

      const dataCuentasContables = this.state.cuentascontablescatalogo.filter(element => parseInt(element.SucursalId) ===  parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) )
      
      // const dataSubcuentasContables = await this.getSubcuentasContables(
        //   this.state.selectedValueSucursal,
        //   dataUnidadesNegocio[0].UnidadDeNegocioId,
        //   dataCuentasContables[0].CuentaContableId
        // );
        const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) ===  parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) && parseInt(element.CuentaContableId) === parseInt(dataCuentasContables[0].CuentaContableId) )

      // const dataGetIngresos = await this.getIngresos(
      //   this.state.selectedValueSucursal,
      //   this.state.fecha
      // );
      const dataGetIngresos = this.state.ingresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal))
      
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
        // const dataCuentasContables = await this.getCuentasContables(
        //   this.state.selectedValueSucursal,
        //   this.state.selectedValueUnidadDeNegocio
        // );

        const dataCuentasContables = this.state.cuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio))


        // const dataSubcuentasContables = await this.getSubcuentasContables(
        //   this.state.selectedValueSucursal,
        //   this.state.selectedValueUnidadDeNegocio,
        //   dataCuentasContables[0].CuentaContableId
        // );

        const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio) && parseInt(element.CuentaContableId) === parseInt(dataCuentasContables[0].CuentaContableId))

        this.setState({
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
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
      // async () => {
      //   const dataSubcuentasContables = await this.getSubcuentasContables(
      //     this.state.selectedValueSucursal,
      //     this.state.selectedValueUnidadDeNegocio,
      //     this.state.selectedValueCuentaContable
      //   );

      () =>{
      const dataSubcuentasContables = this.state.subcuentascontablescatalogo.filter(element => parseInt(element.SucursalId) === parseInt(this.state.selectedValueSucursal) && parseInt(element.UnidadDeNegocioId) === parseInt(this.state.selectedValueUnidadDeNegocio))

        this.setState({
          subcuentascontables: dataSubcuentasContables,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
        });
      }
    );
    this.monto.current.focus();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.selectedValueSucursal !== this.state.selectedValueSucursal) {
  //     //alert("prevState = "+prevState.selectedValueSucursal+"  this.state.selectedValueSucursal = "+this.state.selectedValueSucursal)
  //   }
  // }

  HandleSubcuentasContables(event) {
    this.setState({
      selectedValueSubcuentaContable: event.target.value,
    });
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
      Monto: this.state.monto,
      Comentarios: this.state.comentarios,
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
        this.state.fecha
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }

      const dataGetIngresos = dataGetIngresosCadena.filter(element => element.SucursalId === parseInt(this.state.selectedValueSucursal))

      let vtotal=parseFloat(0.0)
      dataGetIngresos.map(element => vtotal+= parseFloat(element.Monto))

      //####################################
      this.setState({ monto: "", 
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

//   function numberWithCommas(x) {
//     return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
// }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    // const styleForm = {
    //   backgroundColor: "lightgray",
    //   border: "5px solid gray",
    //   height: 580,
    //   padding: 10,
    //   margin: "2px",
    // };

    // const styleDisplayIngresos = {
    //   backgroundColor: "lightblue",
    //   border: "5px solid gray",
    //   height: 580,
    //   // width: "40vw",
    //   //minWidth: "400px",
    //   padding: 10,
    //   margin: 10,
    // };

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
      <React.Fragment>
        <div className="container">
          <div className="row">
            <form
              className="col-md-5 seccionIngresos"
              onSubmit={this.handleSubmit}
            >
              <h2>
                <span className="badge badge-success mb-1">Ingresos</span>
              </h2>
              <div class="text-right">
                <span className="badge badge-secondary mr-1">
                  Periodo Abierto:
                </span>
                <span className="badge badge-warning">{this.state.periodoabierto}</span>
              </div>
              <br />
              <label forhtml="fecha" style={styleLabel}>
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

              <label forhtml="sucursales" style={styleLabel}>
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
              <label forhtml="unidadesdenegocio" style={styleLabel}>
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
              <label style={styleLabel} forhtml="cuentaContable">
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
              <label forhtml="subcuentaContable" style={styleLabel}>
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

              <label forhtml="monto" style={styleLabel}>
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
                <span className="badge badge-success">Ingresos {this.state.sucursalnombre}</span>
              </h2>
              <div className="text-right">
                <span className="badge badge-secondary mr-1">Fecha:</span>
                <span className="badge badge-warning">{this.state.fecha}</span>
                <span className="badge badge-secondary mr-1">Total:</span>
                <span className="badge badge-warning">$ {this.numberWithCommas(this.state.ingresosTotal)}</span>
              </div>
              {/* <br /> */}
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
                      <td><button className="btn btn-danger btn-sm">Eliminar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Ingresos;
