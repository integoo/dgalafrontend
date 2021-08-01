import React, { Component } from "react";

import "./Egresos.css";

class Egresos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      NaturalezaCC: this.props.naturalezaCC,
      Fecha: "",
      Periodo: "",
      PeriodoAbierto: "",
      PeriodoAbiertoPrimerDia: "",
      PeriodoAbiertoUltimoDia: "",

      Monto: "",
      egresosCadenaMes: [],
      TotalEgresosMes: 0,
      TotalEgresosDia: 0,

      sucursales: [],
      Sucursal: "",
      unidadesdenegocio: [],
      unidadesdenegociocatalogo: [],
      cuentascontables: [],
      cuentascontablescatalogo: [],
      subcuentascontables: [],
      subcuentascontablescatalogo: [],
      SucursalId: "",
      UnidadDeNegocioId: "",
      UnidadDeNegocio: "",
      CuentaContableId: "",
      CuentaContable: "",
      SubcuentaContableId: "",
      SubcuentaContable: "",
      comentarios: "",
      disabledMonto: false,
      showSeccionEgresos: true,
      disableBontonModifica: true,

      FechaModifica: "",
      SucursalIdModifica: "",
      SucursalModifica: "",
      UnidadDeNegocioIdModifica: "",
      UnidadDeNegocioModifica: "",
      CuentaContableIdModifica: "",
      CuentaContableModifica: "",
      SubcuentaContableIdModifica: "",
      SubcuentaContableModifica: "",
      FolioIdModifica: "",
      MontoModifica: "",
      ComentariosModifica: "",

    };

    this.monto = React.createRef();
  }

  async componentDidMount() {
    await this.fechaActual();
    await this.getSucursales();
    await this.getUnidadesNegocioCatalogo();
    await this.getCuentasContablesCatalogo();
    await this.getSubcuentasContablesCatalogo();
    await this.getPeriodoAbierto();

    const Fecha = this.state.Fecha;
    const Periodo = Fecha.substring(0, 4) + Fecha.substring(5, 7);
    const accesoDB = "mes";
    const NaturalezaCC = this.state.NaturalezaCC;

    const SucursalId = this.state.SucursalId;

    
    const dataUnidadesNegocio = this.sincronizaUnidadesDeNegocio(SucursalId);
    const UnidadDeNegocioId = dataUnidadesNegocio[0].UnidadDeNegocioId;
    
    this.getEgresos(Fecha, accesoDB, SucursalId,UnidadDeNegocioId);

    const dataCuentasContables = this.sincronizaCuentasContables(
      SucursalId,
      UnidadDeNegocioId,
      NaturalezaCC
    );
    const CuentaContableId = dataCuentasContables[0].CuentaContableId;

    const dataSubcuentasContables = this.sincronizaSubcuentasContables(
      SucursalId,
      UnidadDeNegocioId,
      CuentaContableId
    );

    this.setState({
      Periodo: Periodo,
      unidadesdenegocio: dataUnidadesNegocio,
      cuentascontables: dataCuentasContables,
      subcuentascontables: dataSubcuentasContables,
    });
    this.monto.current.focus();
  }

  sincronizaUnidadesDeNegocio = (SucursalId) => {
    const dataUnidadesNegocio = this.state.unidadesdenegociocatalogo.filter(
      (element) => element.SucursalId === SucursalId
    );
    return dataUnidadesNegocio;
  };

  sincronizaCuentasContables = (
    SucursalId,
    UnidadDeNegocioId,
    NaturalezaCC
  ) => {
    const dataCuentasContables = this.state.cuentascontablescatalogo.filter(
      (element) =>
        element.SucursalId === SucursalId &&
        element.UnidadDeNegocioId === UnidadDeNegocioId &&
        parseInt(element.NaturalezaCC) === parseInt(NaturalezaCC)
    );
    return dataCuentasContables;
  };

  sincronizaSubcuentasContables = (
    SucursalId,
    UnidadDeNegocioId,
    CuentaContableId
  ) => {
    const dataSubcuentasContables =
      this.state.subcuentascontablescatalogo.filter(
        (element) =>
          element.SucursalId === SucursalId &&
          element.UnidadDeNegocioId === UnidadDeNegocioId &&
          element.CuentaContableId === CuentaContableId
      );
    return dataSubcuentasContables;
  };

  sincronizaEgresos = (SucursalId, UnidadDeNegocioId) => {
    const dataGetEgresos = this.state.egresosCadenaMes.filter(
      (element) =>
        element.SucursalId === SucursalId &&
        element.UnidadDeNegocioId === UnidadDeNegocioId
    );
    return dataGetEgresos;
  };

  fechaActual = async () => {
    let Fecha;
    const url = this.props.url + `/api/fechaactual`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }
      Fecha = data[0].Fecha.substring(0, 10);
      this.setState({
        Fecha: Fecha,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getPeriodoAbierto = async () => {
    const url = this.props.url + `/periodoabierto`;
    let Fecha = this.state.Fecha
    let PeriodoAbierto;
    let PeriodoAbiertoPrimerDia;
    let PeriodoAbiertoUltimoDia;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
        return;
      }
      PeriodoAbierto = data.rows[0].Periodo;
      PeriodoAbiertoPrimerDia = data.rows[0].PrimerDiaMes.substring(0, 10);
      PeriodoAbiertoUltimoDia = data.rows[0].UltimoDiaMes.substring(0, 10);

      if(Fecha > PeriodoAbiertoUltimoDia){
        Fecha = PeriodoAbiertoUltimoDia
      }
      this.setState({
        PeriodoAbierto: PeriodoAbierto,
        PeriodoAbiertoPrimerDia: PeriodoAbiertoPrimerDia,
        PeriodoAbiertoUltimoDia: PeriodoAbiertoUltimoDia,
        Fecha: Fecha,
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
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Sucursales" };
        return;
      }
      this.setState({
        sucursales: data,
        SucursalId: data[0].SucursalId,
        Sucursal: data[0].Sucursal,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getUnidadesNegocioCatalogo = async () => {
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
        return;
      }
      this.setState({
        unidadesdenegociocatalogo: data,
        UnidadDeNegocioId: data[0].UnidadDeNegocioId,
        UnidadDeNegocio: data[0].UnidadDeNegocio,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getCuentasContablesCatalogo = async () => {
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
        return;
      }
      this.setState({
        cuentascontablescatalogo: data,
        CuentaContableId: data[0].CuentaContableId,
        CuentaContable: data[0].CuentaContable,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getSubcuentasContablesCatalogo = async () => {
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
        return;
      }
      this.setState({
        subcuentascontablescatalogo: data,
        SubcuentaContableId: data[0].SubcuentaContableId,
        SubcuentaContable: data[0].SubcuentaContable,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  getEgresos = async (vfecha, accesoDB, SucursalId,UnidadDeNegocioId) => {
    const naturalezaCC = this.props.naturalezaCC;
    let dataGetEgresosCadena = this.state.egresosCadenaMes;

    let data = [];

    if (accesoDB === "mes" || accesoDB === "dia") {
      const url =
        this.props.url +
        `/ingresos/getIngresosEgresos/${vfecha}/${naturalezaCC}/${accesoDB}`;
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
          },
        });
        data = await response.json();
        if (data.error) {
          alert(data.error);
          return;
        }
        if (accesoDB === "dia") {
          dataGetEgresosCadena = dataGetEgresosCadena.filter(
            (element) => element.Fecha !== vfecha
          );
          data.map((element) => dataGetEgresosCadena.push(element));
          data = dataGetEgresosCadena;
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
    } else {
      data = dataGetEgresosCadena;
    }

    let TotalEgresosDia = 0;
    let TotalEgresosMes = 0;
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].Fecha === vfecha &&
        data[i].SucursalId === parseInt(SucursalId) &&
        parseInt(data[i].UnidadDeNegocioId) ===
          parseInt(UnidadDeNegocioId)
      ) {
        TotalEgresosDia += parseFloat(data[i].Monto);
      }
      if (
        data[i].SucursalId === parseInt(SucursalId) &&
        parseInt(data[i].UnidadDeNegocioId) ===
          parseInt(UnidadDeNegocioId)
      ) {
        TotalEgresosMes += parseFloat(data[i].Monto);
      }
    }
    if (accesoDB === "mes" || accesoDB === "dia") {
      this.setState({
        egresosCadenaMes: data,
        TotalEgresosDia: TotalEgresosDia,
        TotalEgresosMes: TotalEgresosMes,
      });
    } else {
      this.setState({
        TotalEgresosDia: TotalEgresosDia,
        TotalEgresosMes: TotalEgresosMes,
      });
    }
  };

  handleFecha = async (event) => {
    const vfecha = event.target.value;
    const Periodo = vfecha.substring(0, 4) + vfecha.substring(5, 7);
    const FechaActual = this.state.Fecha;
    const SucursalId = this.state.SucursalId 
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId

    try {
      const mesActual = FechaActual.substring(5, 7);
      const mesNuevo = vfecha.substring(5, 7);

      let accesoDB = "mes";
      if (mesActual === mesNuevo) {
        accesoDB = "NO";
      }
      await this.getEgresos(vfecha, accesoDB, SucursalId, UnidadDeNegocioId);

      const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
      let disabledMonto = false;
      if (vfecha < PeriodoAbiertoPrimerDia) {
        disabledMonto = true;
      }
      this.setState({
        Fecha: vfecha,
        Periodo: Periodo,
        disabledMonto: disabledMonto,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  HandleSucursales = (event) => {
    const SucursalId = parseInt(event.target.value);
    const datasucursales = this.state.sucursales;
    const NaturalezaCC = this.state.NaturalezaCC;
    const Fecha = this.state.Fecha;

    let vSucursal = "";
    datasucursales.map((element) => {
      if (element.SucursalId === parseInt(event.target.value)) {
        vSucursal = element.Sucursal;
      }
      return null;
    });

    const dataUnidadesNegocio = this.sincronizaUnidadesDeNegocio(SucursalId);
    const UnidadDeNegocioId = dataUnidadesNegocio[0].UnidadDeNegocioId;

    const dataCuentasContables = this.sincronizaCuentasContables(
      SucursalId,
      UnidadDeNegocioId,
      NaturalezaCC
    );
    const CuentaContableId = dataCuentasContables[0].CuentaContableId;

    const dataSubcuentasContables = this.sincronizaSubcuentasContables(
      SucursalId,
      UnidadDeNegocioId,
      CuentaContableId
    );

    const SubcuentaContableId = dataSubcuentasContables[0].SubcuentaContableId;

    const accesoDB = 'NO'
    this.getEgresos(Fecha,accesoDB,SucursalId,UnidadDeNegocioId)

    this.setState({
      SucursalId: SucursalId,
      Sucursal: vSucursal,
      unidadesdenegocio: dataUnidadesNegocio,
      cuentascontables: dataCuentasContables,
      subcuentascontables: dataSubcuentasContables,
      UnidadDeNegocioId: UnidadDeNegocioId,
      UnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocio,
      CuentaContableId: CuentaContableId,
      SubcuentaContableId: SubcuentaContableId,
    });
    this.monto.current.focus();
  };

  HandleUnidadesDeNegocio = (event) => {
    const UnidadDeNegocioId = parseInt(event.target.value)
    const SucursalId = this.state.SucursalId
    const NaturalezaCC = this.state.NaturalezaCC
    const Fecha = this.state.Fecha

    const UnidadDeNegocio = this.state.unidadesdenegocio.find(
      (element) => element.UnidadDeNegocioId === UnidadDeNegocioId
    ).UnidadDeNegocio;

        const dataCuentasContables = this.sincronizaCuentasContables(
          SucursalId,
          UnidadDeNegocioId,
          NaturalezaCC
        );
        const CuentaContableId = dataCuentasContables[0].CuentaContableId;
    
        const dataSubcuentasContables = this.sincronizaSubcuentasContables(
          SucursalId,
          UnidadDeNegocioId,
          CuentaContableId
        );
    
        const SubcuentaContableId = dataSubcuentasContables[0].SubcuentaContableId;
    
        const accesoDB = 'NO'
        this.getEgresos(Fecha,accesoDB,SucursalId,UnidadDeNegocioId)
    
        this.setState({
          UnidadDeNegocioId: UnidadDeNegocioId,
          UnidadDeNegocio: UnidadDeNegocio,
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          CuentaContableId: CuentaContableId,
          SubcuentaContableId: SubcuentaContableId,
        });
    this.monto.current.focus();
  };

  HandleCuentasContables = (event) => {
    const CuentaContableId = parseInt(event.target.value)
    const cuentascontablescatalogo = this.state.cuentascontablescatalogo
    const CuentaContable = cuentascontablescatalogo.find(element => element.CuentaContableId === CuentaContableId).CuentaContable
    const SucursalId = this.state.SucursalId 
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId

    const dataSubcuentasContables = this.sincronizaSubcuentasContables(
          SucursalId,
          UnidadDeNegocioId,
          CuentaContableId
        );
    
    const SubcuentaContableId = dataSubcuentasContables[0].SubcuentaContableId;
    
    // const accesoDB = 'NO'
    // this.getEgresos(Fecha,accesoDB,SucursalId,UnidadDeNegocioId)

    this.setState({
          CuentaContableId: CuentaContableId,
          CuentaContable: CuentaContable,
          subcuentascontables: dataSubcuentasContables,
          SubcuentaContableId: SubcuentaContableId,
        });
    this.monto.current.focus();
  };

  HandleSubcuentasContables = (event) => {
    const SubcuentaContableId = event.target.value
    const subcuentascontablescatalogo = this.state.subcuentascontablescatalogo
    const SubcuentaContable = subcuentascontablescatalogo.find(element => element.SubcuentaContableId === SubcuentaContableId).SubcuentaContable

     // const accesoDB = 'NO'
    // this.getEgresos(Fecha,accesoDB,SucursalId,UnidadDeNegocioId)

    this.setState({
      SubcuentaContableId: SubcuentaContableId,
      SubcuentaContable: SubcuentaContable,
    });
    this.monto.current.focus();
  };

  handleChange = (event) => {
    // let { value, min, max, step } = event.target;
    let { value } = event.target;
    value = value.toString().replace(",", "");

    if (value[0] === " ") {
      return;
    }

    let numbers = /^[0-9 .]+$/;
    if (value.match(numbers) || value === "") {
      this.setState({ Monto: value });
    }
  };

  handleComentarios = (event) => {
    let { value } = event.target;
    this.setState({ comentarios: value });
  };

  handleValidaMovimiento = async (
    //Valida si existe otro movimiento igual en esa fecha
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

  handleSubmit = async (event) => {
    event.preventDefault();
    const SucursalId = this.state.SucursalId;
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId;
    const CuentaContableId = this.state.CuentaContableId;
    const SubcuentaContableId = this.state.SubcuentaContableId;
    const Fecha = this.state.Fecha;
    const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
    let data = [];

    if (Fecha < PeriodoAbiertoPrimerDia) {
      alert(
        "ERROR : La Fecha debe ser mayor o igual que " + PeriodoAbiertoPrimerDia
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
      Monto: this.state.Monto * parseInt(this.props.naturalezaCC),
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
      data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }

      //####### Actualiza Ingresos Egresos #########
      const accesoDB = "dia";
      await this.getEgresos(this.state.Fecha, accesoDB, SucursalId, UnidadDeNegocioId);

      //####################################
      this.setState({
        Monto: "",
        comentarios: "",
      });
      alert(JSON.stringify(data));
      this.monto.current.focus();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  handleMontoModifica = (e) =>{
    const MontoModifica = e.target.value 
    if(MontoModifica > 0){
      return
    }
    this.setState({
      MontoModifica: MontoModifica,
      disableBontonModifica: false,
    })
  }

  handleComentariosModifica = (e) =>{
    const ComentariosModifica = e.target.value.toUpperCase() 
    this.setState({
      ComentariosModifica: ComentariosModifica,
      disableBontonModifica: false,
    })
  }

  handleActualizarMontoComentarios = async(e) =>{
    const Fecha = this.state.FechaModifica
    const SucursalIdModifica = this.state.SucursalIdModifica
    const UnidadDeNegocioIdModifica = this.state.UnidadDeNegocioIdModifica
    const FolioIdModifica = this.state.FolioIdModifica 
    const MontoModifica = this.state.MontoModifica
    const ComentariosModifica = this.state.ComentariosModifica

    const url = this.props.url + `/api/actualizaingresosegresos`

    const json = {
      SucursalId:parseInt(SucursalIdModifica),
	    FolioId: parseInt(FolioIdModifica),
	    Monto: parseFloat(MontoModifica), 
	    Comentarios: ComentariosModifica,
	    Usuario: sessionStorage.getItem('user')
    }


    const response = await fetch(url,{
      method: "PUT",
      body: JSON.stringify(json),
      headers:{
        Authorization: `Bearer ${this.props.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    const data = await response.json()
    if(data.error){
      console.log(data.error)
      alert(data.error)
      return
    }
    const accesoDB = "dia"
    this.getEgresos(Fecha,accesoDB,SucursalIdModifica,UnidadDeNegocioIdModifica)

    alert(data.message)

    this.setState({
      showSeccionEgresos: true,
      FechaModifica: "",
      SucursalIdModifica: "",
      SucursalModifica: "",
      UnidadDeNegocioIdModifica: "",
      UnidadDeNegocioModifica: "",
      CuentaContableIdModifica: "",
      CuentaContableModifica: "",
      SubcuentaContableIdModifica: "",
      SubcuentaContableModifica: "",
      FolioIdModifica: "",
      MontoModifica: "",
      ComentariosModifica: "",
    })
  }

  handleCancelarMonto =() =>{
    this.setState({
      showSeccionEgresos: true,
      FechaModifica: "",
      SucursalIdModifica: "",
      SucursalModifica: "",
      UnidadDeNegocioIdModifica: "",
      UnidadDeNegocioModifica: "",
      CuentaContableIdModifica: "",
      CuentaContableModifica: "",
      SubcuentaContableIdModifica: "",
      SubcuentaContableModifica: "",
      FolioIdModifica: "",
      MontoModifica: "",
      ComentariosModifica: "",
      disableBontonModifica: true,
    })

  }

  handleModificar = (e) => {
    const Id = parseInt(e.target.id) 
    const egresosCadenaMes = this.state.egresosCadenaMes

    let registroModifica = egresosCadenaMes.find(element => parseInt(element.Id) === Id)

    const FechaModifica = registroModifica.Fecha
    const SucursalIdModifica = registroModifica.SucursalId
    const SucursalModifica = registroModifica.SucursalNombre
    const UnidadDeNegocioIdModifica =  registroModifica.UnidadDeNegocioId
    const UnidadDeNegocioModifica =  registroModifica.UnidadDeNegocioNombre
    const CuentaContableIdModifica = registroModifica.CuentaContableId
    const CuentaContableModifica = registroModifica.CuentaContable
    const SubcuentaContableIdModifica =  registroModifica.SubcuentaContableId
    const SubcuentaContableModifica =  registroModifica.SubcuentaContable
    const FolioIdModifica = registroModifica.FolioId
    const MontoModifica = registroModifica.Monto
    const ComentariosModifica = registroModifica.Comentarios

    this.setState({
      showSeccionEgresos: false,
      FechaModifica: FechaModifica,
      SucursalIdModifica: SucursalIdModifica,
      SucursalModifica: SucursalModifica,
      UnidadDeNegocioIdModifica: UnidadDeNegocioIdModifica,
      UnidadDeNegocioModifica: UnidadDeNegocioModifica,
      CuentaContableIdModifica: CuentaContableIdModifica,
      CuentaContableModifica: CuentaContableModifica,
      SubcuentaContableIdModifica: SubcuentaContableIdModifica,
      SubcuentaContableModifica: SubcuentaContableModifica,
      FolioIdModifica: FolioIdModifica,
      MontoModifica: MontoModifica,
      ComentariosModifica: ComentariosModifica,
      disableBontonModifica: true,
    })
  };

  onhandleClear = () => {
    this.setState({
      Monto: "",
    });
    this.monto.current.focus();
  };

  numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  handleRender = () => {
    const styleLabel = {
      display: "inlineBlock",
      fontSize: ".8em",
      width: "128px",
      padding: "0 10px 0 10px",
    };
    const styleLabel2 = {
      display: "inlineBlock",
      fontSize: ".8em",
      width: "128px",
      padding: "0 10px 0 10px",
      color: "blue",
    };

    const styleMonto = {
      textAlign: "right",
      margin: "0 0 10px 0",
    };

    const styleSelect = {
      //display: "inlineBlock",
      width: "170px",
      maxWidth: "170px",
    };

    return (
      <div className="container">
        <div className="row">
          <form className="col-md-6" onSubmit={this.handleSubmit}>
            <h4 style={{ marginBottom: "0px" }}>
              {this.props.naturalezaCC === "1" ? (
                <span className="badge badge-success mb-1">Ingresos</span>
              ) : (
                <span className="badge badge-danger mb-1">Egresos</span>
              )}
            </h4>
            <div className="seccionEgresosModifica" style={{display: this.state.showSeccionEgresos ? "none" : "block"}}>
                <label htmlFor="">Sucursal</label>
                <input value={this.state.SucursalModifica} readOnly/>
                <br />
                <label htmlFor="">Unidad De Negocio</label>
                <input value={this.state.UnidadDeNegocioModifica} readOnly/>
                <br />
                <label htmlFor="">Cuenta Contable</label>
                <input value={this.state.CuentaContableModifica} readOnly/>
                <br />
                <label htmlFor="">Subcuenta Contable</label>
                <input value={this.state.SubcuentaContableModifica} readOnly/>
                <br />
                <label htmlFor="">Folio</label>
                <input value={this.state.FolioIdModifica} readOnly/>
                <br />
                <label htmlFor="">Monto</label>
                <input onChange={this.handleMontoModifica} value={this.state.MontoModifica} style={{textAlign:"right"}} />
                <br />
                <label htmlFor="">Comentarios</label>
                <input onChange={this.handleComentariosModifica} value={this.state.ComentariosModifica} style={{textTransform:"uppercase"}} />

                <div className="botonesModifica" style={{display:"flex",justifyContent:"space-around", marginTop:"20px"}}>
                  <button onClick={this.handleActualizarMontoComentarios} className="btn btn-primary" disabled={this.state.disableBontonModifica}>Actualizar</button>
                  <button onClick={this.handleCancelarMonto} className="btn btn-danger">Cancelar</button>
                </div>
            </div>
            <div className="seccionEgresos" style={{display: this.state.showSeccionEgresos ? "block" : "none"}}>
              <div className="text-right">
                <span className="badge badge-secondary mr-1">
                  Periodo Abierto:
                </span>
                <span className="badge badge-warning">
                  {this.state.PeriodoAbierto}
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

              <label htmlFor="sucursales" style={styleLabel2}>
                Sucursal:
              </label>
              <select
                style={styleSelect}
                onChange={this.HandleSucursales}
                id="sucursal"
                name="sucursal"
                value={this.state.SucursalId}
              >
                {this.state.sucursales.map((element, i) => (
                  <option key={i} value={element.SucursalId}>
                    {element.Sucursal}
                  </option>
                ))}
              </select>

              <br />
              <label htmlFor="unidadesdenegocio" style={styleLabel2}>
                Unidad de Negocio:
              </label>

              <select
                style={styleSelect}
                onChange={this.HandleUnidadesDeNegocio}
                id="unidadesdenegocio"
                name="unidadesdenegocio"
                value={this.state.UnidadDeNegocioId}
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
                value={this.state.CuentaContableId}
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
                value={this.state.SubcuentaContableId}
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
                value={this.numberWithCommas(this.state.Monto)}
                id="monto"
                name="monto"
                autoComplete="off"
                min="0.01"
                max="99999"
                size="12"
                maxLength="9"
                required
                ref={this.monto}
                disabled={this.state.disabledMonto}
              />
              <br />
              <textarea
                id="comentariosTextarea"
                name="comentariosTextarea"
                cols="40"
                row="2"
                maxLength="75"
                placeholder="Comentarios..."
                onChange={this.handleComentarios}
                value={this.state.comentarios}
                style={{ marginLeft: "10px" }}
              ></textarea>
              <br />
              <div className="botones">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  disabled={this.state.disabledMonto}
                >
                  Grabar
                </button>
                <button
                  className="btn btn-danger btn-lg"
                  type="reset"
                  onClick={this.onhandleClear}
                >
                  Cancelar
                </button>
              </div>
            </div>
            <span className="badge badge-primary">DIA</span>

            <div className="consultaDia">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "-8px",
                }}
              >
                <div className="child">
                  <span className="badge badge-danger">
                    {this.state.Sucursal}
                  </span>
                  <span
                    className="badge badge-primary"
                    style={{ marginLeft: "10px" }}
                  >
                    {this.state.UnidadDeNegocio}
                  </span>
                </div>
                <div className="child">
                  <span className="badge badge-secondary mr-1">Fecha:</span>
                  <span className="badge badge-warning">
                    {this.state.Fecha}
                  </span>
                  <span className="badge badge-secondary mr-1">Total:</span>
                  <span className="badge badge-warning">
                    ${" "}
                    {this.numberWithCommas(
                      this.state.TotalEgresosDia.toFixed(0)
                    )}
                  </span>
                </div>
              </div>

              <table>
                <thead>
                  <tr>
                    <th>Folio</th>
                    <th>Cuenta Contable</th>
                    <th>Subcuenta Contable</th>
                    <th>Fecha</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.egresosCadenaMes
                    .filter(
                      (e) =>
                        e.Fecha === this.state.Fecha &&
                        parseInt(e.SucursalId) === this.state.SucursalId &&
                        parseInt(e.UnidadDeNegocioId) ===
                          this.state.UnidadDeNegocioId
                    )
                    .map((element, i) => (
                      <tr key={i}>
                        <td>{element.FolioId}</td>
                        <td>{element.CuentaContable}</td>
                        <td>{element.SubcuentaContable}</td>
                        <td>{element.Fecha.substr(0, 10)}</td>
                        <td className="text-right">
                          $ {this.numberWithCommas(element.Monto)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </form>

          <div className="col-md-6">
            <span
              className="badge badge-primary mt-3"
              style={{ marginBottom: "3px" }}
            >
              MES
            </span>
            <div className="seccionDespliegaIngresos">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "-8px",
                }}
              >
                <div className="child">
                  <span className="badge badge-danger">
                    {this.state.Sucursal}
                  </span>
                  <span
                    className="badge badge-primary"
                    style={{ marginLeft: "10px" }}
                  >
                    {this.state.UnidadDeNegocio}
                  </span>
                </div>
                <div className="child">
                  <span className="badge badge-secondary mr-1">Periodo:</span>
                  <span className="badge badge-warning">
                    {this.state.Periodo}
                  </span>
                  <span className="badge badge-secondary mr-1">Total:</span>
                  <span className="badge badge-warning">
                    ${" "}
                    {this.numberWithCommas(
                      this.state.TotalEgresosMes.toFixed(0)
                    )}
                  </span>
                </div>
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
                  {this.state.egresosCadenaMes
                    .filter(
                      (e) =>
                        parseInt(e.SucursalId) === this.state.SucursalId &&
                        parseInt(e.UnidadDeNegocioId) ===
                          this.state.UnidadDeNegocioId
                    )
                    .map((element, i) => (
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
                            onClick={this.handleModificar}
                            id={element.Id}
                            className="btn btn-danger btn-sm "
                            style={{fontSize:".6rem"}}
                          >
                            Modificar
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
    );
  };

  render() {
    return (
      <React.Fragment>
        {this.state.PeriodoAbierto !== "" ? (
          <this.handleRender />
        ) : (
          <h3>Loading...</h3>
        )}
      </React.Fragment>
    );
  }
}

export default Egresos;
