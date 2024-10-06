import React, { Component } from "react";

import "./Egresos.css";

import NumberFormat from 'react-number-format'

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
      Comentarios: "",
      egresosCadenaMes: [],
      TotalEgresosMes: 0,
      TotalEgresosDia: 0,
      TotalEgresosGrupoUnidades: 0,

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
      disabledMonto: false,
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
      isWaiting: false,

    };

  }

  async componentDidMount() {
    // if (await this.fechaActual() === false) return;
    const fechaActual = await this.fechaActual()
    // alert(fechaActual)
    //Fecha: fechaActual

    // if (await this.getSucursales() === false) return;
    const sucursales = await this.getSucursales()
    // alert(sucursales)
    // alert(sucursales[0].SucursalId)
    // alert(sucursales[0].Sucursal)

    // sucursales: data,
    // SucursalId: data[0].SucursalId,
    //  Sucursal: data[0].Sucursal,

    //if (await this.getUnidadesNegocioCatalogo() === false) return;
    const unidadesnegociocatalogo = await this.getUnidadesNegocioCatalogo()
    // alert(unidadesnegociocatalogo)
    // alert(unidadesnegociocatalogo[0].UnidadDeNegocioId)
    // alert(unidadesnegociocatalogo[0].UnidadDeNegocio)

      // unidadesdenegociocatalogo: data,
      // UnidadDeNegocioId: data[0].UnidadDeNegocioId,
      // UnidadDeNegocio: data[0].UnidadDeNegocio,


    //if (await this.getCuentasContablesCatalogo() === false) return;
    const cuentascontablescatalogo = await this.getCuentasContablesCatalogo()
    // alert(cuentascontablescatalogo)
    // alert(cuentascontablescatalogo[0].CuentaContableId)
    // alert(cuentascontablescatalogo[0].CuentaContable)
      //   cuentascontablescatalogo: data,
      //   CuentaContableId: data[0].CuentaContableId,
      //   CuentaContable: data[0].CuentaContable,


    //if (await this.getSubcuentasContablesCatalogo() === false) return;
    const subcuentascontablescatalogo = await this.getSubcuentasContablesCatalogo()
    // alert(subcuentascontablescatalogo)
    // alert(subcuentascontablescatalogo[0].SubcuentaContableId)
    // alert(subcuentascontablescatalogo[0].SubcuentaContable)
      //   subcuentascontablescatalogo: data,
      //   SubcuentaContableId: data[0].SubcuentaContableId,
      //   SubcuentaContable: data[0].SubcuentaContable,



    //if (await this.getPeriodoAbierto() === false) return;
    const json_periodoabierto = await this.getPeriodoAbierto(fechaActual)
    // alert(json_periodoabierto)
      //   PeriodoAbierto: json_periodoabierto.PeriodoAbierto,
      //   PeriodoAbiertoPrimerDia: json_periodoabierto.PeriodoAbiertoPrimerDia,
      //   PeriodoAbiertoUltimoDia: json_periodoabierto.PeriodoAbiertoUltimoDia,
      //   Fecha: json_periodoabierto.Fecha,



      this.setState({
          //Fecha: fechaActual
          sucursales: sucursales,
          SucursalId: sucursales[0].SucursalId,
          Sucursal: sucursales[0].Sucursal,
          unidadesdenegociocatalogo: unidadesnegociocatalogo,
          UnidadDeNegocioId: unidadesnegociocatalogo[0].UnidadDeNegocioId,
          UnidadDeNegocio: unidadesnegociocatalogo[0].UnidadDeNegocio,
          cuentascontablescatalogo: cuentascontablescatalogo,
          CuentaContableId: cuentascontablescatalogo[0].CuentaContableId,
          CuentaContable: cuentascontablescatalogo[0].CuentaContable,
          subcuentascontablescatalogo: subcuentascontablescatalogo,
          SubcuentaContableId: subcuentascontablescatalogo[0].SubcuentaContableId,
          SubcuentaContable: subcuentascontablescatalogo[0].SubcuentaContable,
          PeriodoAbierto: json_periodoabierto.PeriodoAbierto,
          PeriodoAbiertoPrimerDia: json_periodoabierto.PeriodoAbiertoPrimerDia,
          PeriodoAbiertoUltimoDia: json_periodoabierto.PeriodoAbiertoUltimoDia,
          Fecha: json_periodoabierto.Fecha,
      },()=>{
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
      })
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
    //let bandera = false
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
      // this.setState({
      //   Fecha: Fecha,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    // return bandera
    return Fecha
  };

  getPeriodoAbierto = async (Fecha) => {
    const url = this.props.url + `/api/periodoabierto`;
    //let Fecha = this.state.Fecha
    let PeriodoAbierto;
    let PeriodoAbiertoPrimerDia;
    let PeriodoAbiertoUltimoDia;
    //let bandera = false
    let data = []
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();

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
      // this.setState({
      //   PeriodoAbierto: PeriodoAbierto,
      //   PeriodoAbiertoPrimerDia: PeriodoAbiertoPrimerDia,
      //   PeriodoAbiertoUltimoDia: PeriodoAbiertoUltimoDia,
      //   Fecha: Fecha,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    //return bandera

    const json ={
      PeriodoAbierto: PeriodoAbierto,
      PeriodoAbiertoPrimerDia: PeriodoAbiertoPrimerDia,
      PeriodoAbiertoUltimoDia: PeriodoAbiertoUltimoDia,
      Fecha: Fecha,
    }


    return json
  };

  getSucursales = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    const url = this.props.url + `/api/sucursales/${naturalezaCC}`;
    let data = []
    //let bandera = false
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Sucursales" };
        return;
      }
      // this.setState({
      //   sucursales: data,
      //   SucursalId: data[0].SucursalId,
      //   Sucursal: data[0].Sucursal,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    //return bandera
    return data
  };

  getUnidadesNegocioCatalogo = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    //let bandera = false
    let data = []
    const url =
      this.props.url + `/api/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Unidades de Negocio" };
        return;
      }
      // this.setState({
      //   unidadesdenegociocatalogo: data,
      //   UnidadDeNegocioId: data[0].UnidadDeNegocioId,
      //   UnidadDeNegocio: data[0].UnidadDeNegocio,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    //return bandera
    return data
  };

  getCuentasContablesCatalogo = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    //let bandera = false
    let data = []
    const url =
      this.props.url + `/api/ingresos/cuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Cuentas Contables" };
        return;
      }
      // this.setState({
      //   cuentascontablescatalogo: data,
      //   CuentaContableId: data[0].CuentaContableId,
      //   CuentaContable: data[0].CuentaContable,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    //return bandera
    return data
  };

  getSubcuentasContablesCatalogo = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    //let bandera = false
    let data = []
    const url =
      this.props.url + `/api/ingresos/subcuentascontablescatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      data = await response.json();
      if (data.length === 0) {
        data = { error: "No hay Subcuentas Contables" };
        return;
      }
      // this.setState({
      //   subcuentascontablescatalogo: data,
      //   SubcuentaContableId: data[0].SubcuentaContableId,
      //   SubcuentaContable: data[0].SubcuentaContable,
      // });
      //bandera = true
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    //return bandera
    return data
  };

  getEgresos = async (vfecha, accesoDB, SucursalId,UnidadDeNegocioId) => {
    const naturalezaCC = this.props.naturalezaCC;
    let dataGetEgresosCadena = this.state.egresosCadenaMes;
    const trans="Egresos"

    let data = [];

    if (accesoDB === "mes" || accesoDB === "dia") {
      const url =
        this.props.url +
        `/api/ingresos/getIngresosEgresos/${vfecha}/${naturalezaCC}/${accesoDB}/${trans}`;
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

    let TotalEgresosGrupoUnidades = 0
      for(let i = 0; i < data.length; i++){
        if(UnidadDeNegocioId === 1 || UnidadDeNegocioId === 2 || UnidadDeNegocioId === 10 || UnidadDeNegocioId === 11){
          if(data[i].UnidadDeNegocioId === 1 || data[i].UnidadDeNegocioId === 2 || data[i].UnidadDeNegocioId === 10 || data[i].UnidadDeNegocioId === 11){
            TotalEgresosGrupoUnidades += parseFloat(data[i].Monto)
          }
        }else{
          if(data[i].UnidadDeNegocioId !== 1 && data[i].UnidadDeNegocioId !== 2 && data[i].UnidadDeNegocioId !== 10 && data[i].UnidadDeNegocioId !== 11){
            TotalEgresosGrupoUnidades += parseFloat(data[i].Monto)
          }
        }
      }
      
    if (accesoDB === "mes" || accesoDB === "dia") {
      this.setState({
        egresosCadenaMes: data,
        TotalEgresosDia: TotalEgresosDia,
        TotalEgresosMes: TotalEgresosMes,
        TotalEgresosGrupoUnidades: TotalEgresosGrupoUnidades.toFixed(0),
      });
    } else {
      this.setState({
        TotalEgresosDia: TotalEgresosDia,
        TotalEgresosMes: TotalEgresosMes,
        TotalEgresosGrupoUnidades: TotalEgresosGrupoUnidades.toFixed(0),
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

    this.setState({
          CuentaContableId: CuentaContableId,
          CuentaContable: CuentaContable,
          subcuentascontables: dataSubcuentasContables,
          SubcuentaContableId: SubcuentaContableId,
        });
  };

  HandleSubcuentasContables = (event) => {
    const SubcuentaContableId = event.target.value
    const subcuentascontablescatalogo = this.state.subcuentascontablescatalogo
    const SubcuentaContable = subcuentascontablescatalogo.find(element => element.SubcuentaContableId === SubcuentaContableId).SubcuentaContable

    this.setState({
      SubcuentaContableId: SubcuentaContableId,
      SubcuentaContable: SubcuentaContable,
    });
  };

  // handleChange = (event) => {
  //   // let { value, min, max, step } = event.target;
  //   let { value } = event.target;
  //   value = value.toString().replace(",", "");

  //   if (value[0] === " ") {
  //     return;
  //   }

  //   let numbers = /^[0-9 .]+$/;
  //   if (value.match(numbers) || value === "") {
  //     this.setState({ Monto: value });
  //   }
  // };

  handleComentarios = (event) => {
    let  value  = event.target.value.toUpperCase();
    this.setState({ Comentarios: value });
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

    this.setState({
        isWaiting: true,
      },async()=>{

      

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
        Comentarios: this.state.Comentarios,
        Usuario: sessionStorage.getItem("user"),
      };

      try {
        const url = this.props.url + `/api/ingresos/grabaingresos`;
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
          Comentarios: "",
          isWaiting: false,
        });
        alert(JSON.stringify(data));
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }





    });
  };

  handleMontoModifica = (MontoModifica) =>{
    this.setState({
      MontoModifica: Math.abs(MontoModifica) * -1,
      disableBontonModifica: false,
    })
  }

  handleComentariosModifica = (e) =>{
    const ComentariosModifica = e.target.value.toUpperCase() 
    this.setState({
      ComentariosModifica: ComentariosModifica,
    })
  }

  handleActualizarMontoComentarios = async(e) =>{
    e.preventDefault()
    const Fecha = this.state.FechaModifica
    const SucursalIdModifica = this.state.SucursalIdModifica
    const UnidadDeNegocioIdModifica = this.state.UnidadDeNegocioIdModifica
    const FolioIdModifica = this.state.FolioIdModifica 
    const MontoModifica = this.state.MontoModifica
    const Monto = this.state.Monto
    const ComentariosModifica = this.state.ComentariosModifica
    const Comentarios = this.state.Comentarios


    if(parseFloat(Monto) === parseFloat(Math.abs(MontoModifica)) && Comentarios === ComentariosModifica ){
      return
    }

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
      Monto:"",
      Comentarios: "",
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
      Monto: "",
      Comentarios: "",
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
      Monto: MontoModifica,
      ComentariosModifica: ComentariosModifica,
      Comentarios: ComentariosModifica,
      disableBontonModifica: true,
      
    })
  };

  onhandleClear = () => {
    this.setState({
      Monto: "",
    });
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
               
                <NumberFormat 
                  thousandSeparator={true}
                  prefix={'$ '}
                  onValueChange = {(values) =>{
                    // const {formattedValue, value} = values
                    const { value} = values
                    let value2 = value
                    if(value2 > 0){
                      value2 = value
                    }
                    this.handleMontoModifica(value2)
                  }}
                  value={Math.abs(this.state.MontoModifica)} 
                  style={{textAlign:"rigth"}} 
                  
                />
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
                <span className="badge badge-secondary mr-1">
                  Total Egresos MES:
                </span>
                <span className="badge badge-primary">
                  {this.numberWithCommas(this.state.TotalEgresosGrupoUnidades)}
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

              <NumberFormat
                thousandSeparator={true}
                prefix={'$ '}
                allowNegative={false}
                style={styleMonto}
                placeholder="Monto $$$"
                onValueChange = {(values) =>{
                  // const { formattedValue, value} = values 
                  const { value} = values 
                  this.setState({
                    Monto: value,
                  })
                }}
                value={this.state.Monto}
                id="monto"
                name="monto"
                autoComplete="off"
                min="0.00"
                max="99999"
                size="12"
                maxLength="11"
                disabled={this.state.disabledMonto}
                autoFocus
                required
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
                value={this.state.Comentarios}
                style={{ marginLeft: "10px", textTransform:"uppercase"}}
              ></textarea>
              <br />
              <div className="botones">
                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  // disabled={this.state.disabledMonto}
                  disabled={this.state.isWaiting === true ? true : this.state.disabledMonto}
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
                    ).sort((a,b) => parseInt(b.FolioId) -  parseInt(a.FolioId)) //Ordenamiento DESC
                    .map((element, i) => (
                      <tr key={i}>
                        <td>{element.FolioId}</td>
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
