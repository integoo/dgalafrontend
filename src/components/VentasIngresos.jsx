import React, { Component } from "react";

import "./VentasIngresos.css";

import NumberFormat from "react-number-format";

class VentasIngresos extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      arregloVentasIngresosMes: [],
      arregloVentasIngresos: [],

      PeriodoAbierto: "",
      PeriodoAbiertoPrimerDia: "",
      PeriodoAbiertoUltimoDia: "",

      disabledFlag: false,
      disabledVentaModifica: true,
      disabledBotonesModifica: false,
      disabledBotonGrabar: false,
      disabledBotonActualiza: false,
      disabledModifica: false,
      TotalDia: 0,
      TotalMes: 0,

      Sucursal: "",
      SucursalId: "",
      FolioId: "",
      Monto: "",
      Comentarios: "",
      Posicion: "",
    };
  }

  async componentDidMount() {
    if ((await this.getFechaHoy()) === false) return;

    if ((await this.getPeriodoAbierto()) === false) return;
    if ((await this.getUnidadesDeNegocio()) === false) return;
    if ((await this.getCuentasContables()) === false) return;
    if ((await this.getSubcuentasContables()) === false) return;
    if ((await this.getSucursales()) === false) return;

    const UnidadDeNegocioId = this.state.UnidadDeNegocioId;
    const CuentaContableId = this.state.CuentaContableId;

    let Fecha = this.state.Fecha;
    let FechaPeriodoAbiertoUltimoDia = this.state.PeriodoAbiertoUltimoDia;
    if (Fecha > FechaPeriodoAbiertoUltimoDia) {
      Fecha = FechaPeriodoAbiertoUltimoDia;
    }

    let arregloCC =
      this.sincronizaCuentasContablesConUnidadDeNegocio(UnidadDeNegocioId);

    let arregloScC = this.sincronizaSubcuentasContablesConUnidadDeNegocio(
      UnidadDeNegocioId,
      CuentaContableId
    );

    const accesoDB = "mes"; //Consulta la Base de Datos

    this.setState(
      {
        Fecha: Fecha,
        cuentasContablesDeUnidadDeNegocio: arregloCC,
        subcuentasContablesDeUnidadDeNegocio: arregloScC,
      },() => this.handleConsultaIngresos(Fecha, accesoDB)
    );
  }

  sincronizaCuentasContablesConUnidadDeNegocio = (UnidadDeNegocioId) => {
    let arregloCC = this.state.cuentasContablesCatalogo.filter(
      (element) => element.UnidadDeNegocioId === UnidadDeNegocioId
    );
    return arregloCC;
  };

  sincronizaSubcuentasContablesConUnidadDeNegocio = (
    UnidadDeNegocioId,
    CuentaContableId
  ) => {
    let arregloScC = this.state.subcuentasContablesCatalogo.filter(
      (element) =>
        element.UnidadDeNegocioId === UnidadDeNegocioId &&
        element.CuentaContableId === CuentaContableId
    );
    return arregloScC;
  };

  sincronizaSucursales = (
    UnidadDeNegocioId,
    CuentaContableId,
    SubcuentaContableId,
    Fecha
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
        FolioId: 0,
        Sucursal: arregloTemp[0].Sucursal,
        UnidadDeNegocioId: UnidadDeNegocioId,
        CuentaContableId: CuentaContableId,
        SubcuentaContableId: SubcuentaContableId,
        Fecha: Fecha,
        Monto: "",
        Comentarios: "",
        Cmts: "",
        Usuario: sessionStorage.getItem("user"),
      };
      SucursalesIngresos.push(json);
    });

    return SucursalesIngresos;
  };

  getFechaHoy = async () => {
    const url = this.props.url + `/api/fechahoy`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if(data.error){
        alert(data.error)
        return bandera
      }
      this.setState({
        Fecha: data[0].FechaHoy.substring(0, 10),
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getPeriodoAbierto = async () => {
    const url = this.props.url + `/periodoabierto`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if(data.error){
        alert(data.error)
        return bandera
      }
      this.setState({
        PeriodoAbierto: data.rows[0].Periodo,
        PeriodoAbiertoPrimerDia: data.rows[0].PrimerDiaMes.substring(0, 10),
        PeriodoAbiertoUltimoDia: data.rows[0].UltimoDiaMes.substring(0, 10),
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getUnidadesDeNegocio = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    let bandera = false;
    const url =
      this.props.url + `/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      if(data.error){
        alert(data.error)
        return bandera
      }
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
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getCuentasContables = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    let bandera = false;
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
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getSubcuentasContables = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    let bandera = false;
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
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getSucursales = async () => {
    const naturalezaCC = this.props.naturalezaCC;
    let bandera = false;
    const url = this.props.url + `/api/sucursales/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      this.setState({
        SucursalesCatalogo: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  handleDespliegaSucursales = (
    UnidadDeNegocioId,
    CuentaContableId,
    SubcuentaContableId,
    accesoDB
  ) => {
    const Fecha = this.state.Fecha;

    const SucursalesIngresos = this.sincronizaSucursales(
      UnidadDeNegocioId,
      CuentaContableId,
      SubcuentaContableId,
      Fecha
    );

    this.setState(
      {
        SucursalesIngresos: SucursalesIngresos,
      },
      () => {
        this.handleConsultaIngresos(Fecha, accesoDB);
      }
    );
    document.querySelector(".SucursalInputPrimera").focus();
  };

  handleUnidadDeNegocio = (e) => {
    const UnidadDeNegocioId = parseInt(e.target.value);
    const arregloTemp =
      this.sincronizaCuentasContablesConUnidadDeNegocio(UnidadDeNegocioId);
    const CuentaContableId = parseInt(arregloTemp[0].CuentaContableId);
    const arregloTempScC = this.sincronizaSubcuentasContablesConUnidadDeNegocio(
      UnidadDeNegocioId,
      CuentaContableId
    );
    const SubcuentaContableId = arregloTempScC[0].SubcuentaContableId;
    const accesoDB = "NO";

    this.setState(
      {
        UnidadDeNegocioId: UnidadDeNegocioId,
        cuentasContablesDeUnidadDeNegocio: arregloTemp,
        subcuentasContablesDeUnidadDeNegocio: arregloTempScC,
        CuentaContableId: CuentaContableId,
        SubcuentaContableId: SubcuentaContableId,
      },
      () => {
        this.handleDespliegaSucursales(
          UnidadDeNegocioId,
          CuentaContableId,
          SubcuentaContableId,
          accesoDB
        );
      }
    );
  };

  handleCuentaContable = (e) => {
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId;
    const CuentaContableId = parseInt(e.target.value);
    const accesoDB = "NO";
    const arregloTemp = this.sincronizaSubcuentasContablesConUnidadDeNegocio(
      UnidadDeNegocioId,
      CuentaContableId
    );
    const SubcuentaContableId = arregloTemp[0].SubcuentaContableId;
    this.setState(
      {
        CuentaContableId: CuentaContableId,
        subcuentasContablesDeUnidadDeNegocio: arregloTemp,
        SubcuentaContableId: SubcuentaContableId,
      },
      () => {
        this.handleDespliegaSucursales(
          UnidadDeNegocioId,
          CuentaContableId,
          SubcuentaContableId,
          accesoDB
        );
      }
    );
  };

  handleSubcuentaContable = (e) => {
    const SubcuentaContableId = e.target.value;
    const accesoDB = "NO";
    this.setState(
      {
        SubcuentaContableId: SubcuentaContableId,
      },
      () => {
        this.handleDespliegaSucursales(
          this.state.UnidadDeNegocioId,
          this.state.CuentaContableId,
          SubcuentaContableId,
          accesoDB
        );
      }
    );
  };

  handleConsultaIngresos = async (Fecha, accesoDB) => {
    let data;
    let arregloVentasIngresosMes;
    const trans = "Ingresos"
    const UnidadDeNegocioId = this.state.UnidadDeNegocioId;
    if (accesoDB === "mes" || accesoDB === "dia") {
      const naturalezaCC = this.props.naturalezaCC;
      const url =
        this.props.url +
        `/ingresos/getIngresosEgresos/${Fecha}/${naturalezaCC}/${accesoDB}/${trans}`;

      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
          },
        });
        data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          return;
        }
        //##### SI mesdia = 'dia' hay que agregar data a arregloVentasIngresosMes #########
        if (accesoDB === "dia") {
          arregloVentasIngresosMes = this.state.arregloVentasIngresosMes;
          arregloVentasIngresosMes = arregloVentasIngresosMes.filter(
            (element) => element.Fecha !== Fecha
          );
          let arregloVentasIngresosMesTemp = [] //Este arreglo lo puse para ordenar primero las nuevas capturas
          data.forEach((element) => {
            //arregloVentasIngresosMes.push(element);
            arregloVentasIngresosMesTemp.push(element); //Pone las nuevas capturas
          });
          arregloVentasIngresosMes.forEach((element) =>{
            arregloVentasIngresosMesTemp.push(element) //Pone las capturas que ya estaban
          })
          data = arregloVentasIngresosMesTemp; //data queda ordenado de las más nuevas a las más viejas
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        return;
      }
    } else {
      data = this.state.arregloVentasIngresosMes;
    }

    //###### Filtra solamente los registros del mes de la Unidad De Negocio ##########
    const dataFilter = data.filter(
      (element) =>
        parseInt(element.UnidadDeNegocioId) === parseInt(UnidadDeNegocioId)
    );

    //########################### Calcula Total Mes y Total Diario ###############################
    let TotalDia = 0;
    let TotalMes = 0;
    for (let i = 0; i < dataFilter.length; i++) {
      if (Fecha === dataFilter[i].Fecha) {
        TotalDia += parseFloat(dataFilter[i].Monto);
        TotalMes += parseFloat(dataFilter[i].Monto);
      } else {
        TotalMes += parseFloat(dataFilter[i].Monto);
      }
    }

    //########################### LLena arreglo para desplegar Montos Sucursales ###############################

    let disabledBotonesModifica = false;

      const CuentaContableId = this.state.CuentaContableId 
      const SubcuentaContableId = this.state.SubcuentaContableId
      let SucursalesIngresos = this.sincronizaSucursales(UnidadDeNegocioId,CuentaContableId,SubcuentaContableId,Fecha)


    let arregloTemp = [];
    let disabledBotonGrabar = false;
    for (let i = 0; i < SucursalesIngresos.length; i++) {
      SucursalesIngresos[i].Fecha = Fecha;
      arregloTemp = dataFilter.filter(
        (element) =>
          element.Fecha === Fecha &&
          element.SucursalId === SucursalesIngresos[i].SucursalId &&
          element.UnidadDeNegocioId === SucursalesIngresos[i].UnidadDeNegocioId
      );
      if (arregloTemp.length > 0) {
        SucursalesIngresos[i].FolioId = arregloTemp[0].FolioId;
        SucursalesIngresos[i].Monto = arregloTemp[0].Monto;
        SucursalesIngresos[i].Comentarios = arregloTemp[0].Comentarios;
        disabledBotonGrabar = true;
      } else {
        SucursalesIngresos[i].FolioId = 0;
        SucursalesIngresos[i].Monto = "";
        SucursalesIngresos[i].Comentarios = "";
        disabledBotonesModifica = true;
      }
    }

    //########### Valida si deshabilitar los Campos Montos de Sucursales en la Captura ###############
    const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
    let newDisabledFlag = false;
    if (Fecha >= PeriodoAbiertoPrimerDia && TotalDia === 0) {
      newDisabledFlag = false;
    } else {
      newDisabledFlag = true;
    }

    if(Fecha >= PeriodoAbiertoPrimerDia && TotalDia > 0){
      disabledBotonesModifica = false
    }

    if (accesoDB === "mes" || accesoDB === "dia") {

      this.setState(
        {
          arregloVentasIngresosMes: data, //Este se actualiza cuando accesoDB es true
          SucursalesIngresos: SucursalesIngresos,
          arregloVentasIngresos: dataFilter,
          TotalDia: TotalDia,
          TotalMes: TotalMes,
          disabledFlag: newDisabledFlag,
          disabledBotonGrabar: disabledBotonGrabar,
          disabledBotonesModifica: disabledBotonesModifica,
        });
    } else {
      this.setState(
        {
          SucursalesIngresos: SucursalesIngresos,
          arregloVentasIngresos: dataFilter,
          TotalDia: TotalDia,
          TotalMes: TotalMes,
          disabledFlag: newDisabledFlag,
          disabledBotonGrabar: disabledBotonGrabar,
          disabledBotonesModifica: disabledBotonesModifica,
        });
    }
  };

  handleFecha = (e) => {
    const Fecha = e.target.value;
    const mes0 = Fecha.toString().substring(6, 7);

    //################## Si el mes de la nueva fecha cambia, acceder a la DB en la consulta ###############
    const FechaAnterior = this.state.Fecha;
    const mes1 = FechaAnterior.toString().substring(6, 7);

    let accesoDB = "NO";
    if (mes0 !== mes1) {
      accesoDB = "mes";
    }

    //#################### Valida Fecha para deshabilitar campos ##############################

    this.setState(
      {
        Fecha: Fecha,
      },()=>  this.handleConsultaIngresos(Fecha,accesoDB));
      
     
    };

  handleMonto = (e) => {
    let { value } = e.target;
    value = value.toString().replace(/["$" "," " " ]/g, "");

    if (parseFloat(value) < 0) {
      return;
    }

    let SucursalId = parseInt(e.target.id);
    if (SucursalId > 200) {
      SucursalId = SucursalId - 200;
    } else {
      SucursalId = SucursalId - 100;
    }
    let SucursalesIngresos = this.state.SucursalesIngresos;
    SucursalesIngresos[SucursalId].Monto = value;
    SucursalesIngresos[SucursalId].Fecha = this.state.Fecha;
    SucursalesIngresos[SucursalId].Comentarios = this.state.Comentarios;

    this.setState({
      SucursalesIngresos: SucursalesIngresos,
    });
  };

  // handleMontoModifica = (e)=>{
  //   let Monto = e.target.value.replace(/[$ ,]/g,"")
  //   //Valida que solamente tenga un PUNTO .
  //   let cuenta=0;
  //   for(let i=0; i< Monto.length; i++){
  //     if(Monto[i] === "."){
  //       cuenta+=1
  //       if(Monto.length - i >= 4){  //Valida que solamente tenga 2 decimales
  //         return
  //       }
  //     }
  //   }
  //   if(cuenta>1){
  //     return
  //   }
  //   let numbers = /^[0-9.]+$/;
  //   if (Monto.match(numbers) || Monto === ""){
  //     this.setState({
  //       Monto: Monto,
  //       //disabledBotonActualiza: bandera,
  //     })
  //   }
  // }

  handleComentarios = (e) => {
    let value = e.target.value.toUpperCase();
    let Posicion = parseInt(e.target.id);
    if (Posicion > 400) {
      Posicion = Posicion - 400;
    } else {
      Posicion = Posicion - 300;
    }
    let SucursalesIngresos = this.state.SucursalesIngresos;
    SucursalesIngresos[Posicion].Comentarios = value;

    this.setState({
      SucursalesIngresos: SucursalesIngresos,
    });
  };

  handleComentariosModifica = (e) => {
    const Comentarios = e.target.value.toUpperCase();
    let bandera = true;
    if (
      Comentarios !==
      this.state.SucursalesIngresos[this.state.Posicion].Comentarios
    ) {
      bandera = false;
    } else {
      bandera = true;
    }
    this.setState({
      Comentarios: Comentarios,
      disabledBotonActualiza: bandera,
    });
  };

  handleModifica = (e) => {
    e.preventDefault();
    const posicion = parseInt(e.target.name);
    const SucursalesIngresos = this.state.SucursalesIngresos;
    const Fecha = this.state.Fecha;
    const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
    let disabledBandera = false;

    if (Fecha < PeriodoAbiertoPrimerDia) {
      disabledBandera = true;
    }

    if (SucursalesIngresos[posicion].FolioId > 0){
      this.setState({
        disabledVentaModifica: false,
        disabledBotonActualiza: disabledBandera,
        SucursalId: SucursalesIngresos[posicion].SucursalId,
        Sucursal: SucursalesIngresos[posicion].Sucursal,
        FolioId: SucursalesIngresos[posicion].FolioId,
        Monto: SucursalesIngresos[posicion].Monto,
        Comentarios: SucursalesIngresos[posicion].Comentarios,
        Posicion: posicion,
      });
    }else{
      alert("Este Registro no tiene Folio Asignado")
    }
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleGrabar = async (e) => {
    e.preventDefault();
    const Fecha = this.state.Fecha;
    const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
    if (Fecha < PeriodoAbiertoPrimerDia) {
      alert(
        "No se permite modificar un periodo con Fecha menor al Periodo Abierto"
      );
      return;
    }
    const json = this.state.SucursalesIngresos;
    let hayMovimientos = false;
    for (let i = 0; i < json.length; i++) {
      if (json[i].Monto === "" || json[i].Monto[0] === " ") {
        json[i].Monto = 0;
      }
      if (
        json[i].Monto !== "" &&
        json[i].Monto[0] !== " " &&
        json[i].Monto > 0
      ) {
        hayMovimientos = true;
      }
    }
    if (hayMovimientos === false) {
      alert("No hay movimiento que registrar");
      return;
    }
    const url = this.props.url + `/ingresos/grabaingresos2`;

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(json),
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        console.log(data.error);
        alert(data.error);
        return;
      }

      //## Pone accesoDB = false para que consulte Ingresos sin acceder a la DB
      const accesoDB = "dia"; //Consulta la Base de Datos
      //#############################################################################################

      this.setState(
        {
          disabledBotonGrabar: true,
        },
        () => {
          this.handleConsultaIngresos(Fecha, accesoDB);
        }
      );

      alert(data.message);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  handleCancelar = (e) => {
    e.preventDefault();
    const TotalDia = this.state.TotalDia;
    const Fecha = this.state.Fecha;
    const PeriodoAbiertoPrimerDia = this.state.PeriodoAbiertoPrimerDia;
    let SucursalesIngresos = this.state.SucursalesIngresos;

    if (TotalDia === 0 && Fecha >= PeriodoAbiertoPrimerDia) {
      for (let i = 0; i < SucursalesIngresos.length; i++) {
        SucursalesIngresos[i].Monto = "";
        SucursalesIngresos[i].Comentarios = "";
      }
    }
    this.setState({
      SucursalesIngresos: SucursalesIngresos,
    });
  };

  handleActualiza = async (e) => {
    e.preventDefault();
    const SucursalId = this.state.SucursalId;
    const FolioId = this.state.FolioId;
    const Monto = this.state.Monto;
    const Comentarios = this.state.Comentarios;
    const Usuario = sessionStorage.getItem("user");
    const Fecha = this.state.Fecha;

    const SucursalesIngresos = this.state.SucursalesIngresos;
    const Posicion = this.state.Posicion;

    if (
      parseFloat(Monto) === parseFloat(SucursalesIngresos[Posicion].Monto) &&
      Comentarios === SucursalesIngresos[Posicion].Comentarios
    ) {
      alert("No hay nada que actualizar");
      return;
    }
    const url = this.props.url + `/api/actualizaingresosegresos`;
    const json = {
      SucursalId: SucursalId,
      FolioId: FolioId,
      Monto: Monto,
      Comentarios: Comentarios,
      Usuario: Usuario,
    };
    try {
      const response = await fetch(url, {
        method: "PUT",
        body: JSON.stringify(json),
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.error) {
        alert(data.error);
        return;
      }
      alert(data.message);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    this.setState({
      Posicion: "",
      SucursalId: "",
      FolioId: "",
      Monto: "",
      Comentarios: "",
      disabledBotonActualiza: false,
      disabledBotonesModifica: !this.state.disabledBotonesModifica,
      disabledVentaModifica: !this.state.disabledVentaModifica,
    });
    const accesoDB = "mes"; // Consulta la Base de Datos
    this.handleConsultaIngresos(Fecha, accesoDB);
  };

  handleCerrarModifica = (e) => {
    e.preventDefault();
    this.setState({
      disabledBotonesModifica: false,
      disabledVentaModifica: !this.state.disabledVentaModifica,
      posicion: "",
    });
  };

  handleRender = () => {
    const styleLabel = { width: "9rem" };
    return (
      <div className="row">
        <div className="col-md-4">
          <div
            className="PrincipalModifica p-4 m-3"
            style={{
              display:
                this.state.disabledVentaModifica === false ? "block" : "none",
            }}
          >
            <form>
              <h4 className="text-center mb-3">Modifica Monto</h4>
              <label style={{ width: "4rem" }}>Sucursal</label>
              <input
                style={{ maxWidth: "9rem" }}
                value={this.state.Sucursal}
                disabled
                readOnly
              />
              <br />
              <label style={{ width: "4rem" }}>Folio</label>
              <input
                style={{ width: "4rem", textAlign: "right", maxWidth: "9rem" }}
                value={this.state.FolioId}
                disabled
                readOnly
              />
              <br />
              <label style={{ width: "4rem" }}>Monto</label>

              <NumberFormat
                thousandSeparator={true}
                prefix={"$ "}
                allowNegative={false}
                onValueChange={(values) => {
                  //const { formattedValue, value} = values
                  const { value } = values;
                  if (value < 0) {
                    return;
                  }
                  this.setState({
                    Monto: value,
                  });
                }}
                style={{ width: "7rem", textAlign: "right", maxWidth: "9rem" }}
                value={this.state.Monto}
                disabled={this.state.disabledModifica}
              />
              <br />
              <label style={{ width: "4rem" }}>Comentarios</label>
              <textarea
                style={{ width: "18rem", textTransform: "uppercase" }}
                onChange={this.handleComentariosModifica}
                value={this.state.Comentarios}
                disabled={this.state.disabledModifica}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  marginTop: "15px",
                }}
              >
                <button
                  className="btn btn-success"
                  onClick={this.handleActualiza}
                  disabled={this.state.disabledBotonActualiza}
                >
                  Actualiza
                </button>
                <button
                  onClick={this.handleCerrarModifica}
                  className="btn btn-danger "
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>

          <div
            className="Principal"
            style={{
              display:
                this.state.disabledVentaModifica === false ? "none" : "block",
            }}
          >
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
            <input
              type="date"
              onChange={this.handleFecha}
              value={this.state.Fecha}
            />
            <br />

            <div style={{ textAlign: "right", marginRight: "40px" }}>
              <label
                htmlFor=""
                style={{ marginBottom: "0px", fontSize: ".7rem" }}
              >
                Comentarios
              </label>
            </div>
            <form>
              {this.state.SucursalesIngresos.map((element, i) => (
                <div key={1 + i} className="sucursalesDiv">
                  <label
                    htmlFor=""
                    key={100 + i}
                    style={{ width: "6.8rem", fontSize: ".8rem" }}
                  >
                    {element.Sucursal}
                  </label>
                  <span key={200 + i}>

                    <NumberFormat
                      thousandSeparator={true}
                      prefix={"$ "}
                      allowNegative={false}
                      value={element.Monto}
                      onValueChange={(values) => {
                        // const { formattedValue, value } = values;
                        const { value } = values;
                        let SucursalesIngresos = this.state.SucursalesIngresos;
                        SucursalesIngresos[i].Monto = value;
                        this.setState({
                          SucursalesIngresos: SucursalesIngresos,
                        });
                      }}
                      key={300 + i}
                      id={100 + i}
                      className="SucursalInputPrimera"
                      name={element.SucursalId}
                      style={{ width: "7rem", textAlign: "right" }}
                      autoComplete="off"
                      disabled={this.state.disabledFlag}
                    />

                    <input
                      key={400 + i}
                      onChange={this.handleComentarios}
                      value={element.Comentarios}
                      id={300 + i}
                      name={element.Comentarios}
                      autoComplete="off"
                      style={{
                        width: "4rem",
                        textTransform: "uppercase",
                        marginRight: "1px",
                      }}
                      disabled={this.state.disabledFlag}
                    />
                    <button
                      key={800 + i}
                      name={i}
                      onClick={this.handleModifica}
                      className="btn btn-warning btn-sm"
                      disabled={this.state.disabledBotonesModifica}
                    >
                      *
                    </button>
                  </span>
                </div>
              ))}
              <div
                className="totalesMesDia"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <label htmlFor="" style={{ width: "3.8rem" }}>
                  <strong style={{ fontSize: ".6rem" }}>Total Día</strong>
                </label>
                <input
                  style={{
                    fontSize: ".6rem",
                    width: "3.8rem",
                    position: "relative",
                    left: "-10px",
                    textAlign: "right",
                  }}
                  value={
                    "$ " + this.numberWithCommas(this.state.TotalDia.toFixed(0))
                  }
                  readOnly
                />

                <label htmlFor="" style={{ width: "3.8rem" }}>
                  <strong style={{ fontSize: ".6rem" }}>Total Mes</strong>
                </label>
                <input
                  style={{
                    fontSize: ".6rem",
                    width: "4.8rem",
                    position: "relative",
                    left: "-10px",
                    textAlign: "right",
                  }}
                  value={
                    "$ " + this.numberWithCommas(this.state.TotalMes.toFixed(0))
                  }
                  readOnly
                />
              </div>

              <div className="botonesPrincipal">
                <button
                  type="submit"
                  onClick={this.handleGrabar}
                  className="btn btn-success"
                  disabled={this.state.disabledBotonGrabar}
                >
                  Grabar
                </button>
                <button
                  onClick={this.handleCancelar}
                  className="btn btn-danger "
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>

          <div className="PrincipalDia">
            <h5 style={{ margin: "10px 0 0 10px" }}>
              Día{" "}
              <span className="badge badge-primary">
                <small>
                  $ {this.numberWithCommas(this.state.TotalDia.toFixed(0))}
                </small>
              </span>
            </h5>

            <div className="PrincipalDiaTabla01">
              <table className="table01">
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
                  {this.state.arregloVentasIngresos
                    .filter((e) => e.Fecha === this.state.Fecha)
                    .map((element, i) => (
                      <tr key={i}>
                        <td>{element.SucursalNombre}</td>
                        <td>{element.UnidadDeNegocioNombre}</td>
                        <td>{element.FolioId}</td>
                        <td>{element.Fecha.substring(0, 10)}</td>
                        <td>{element.CuentaContable}</td>
                        <td>{element.SubcuentaContable}</td>
                        <td style={{ textAlign: "right" }}>
                          {this.numberWithCommas(element.Monto)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="Secundario">
            <h5>
              Mes{" "}
              <span className="badge badge-primary">
                <small>
                  $ {this.numberWithCommas(this.state.TotalMes.toFixed(0))}
                </small>
              </span>
            </h5>
            <div className="SecundarioTabla02">
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
                  {this.state.arregloVentasIngresos.map((element, i) => (
                    <tr key={i}>
                      <td>{element.SucursalNombre}</td>
                      <td>{element.UnidadDeNegocioNombre}</td>
                      <td>{element.FolioId}</td>
                      <td>{element.Fecha.substring(0, 10)}</td>
                      <td>{element.CuentaContable}</td>
                      <td>{element.SubcuentaContable}</td>
                      <td style={{ textAlign: "right" }}>
                        {this.numberWithCommas(element.Monto)}
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
