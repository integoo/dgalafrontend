import React, { Component } from "react";

import "./Ingresos.css";

class Ingresos extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      Fecha: "",
      PrimerDiaMes: "",
      UltimoDiaMes: "",
      monto: "",
      ingresos: [],
      ingresosCadena: [],
      ingresosTotal: 0,
      sucursales: [],
      sucursalnombre: "",
      unidadesdenegocio: [],
      unidadesdenegociocatalogo: [],
      cuentascontables: [],
      cuentascontablescatalogo: [],
      subcuentascontables: [],
      subcuentascontablescatalogo: [],
      selectedValueSucursal: "1",
      selectedValueUnidadDeNegocio: "1",
      UnidadDeNegocio: "",
      selectedValueCuentaContable: "10000",
      selectedValueSubcuentaContable: "001",
      comentarios: "",
      periodoabierto: "",
    };

    this.handleFecha = this.handleFecha.bind(this);
    this.HandleSucursales = this.HandleSucursales.bind(this);
    this.HandleUnidadesDeNegocio = this.HandleUnidadesDeNegocio.bind(this);
    this.HandleCuentasContables = this.HandleCuentasContables.bind(this);
    this.HandleSubcuentasContables = this.HandleSubcuentasContables.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.monto = React.createRef();
  }

  fechaActual = async() => {
    // const d = new Date();
    // let vfecha =
    //   d.getFullYear() +
    //   "-" +
    //   ("0" + (d.getMonth() + 1)).slice(-2) +
    //   "-" +
    //   ("0" + d.getDate()).slice(-2);
    // return vfecha;

    let Fecha;
    
      const url = this.props.url+`/api/fechaactual`
      try{
        const response = await fetch(url,{
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
        Fecha = data[0].Fecha.substring(0,10)
        const PrimerDiaMes = data[0].PrimerDiaMes.substring(0,10) 
        const UltimoDiaMes = data[0].UltimoDiaMes.substring(0,10)
        this.setState({
          Fecha: Fecha,
          PrimerDiaMes: PrimerDiaMes,
          UltimoDiaMes: UltimoDiaMes,
        })
      }catch(error){
        console.log(error.message)
        alert(error.message)
      }
    }
    
    async componentDidMount() {
      try {

        await this.fechaActual()
        const Fecha = this.state.Fecha 
        
      const dataSucursales = await this.getSucursales();
      if (dataSucursales.error) {
        alert(dataSucursales.error);
        return;
      }
      // const dataSucursales = dataSucursales2.filter(
      //   (element) => element.TipoSucursal != "P"
      // );
      const vsucursalnombre = dataSucursales[0].SucursalNombre;

      const dataUnidadesNegocioCatalogo =
        await this.getUnidadesNegocioCatalogo();
      if (dataUnidadesNegocioCatalogo.error) {
        alert(dataUnidadesNegocioCatalogo.error);
        return;
      }
      const dataUnidadesNegocio = dataUnidadesNegocioCatalogo.filter(
        (element) => element.SucursalId === dataSucursales[0].SucursalId
      );

      const dataCuentasContablesCatalogo =
        await this.getCuentasContablesCatalogo();
      if (dataCuentasContablesCatalogo.error) {
        alert(dataCuentasContablesCatalogo.error);
        return;
      }
      const dataCuentasContables = dataCuentasContablesCatalogo.filter(
        (element) =>
          element.SucursalId === dataSucursales[0].SucursalId &&
          element.UnidadDeNegocioId ===
            dataUnidadesNegocio[0].UnidadDeNegocioId &&
          parseInt(element.NaturalezaCC) === parseInt(this.props.naturalezaCC)
      );

      const dataSubcuentasContablesCatalogo =
        await this.getSubcuentasContablesCatalogo();
      if (dataSubcuentasContablesCatalogo.error) {
        alert(dataSubcuentasContablesCatalogo.error);
        return;
      }
      const dataSubcuentasContables = dataSubcuentasContablesCatalogo.filter(
        (element) =>
          element.SucursalId === dataSucursales[0].SucursalId &&
          element.UnidadDeNegocioId ===
            dataUnidadesNegocio[0].UnidadDeNegocioId &&
          element.CuentaContableId === dataCuentasContables[0].CuentaContableId
      );

      const dataGetIngresosCadena = await this.getIngresosEgresos(
        // this.fechaActual(),dataSucursales[0].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId,
        // dataCuentasContables[0].CuentaContableId,dataSubcuentasContables[0].SubcuentaContableId
        Fecha
        //dataSucursales[0].SucursalId
      );

      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }
      const dataGetIngresos = dataGetIngresosCadena.filter(
        (element) =>
          element.SucursalId === dataSucursales[0].SucursalId &&
          element.UnidadDeNegocioId ===
            dataUnidadesNegocio[0].UnidadDeNegocioId &&
          element.CuentaContableId ===
            dataCuentasContables[0].CuentaContableId &&
          element.SubcuentaContableId ===
            dataSubcuentasContables[0].SubcuentaContableId
      );
      let vtotal = parseFloat(0.0);
      dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));
      vtotal = vtotal.toFixed(2);

      const dataPeriodoAbierto = await this.getPeriodoAbierto();
      if (dataPeriodoAbierto.error) {
        alert(dataPeriodoAbierto.error);
        return;
      }

      this.setState({
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
        UnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocio,
        selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
        selectedValueSubcuentaContable:
          dataSubcuentasContables[0].SubcuentaContableId,
        ingresos: dataGetIngresos,
        ingresosCadena: dataGetIngresosCadena,
        ingresosTotal: vtotal,
        periodoabierto: dataPeriodoAbierto.rows[0].Periodo,
        primerdiames: dataPeriodoAbierto.rows[0].PrimerDiaMes.substr(0, 10),
      });

      this.monto.current.focus();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getSucursales() {
    const naturalezaCC = this.props.naturalezaCC;
    const url = this.props.url + `/api/sucursales/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Sucursales" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getUnidadesNegocioCatalogo() {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Unidades de Negocio" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getCuentasContablesCatalogo() {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Cuentas Contables" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getSubcuentasContablesCatalogo() {
    const naturalezaCC = this.props.naturalezaCC;
    const url =
      this.props.url + `/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Subcuentas Contables" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getIngresosEgresos(vfecha) {
    const naturalezaCC = this.props.naturalezaCC
    const url = this.props.url + `/ingresos/getIngresosEgresos/${vfecha}/${naturalezaCC}`;
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

  async getPeriodoAbierto() {
    const url = this.props.url + `/periodoabierto`;
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

  async handleFecha(event) {
    const vfecha = event.target.value;
    try {
      const dataGetIngresosCadena = await this.getIngresosEgresos(
        // event.target.value
        // vfecha,this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,
        // this.state.selectedValueCuentaContable, this.state.selectedValueSubcuentaContable
        vfecha
        //this.state.selectedValueSucursal
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }

      const dataGetIngresos = dataGetIngresosCadena.filter(
        (element) =>
          element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
          element.UnidadDeNegocioId ===
            parseInt(this.state.selectedValueUnidadDeNegocio) &&
          element.CuentaContableId ===
            parseInt(this.state.selectedValueCuentaContable) &&
          element.SubcuentaContableId ===
            this.state.selectedValueSubcuentaContable
      );
      let vtotal = parseFloat(0.0);
      dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));

      this.setState({
        Fecha: vfecha,
        ingresosCadena: dataGetIngresosCadena,
        ingresos: dataGetIngresos,
        ingresosTotal: vtotal,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  HandleSucursales(event) {
    let vsucursalnombre = "";
    const SucursalId = event.target.value
    // const Fecha = this.state.Fecha
    const datasucursales = this.state.sucursales;
    datasucursales.map((element) => {
      if (element.SucursalId === parseInt(event.target.value)) {
        vsucursalnombre = element.SucursalNombre;
      }
      return null;
    });
    this.setState(
      {
        // selectedValueSucursal: event.target.value,
        selectedValueSucursal: SucursalId,
        sucursalnombre: vsucursalnombre,
      },
      async () => {
        const dataUnidadesNegocio = this.state.unidadesdenegociocatalogo.filter(
          (element) =>
            parseInt(element.SucursalId) ===
            parseInt(this.state.selectedValueSucursal)
        );

        const dataCuentasContables = this.state.cuentascontablescatalogo.filter(
          (element) =>
            parseInt(element.SucursalId) ===
              parseInt(this.state.selectedValueSucursal) &&
            parseInt(element.UnidadDeNegocioId) ===
              parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) &&
            element.NaturalezaCC.toString() ===
              this.props.naturalezaCC.toString()
        );

        const dataSubcuentasContables =
          this.state.subcuentascontablescatalogo.filter(
            (element) =>
              parseInt(element.SucursalId) ===
                parseInt(this.state.selectedValueSucursal) &&
              parseInt(element.UnidadDeNegocioId) ===
                parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) &&
              parseInt(element.CuentaContableId) ===
                parseInt(dataCuentasContables[0].CuentaContableId)
          );

        const dataGetIngresos = this.state.ingresosCadena.filter(
        //const dataGetIngresos = dataGetIngresosCadena.filter(
          (element) =>
            element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
            element.UnidadDeNegocioId ===
              parseInt(dataUnidadesNegocio[0].UnidadDeNegocioId) &&
            element.CuentaContableId ===
              parseInt(dataCuentasContables[0].CuentaContableId) &&
            element.SubcuentaContableId ===
              dataSubcuentasContables[0].SubcuentaContableId
        );
        let vtotal = parseFloat(0.0);
        dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));

        this.setState({
          unidadesdenegocio: dataUnidadesNegocio,
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          selectedValueUnidadDeNegocio:
            dataUnidadesNegocio[0].UnidadDeNegocioId,
          UnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocio,
          selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
          ingresos: dataGetIngresos,
          ingresosTotal: vtotal,
        });
      }
    );
    this.monto.current.focus();
  }

  HandleUnidadesDeNegocio(event) {
    const UnidadDeNegocioId = event.target.value
    const UnidadDeNegocio = this.state.unidadesdenegocio.find(element => element.UnidadDeNegocioId === parseInt(UnidadDeNegocioId)).UnidadDeNegocio
    this.setState(
      {
        selectedValueUnidadDeNegocio: event.target.value,
        UnidadDeNegocio: UnidadDeNegocio,
      },
      () => {
        const dataCuentasContables = this.state.cuentascontablescatalogo.filter(
          (element) =>
            parseInt(element.SucursalId) ===
              parseInt(this.state.selectedValueSucursal) &&
            parseInt(element.UnidadDeNegocioId) ===
              parseInt(this.state.selectedValueUnidadDeNegocio)
        );

        const dataSubcuentasContables =
          this.state.subcuentascontablescatalogo.filter(
            (element) =>
              parseInt(element.SucursalId) ===
                parseInt(this.state.selectedValueSucursal) &&
              parseInt(element.UnidadDeNegocioId) ===
                parseInt(this.state.selectedValueUnidadDeNegocio) &&
              parseInt(element.CuentaContableId) ===
                parseInt(dataCuentasContables[0].CuentaContableId)
          );

        const dataGetIngresos = this.state.ingresosCadena.filter(
          (element) =>
            element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
            element.UnidadDeNegocioId ===
              parseInt(this.state.selectedValueUnidadDeNegocio) &&
            element.CuentaContableId ===
              parseInt(this.state.selectedValueCuentaContable) &&
            element.SubcuentaContableId ===
              this.state.selectedValueSubcuentaContable
        );
        let vtotal = parseFloat(0.0);
        dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));

        this.setState({
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
          ingresos: dataGetIngresos,
          ingresosTotal: vtotal,
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

      () => {
        const dataSubcuentasContables =
          this.state.subcuentascontablescatalogo.filter(
            (element) =>
              parseInt(element.SucursalId) ===
                parseInt(this.state.selectedValueSucursal) &&
              parseInt(element.UnidadDeNegocioId) ===
                parseInt(this.state.selectedValueUnidadDeNegocio) &&
              parseInt(element.CuentaContableId) ===
                parseInt(this.state.selectedValueCuentaContable)
          );

        const dataGetIngresos = this.state.ingresosCadena.filter(
          (element) =>
            element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
            element.UnidadDeNegocioId ===
              parseInt(this.state.selectedValueUnidadDeNegocio) &&
            element.CuentaContableId ===
              parseInt(this.state.selectedValueCuentaContable) &&
            element.SubcuentaContableId ===
              this.state.selectedValueSubcuentaContable
        );
        let vtotal = parseFloat(0.0);
        dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));

        this.setState({
          subcuentascontables: dataSubcuentasContables,
          selectedValueSubcuentaContable:
            dataSubcuentasContables[0].SubcuentaContableId,
          ingresos: dataGetIngresos,
          ingresosTotal: vtotal,
        });
      }
    );
    this.monto.current.focus();
  }

  HandleSubcuentasContables(event) {
    this.setState(
      {
        selectedValueSubcuentaContable: event.target.value,
      },
      () => {
        const dataGetIngresos = this.state.ingresosCadena.filter(
          (element) =>
            element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
            element.UnidadDeNegocioId ===
              parseInt(this.state.selectedValueUnidadDeNegocio) &&
            element.CuentaContableId ===
              parseInt(this.state.selectedValueCuentaContable) &&
            element.SubcuentaContableId ===
              this.state.selectedValueSubcuentaContable
        );
        let vtotal = parseFloat(0.0);
        dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));

        this.setState({
          ingresos: dataGetIngresos,
          ingresosTotal: vtotal,
        });
      }
    );
    this.monto.current.focus();
  }

  handleChange = (event) => {
    // let { value, min, max, step } = event.target;
    let { value } = event.target;
    value = value.toString().replace(",", "");

    if (value[0] === " ") {
      return;
    }

    let numbers = /^[0-9 .]+$/;
    if (value.match(numbers) || value === "") {
      this.setState({ monto: value });
    }
  };

  handleComentarios = (event) => {
    let { value } = event.target;
    this.setState({ comentarios: value });
  };

  handleValidaMovimiento = async ( //Valida si existe otro movimiento igual en esa fecha
    SucursalId,
    UnidadDeNegocioId,
    CuentaContableId,
    SubcuentaContableId,
    Fecha
  ) => {
    const url =
      this.props.url +
      `/api/validamovimientoingresosegresos/${SucursalId}/${UnidadDeNegocioId}/${CuentaContableId}/${SubcuentaContableId}/${Fecha}`;
    let data;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();
    } catch (error) {
      console.log(error.message);
      data = { error: error.message };
      alert(error.message);
    }
    return data;
  };

  async handleSubmit(event) {
    event.preventDefault();
    const SucursalId = this.state.selectedValueSucursal;
    const UnidadDeNegocioId = this.state.selectedValueUnidadDeNegocio;
    const CuentaContableId = this.state.selectedValueCuentaContable;
    const SubcuentaContableId = this.state.selectedValueSubcuentaContable;
    const Fecha = this.state.Fecha;
    let data = [];

    const d1 = new Date(this.state.Fecha);
    const d2 = new Date(this.state.primerdiames);
    const d3 = new Date(this.state.UltimoDiaMes)
    if (d1 < d2 || d1 > d3) {
      alert(
        "ERROR : La Fecha debe ser mayor o igual que " + this.state.PrimerDiaMes + " y menor o igual a "+ this.state.UltimoDiaMes
      );
      return;
    }
    //### Validar si existe un movimiento Sucursal,UnidadesDeNegocio,Cuenta y Subcuenta Contable Igual###
    data = await this.handleValidaMovimiento(
      SucursalId,
      UnidadDeNegocioId,
      CuentaContableId,
      SubcuentaContableId,
      Fecha
    );
    if (data.error) {
      console.log(data.error);
      alert(data.error);
      return;
    }
    if (data[0].cuantos > 0) {
      if (
        !window.confirm(
          "Ya existe(n) " +
            data[0].cuantos +
            " Movimiento(s) para la Sucursal, UnidadDeNegocio, Cuenta, Subcuenta Contable y Fecha. ¿Desea Continuar?"
        )
      ) {
        return;
      }
    }

    //###################################################################################################
    let json = {
      SucursalId: SucursalId,
      UnidadDeNegocioId: UnidadDeNegocioId,
      CuentaContableId: CuentaContableId,
      SubcuentaContableId: SubcuentaContableId,
      Fecha: Fecha,
      Monto: this.state.monto * parseInt(this.props.naturalezaCC),
      Comentarios: this.state.comentarios,
      Usuario: sessionStorage.getItem("user"),
    };

    try {
      const url = this.props.url + `/ingresos/grabaingresos`;
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json), //JSON.stringify(data)
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      //const data = await response.json()
      data = await response.text();

      //####### Actualiza Ingresos Egresos #########
      const dataGetIngresosCadena = await this.getIngresosEgresos(
        //this.state.selectedValueSucursal,
        // this.state.fecha, this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,
        // this.state.selectedValueCuentaContable,this.state.selectedValueSubcuentaContable
        this.state.Fecha
        //this.state.selectedValueSucursal
      );
      if (dataGetIngresosCadena.error) {
        alert(dataGetIngresosCadena.error);
        return;
      }

      const dataGetIngresos = dataGetIngresosCadena.filter(
        (element) =>
          element.SucursalId === parseInt(this.state.selectedValueSucursal) &&
          element.UnidadDeNegocioId ===
            parseInt(this.state.selectedValueUnidadDeNegocio) &&
          element.CuentaContableId ===
            parseInt(this.state.selectedValueCuentaContable) &&
          element.SubcuentaContableId ===
            this.state.selectedValueSubcuentaContable
      );
      let vtotal = parseFloat(0.0);
      dataGetIngresos.map((element) => (vtotal += parseFloat(element.Monto)));
      vtotal = vtotal.toFixed(2);

      //####################################
      this.setState({
        monto: "",
        comentarios: "",
        ingresosCadena: dataGetIngresosCadena,
        ingresos: dataGetIngresos,
        ingresosTotal: vtotal,
      });
      this.monto.current.focus();
      alert(data);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  // deleteItem(event) {
  //   alert(event.target.value);
  //   alert(event.target.name);
  //   alert("Si borra");
  //   //alert(event.target.value)
  //   console.log(event);
  // }

  handleEliminar(e){
    alert(e.target.id)
  }

  onhandleClear = () => {
    this.setState({
      monto: "",
    });
    this.monto.current.focus();
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleRender = () => {
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
      width: 130,
    };

    return (
      // <React.Fragment>
      <div className="container">
        <div className="row">
          <form className="col-md-6" onSubmit={this.handleSubmit}>
            <h2>
              {this.props.naturalezaCC === "1" ? (
                <span className="badge badge-success mb-1">Ingresos</span>
              ) : (
                <span className="badge badge-danger mb-1">Egresos</span>
              )}
            </h2>
            <div className="seccionIngresos">
              <div className="text-right">
                <span className="badge badge-secondary mr-1">
                  Periodo Abierto:
                </span>
                <span className="badge badge-warning">
                  {this.state.periodoabierto}
                </span>
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
                value={this.state.Fecha}
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
                //type="numeric"
                step="0.01"
                placeholder="Monto $$$"
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
                value={this.numberWithCommas(this.state.monto)}
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
                  className="btn btn-primary btn-lg btn-block"
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="btn btn-danger btn-lg btn-block"
                  type="reset"
                  onClick={this.onhandleClear}
                >
                  Clear
                </button>

            </div>
          </form>

          <div className="col-md-6">
              {this.props.naturalezaCC === "1" ? (
                <div style={{marginTop:"5px",marginBottom:"10px"}}>
                <span className="badge badge-success">
                  <h5>
                  Ingresos {this.state.sucursalnombre} 
                  </h5>
                </span>
                <span className="badge badge-primary" style={{marginLeft:"10px"}}><h6>{this.state.UnidadDeNegocio}</h6></span>
                </div>
              ) : (
                <div style={{marginTop:"5px",marginBottom:"10px"}}>
                <span className="badge badge-danger">
                  <h5>
                  Egresos {this.state.sucursalnombre}
                  </h5>
                </span>
                  <span className="badge badge-primary" style={{marginLeft:"10px"}}><h6>{this.state.UnidadDeNegocio}</h6></span>
                </div>
              )}
            <div className="seccionDespliegaIngresos">
            <div className="text-right">
              <span className="badge badge-secondary mr-1">Fecha:</span>
              <span className="badge badge-warning">{this.state.Fecha}</span>
              <span className="badge badge-secondary mr-1">Total:</span>
              <span className="badge badge-warning">
                $ {this.numberWithCommas(this.state.ingresosTotal)}
              </span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Folio</th>
                  {/* <th>Unidad de Negocio</th> */}
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
                    {/* <td>{element.UnidadDeNegocioNombre}</td> */}
                    <td>{element.CuentaContable}</td>
                    <td>{element.SubcuentaContable}</td>
                    <td>{element.Fecha.substr(0, 10)}</td>
                    <td className="text-right">
                      $ {this.numberWithCommas(element.Monto)}
                    </td>
                    <td>
                      <button
                        onClick={this.handleEliminar}
                        id={element.FolioId}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            </div>
          </div>
        </div>
      </div>
      // </React.Fragment>
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.periodoabierto !== "" ? (
          <this.handleRender />
        ) : (
          <h3>Loading...</h3>
        )}
      </React.Fragment>
    );
  }
}

export default Ingresos;
