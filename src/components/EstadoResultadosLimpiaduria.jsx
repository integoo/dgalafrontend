import React from "react";

import "./EstadoResultadosLimpiaduria.css";

class EstadoResultadosLimpiaduria extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      Fecha: "",
      Periodo: "",
      PeriodoAbierto: "",
      PeriodoAbiertoPrimerDia: "",
      PeriodoAbiertoUltimoDia: "",
      Periodos: [],
      Ayer: "",
      detallesLimpiaduria: [],
      detallesMelate: [],

      GastosPlanta: 0,
      GastosPlantaCifraControl: 0,
      detallesUtilidadOperacionConMelate: [],
      UtilidadDeOperacionConMelate: 0,
      RentasEmpresa: 0,
      OtrosGastosEmpresa: 0,
      UAIR: 0,
      CifraControlTotal: 0,

      detallesGastosInversiones:[],

      selectedOption:"Fecha",
      TotalMovimientos:0,
    };
  }

  async componentDidMount() {
    if ((await this.fechaActual()) === false) return;
    if ((await this.getPeriodoAbierto()) === false) return;
    if ((await this.getConsultaPeriodos()) === false) return;
    if ((await this.getGastosInversionperiodo()) === false) return;
    

    await this.handleEstadoDeResultados();
  }

  fechaActual = async () => {
    let Fecha;
    let bandera = false;
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
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getPeriodoAbierto = async () => {
    const url = this.props.url + `/periodoabierto`;
    //let Fecha = this.state.Fecha;
    let PeriodoAbierto;
    let PeriodoAbiertoPrimerDia;
    let PeriodoAbiertoUltimoDia;
    let bandera = false;
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

      //   if(Fecha > PeriodoAbiertoUltimoDia){
      //     Fecha = PeriodoAbiertoUltimoDia
      //   }
      this.setState({
        PeriodoAbierto: PeriodoAbierto,
        PeriodoAbiertoPrimerDia: PeriodoAbiertoPrimerDia,
        PeriodoAbiertoUltimoDia: PeriodoAbiertoUltimoDia,
        //Fecha: Fecha,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getRegistroContableCifraControl = async() =>{
    const Periodo = this.state.Periodo
    const url = this.props.url + `/api/estadoderesultadoslimpiaduriacifracontrol/${Periodo}`
    let bandera = false 
    try{
        const response = await fetch(url,{
            headers:{
                Authorization: `Bearer ${this.props.accessToken}`,
            },
        })
        const data = await response.json()
        if(data.error){
            console.log(data.error)
            alert(data.error)
            return bandera
        }
        this.setState({
            CifraControlTotal: data[0].Monto
        })
        bandera = true

    }catch(error){
        console.log(error.message)
        alert(error.message)
    }
    return bandera
  }

  getConsultaPeriodos = async () => {
    const url = this.props.url + `/api/consultaperiodosregistrocontable`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();

      this.setState({
        Periodos: data,
        Ayer: data[0].Ayer,
        Periodo: data[0].Periodo,

        //Hoy: data[0].Hoy,
        //Periodo: data[0].Periodo,
        //PrimerDiaMes: data[0].PrimerDiaMes,
        //UltimoDiaMes: data[0].UltimoDiaMes,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getGastosInversionperiodo = async()=>{
    let bandera = false
    const Periodo = this.state.Periodo
    const url = this.props.url+ `/api/consultagastosinversionperiodo/${Periodo}`
    let data=[]
    try{
      const response = await fetch(url, {
        headers:{
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      })
      data = await response.json()
      if(data.error){
        console.log(data.error)
        alert(data.error)
        return bandera
      }
      let suma = 0
      for(let i =0; i < data.length; i++){
        data[i].Posicion = i
        suma+= parseFloat(data[i].Monto)
      }
      this.setState({
        detallesGastosInversiones: data,
        TotalMovimientos: suma,
      })
      bandera = true
    }catch(error){
      console.log(error.message)
      alert(error.message)
    }
    return bandera
  }

  handlePeriodoCambio = (e) => {
    e.preventDefault();
    const Periodo = e.target.value;
    this.setState(
      {
        Periodo: Periodo,
      },
      () => {
        this.getGastosInversionperiodo()
        this.handleEstadoDeResultados()
      }
    );
  };

  handleEstadoDeResultados = async () => {
    const Periodo = this.state.Periodo;
    const url =
      this.props.url + `/api/estadoderesultadoslimpiaduria/${Periodo}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();

      //################### PREPARA ESTADO DE RESULTADOS DE LIMPIADURIA ##########################
      let dataLimpiaduria = [];
      for (let i = 0; i < 5; i++) {
        dataLimpiaduria.push(data[i]);
      }

      //Total Ventas Sucursales
      const TotalVentas = parseFloat(dataLimpiaduria[0].Suc01) + parseFloat(dataLimpiaduria[0].Suc02) 
        + parseFloat(dataLimpiaduria[0].Suc03) + parseFloat(dataLimpiaduria[0].Suc04)
       + parseFloat(dataLimpiaduria[0].Suc05) + parseFloat(dataLimpiaduria[0].Suc06)

       dataLimpiaduria[0].Total = TotalVentas

       //Prorrateo de Gastos Planta Matriz por cada Sucursal de acuerdo a su venta
       const GastosPlanta = dataLimpiaduria[1].Suc01 
       const GastosPlantaSuc01 = parseFloat(dataLimpiaduria[0].Suc01) / TotalVentas * GastosPlanta
       const GastosPlantaSuc02 = parseFloat(dataLimpiaduria[0].Suc02) / TotalVentas * GastosPlanta
       const GastosPlantaSuc03 = parseFloat(dataLimpiaduria[0].Suc03) / TotalVentas * GastosPlanta
       const GastosPlantaSuc04 = parseFloat(dataLimpiaduria[0].Suc04) / TotalVentas * GastosPlanta
       const GastosPlantaSuc05 = parseFloat(dataLimpiaduria[0].Suc05) / TotalVentas * GastosPlanta
       const GastosPlantaSuc06 = parseFloat(dataLimpiaduria[0].Suc06) / TotalVentas * GastosPlanta

       dataLimpiaduria[1].Suc01 = GastosPlantaSuc01
       dataLimpiaduria[1].Suc02 = GastosPlantaSuc02
       dataLimpiaduria[1].Suc03 = GastosPlantaSuc03
       dataLimpiaduria[1].Suc04 = GastosPlantaSuc04
       dataLimpiaduria[1].Suc05 = GastosPlantaSuc05
       dataLimpiaduria[1].Suc06 = GastosPlantaSuc06

       const GastosPlantaCifraControl = parseFloat(dataLimpiaduria[1].Suc01)
       + parseFloat(dataLimpiaduria[1].Suc02)
       + parseFloat(dataLimpiaduria[1].Suc03)
       + parseFloat(dataLimpiaduria[1].Suc04)
       + parseFloat(dataLimpiaduria[1].Suc05)
       + parseFloat(dataLimpiaduria[1].Suc06)

       dataLimpiaduria[1].Total = GastosPlantaCifraControl

       //Valida que los GastosPlanta (DB) menos los GastosPlantaCifraControl (Prorrateados) 
       //no sea mayor a 1 peso de diferencia
       if(Math.abs(parseFloat(GastosPlanta)) - Math.abs(parseFloat(GastosPlantaCifraControl)) > 1){
           alert("Diferencia en Gastos Planta Matriz Prorrateados : "+ GastosPlanta + " "+ GastosPlantaCifraControl)
       }

       //Utilidad Bruta
       dataLimpiaduria[2].Suc01 = parseFloat(dataLimpiaduria[0].Suc01) + parseFloat(dataLimpiaduria[1].Suc01)
       dataLimpiaduria[2].Suc02 = parseFloat(dataLimpiaduria[0].Suc02) + parseFloat(dataLimpiaduria[1].Suc02)
       dataLimpiaduria[2].Suc03 = parseFloat(dataLimpiaduria[0].Suc03) + parseFloat(dataLimpiaduria[1].Suc03)
       dataLimpiaduria[2].Suc04 = parseFloat(dataLimpiaduria[0].Suc04) + parseFloat(dataLimpiaduria[1].Suc04)
       dataLimpiaduria[2].Suc05 = parseFloat(dataLimpiaduria[0].Suc05) + parseFloat(dataLimpiaduria[1].Suc05)
       dataLimpiaduria[2].Suc06 = parseFloat(dataLimpiaduria[0].Suc06) + parseFloat(dataLimpiaduria[1].Suc06)
       dataLimpiaduria[2].Total = parseFloat(dataLimpiaduria[0].Total) + parseFloat(dataLimpiaduria[1].Total)

       //Gastos Sucursal
       const TotalGastosSucursal = parseFloat(dataLimpiaduria[3].Suc01)
                                    + parseFloat(dataLimpiaduria[3].Suc02)
                                    + parseFloat(dataLimpiaduria[3].Suc03)
                                    + parseFloat(dataLimpiaduria[3].Suc04)
                                    + parseFloat(dataLimpiaduria[3].Suc05)
                                    + parseFloat(dataLimpiaduria[3].Suc06)
       dataLimpiaduria[3].Total = TotalGastosSucursal

       //Utilidad de Operación
       dataLimpiaduria[4].Suc01 = parseFloat(dataLimpiaduria[2].Suc01) + parseFloat(dataLimpiaduria[3].Suc01)
       dataLimpiaduria[4].Suc02 = parseFloat(dataLimpiaduria[2].Suc02) + parseFloat(dataLimpiaduria[3].Suc02)
       dataLimpiaduria[4].Suc03 = parseFloat(dataLimpiaduria[2].Suc03) + parseFloat(dataLimpiaduria[3].Suc03)
       dataLimpiaduria[4].Suc04 = parseFloat(dataLimpiaduria[2].Suc04) + parseFloat(dataLimpiaduria[3].Suc04)
       dataLimpiaduria[4].Suc05 = parseFloat(dataLimpiaduria[2].Suc05) + parseFloat(dataLimpiaduria[3].Suc05)
       dataLimpiaduria[4].Suc06 = parseFloat(dataLimpiaduria[2].Suc06) + parseFloat(dataLimpiaduria[3].Suc06)
       dataLimpiaduria[4].Total = parseFloat(dataLimpiaduria[2].Total) + parseFloat(dataLimpiaduria[3].Total)

       //const UtilidadDeOperacionConMelate = dataLimpiaduria[4].Total
      //################### PREPARA ESTADO DE RESULTADOS DE MELATE ##########################
      let dataMelate = [];
      for (let i = 5; i < 9; i++) {
        dataMelate.push(data[i]);
      }

      //Totales Melate
      dataMelate[0].Total = parseFloat(dataMelate[0].Suc01)
                            + parseFloat(dataMelate[0].Suc02)
                            + parseFloat(dataMelate[0].Suc03)
                            + parseFloat(dataMelate[0].Suc04)
                            + parseFloat(dataMelate[0].Suc05)
                            + parseFloat(dataMelate[0].Suc06)

      //Totales Melate Pagos
      dataMelate[1].Total = parseFloat(dataMelate[1].Suc01)
                            + parseFloat(dataMelate[1].Suc02)
                            + parseFloat(dataMelate[1].Suc03)
                            + parseFloat(dataMelate[1].Suc04)
                            + parseFloat(dataMelate[1].Suc05)
                            + parseFloat(dataMelate[1].Suc06)

      //Totales Melate Pagos Clientes
      dataMelate[2].Total = parseFloat(dataMelate[2].Suc01)
                            + parseFloat(dataMelate[2].Suc02)
                            + parseFloat(dataMelate[2].Suc03)
                            + parseFloat(dataMelate[2].Suc04)
                            + parseFloat(dataMelate[2].Suc05)
                            + parseFloat(dataMelate[2].Suc06)

      //Utilidad Melate 
      dataMelate[3].Suc01 = parseFloat(dataMelate[0].Suc01) + parseFloat(dataMelate[1].Suc01) + parseFloat(dataMelate[2].Suc01)
      dataMelate[3].Suc02 = parseFloat(dataMelate[0].Suc02) + parseFloat(dataMelate[1].Suc02) + parseFloat(dataMelate[2].Suc02)
      dataMelate[3].Suc03 = parseFloat(dataMelate[0].Suc03) + parseFloat(dataMelate[1].Suc03) + parseFloat(dataMelate[2].Suc03)
      dataMelate[3].Suc04 = parseFloat(dataMelate[0].Suc04) + parseFloat(dataMelate[1].Suc04) + parseFloat(dataMelate[2].Suc04)
      dataMelate[3].Suc05 = parseFloat(dataMelate[0].Suc05) + parseFloat(dataMelate[1].Suc05) + parseFloat(dataMelate[2].Suc05)
      dataMelate[3].Suc06 = parseFloat(dataMelate[0].Suc06) + parseFloat(dataMelate[1].Suc06) + parseFloat(dataMelate[2].Suc06)
      dataMelate[3].Total = parseFloat(dataMelate[0].Total) + parseFloat(dataMelate[1].Total) + parseFloat(dataMelate[2].Total)
      //############################ UTILIDAD DE OPERACION CON MELATE ##########################
      const json = {
          Concepto: "** UTILIDAD DE OPERACION CON MELATE",
          Suc01: parseFloat(dataLimpiaduria[4].Suc01) + parseFloat(dataMelate[3].Suc01),
          Suc02: parseFloat(dataLimpiaduria[4].Suc02) + parseFloat(dataMelate[3].Suc02),
          Suc03: parseFloat(dataLimpiaduria[4].Suc03) + parseFloat(dataMelate[3].Suc03),
          Suc04: parseFloat(dataLimpiaduria[4].Suc04) + parseFloat(dataMelate[3].Suc04),
          Suc05: parseFloat(dataLimpiaduria[4].Suc05) + parseFloat(dataMelate[3].Suc05),
          Suc06: parseFloat(dataLimpiaduria[4].Suc06) + parseFloat(dataMelate[3].Suc06),
          Total: parseFloat(dataLimpiaduria[4].Total) + parseFloat(dataMelate[3].Total),
      }
      const dataUtilidadOperacionConMelate =  []
      dataUtilidadOperacionConMelate.push(json)

      const UtilidadDeOperacionConMelate = json.Total

      //############################ OTROS INGRESOS OTROS GASTOS ###############################
    //   let dataOtros = [];
    //   for (let i = 9; i < 11; i++) {
    //     dataOtros.push(data[i]);
    //   }
      const RentasEmpresa = data[9].Suc01 
      const OtrosGastosEmpresa = data[10].Suc01
      const UAIR = parseFloat(UtilidadDeOperacionConMelate) + parseFloat(RentasEmpresa) + parseFloat(OtrosGastosEmpresa)
      
      //##########################################################################################
      this.setState({
        detallesLimpiaduria: dataLimpiaduria,
        detallesMelate: dataMelate,
        GastosPlanta: GastosPlanta,
        GastosPlantaCifraControl: GastosPlantaCifraControl,
        detallesUtilidadOperacionConMelate: dataUtilidadOperacionConMelate,
        UtilidadDeOperacionConMelate: UtilidadDeOperacionConMelate,
        RentasEmpresa: RentasEmpresa,
        OtrosGastosEmpresa: OtrosGastosEmpresa,
        UAIR: UAIR,
      });

      if ((await this.getRegistroContableCifraControl()) === false) return;

    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };


  handleOptionChange = (e) =>{
    const option = e.target.value 
    let detallesGastosInversiones = this.state.detallesGastosInversiones

    if (option === "Fecha"){
      detallesGastosInversiones = detallesGastosInversiones.sort((a,b) => a.Posicion - b.Posicion)
    }
    if (option === "Sucursal"){
      detallesGastosInversiones = detallesGastosInversiones.sort((a,b) => a.SucursalId - b.SucursalId)
    }
    if (option === "CuentaContable"){
      detallesGastosInversiones = detallesGastosInversiones.sort((a,b) => a.CuentaContableId - b.CuentaContableId)
    }
    if (option === "Monto"){
      detallesGastosInversiones = detallesGastosInversiones.sort((a,b) => b.Monto - a.Monto)
    }

    this.setState({
      detallesGastosInversiones: detallesGastosInversiones,
      selectedOption: e.target.value,
    })
  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleRender = () => {
    return (
      <div>
        <form>
            <h2>Estados de Resultados</h2>
            <span id="idHeader">
                <label htmlFor="idPeriodo" style={{ width: "3rem" }}>
                <strong>Periodo</strong>
                </label>
                <select
                    onChange={this.handlePeriodoCambio}
                    value={this.state.Periodo}
                    id="idPeriodo"
                    >
                    {this.state.Periodos.map((element, i) => (
                        <option key={i} value={element.Periodo}>
                        {element.Periodo}
                        </option>
                    ))}
                </select>
            </span>
        </form>
        <h5>Limpiaduría</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}> 01 San Pedro</th>
              <th style={{width:"8rem"}}> 02 Limón</th>
              <th style={{width:"8rem"}}> 03 Santa María</th>
              <th style={{width:"8rem"}}> 04 SAD</th>
              <th style={{width:"8rem"}}> 05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}> 06 Nueva Sucursal</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.detallesLimpiaduria.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>
                    {i === 2 || i === 4 ? <strong>{element.Concepto}</strong> : element.Concepto}
                    </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                   { i === 2 || i === 4?
                  <strong>{this.numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                  :
                  this.numberWithCommas(parseFloat(element.Total).toFixed(2))
                   }
                </td>
              </tr>
                
            ))}
          </tbody>
        </table>
        <br />
        <h5>Melate</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}>01 San Pedro</th>
              <th style={{width:"8rem"}}>02 Limón</th>
              <th style={{width:"8rem"}}>03 Santa María</th>
              <th style={{width:"8rem"}}>04 SAD</th>
              <th style={{width:"8rem"}}>05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>06 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.detallesMelate.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}>{ i=== 3 ? <strong>{element.Concepto}</strong> : element.Concepto}</td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                    {i === 3 ?
                        <strong>{this.numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                        :
                        this.numberWithCommas(parseFloat(element.Total).toFixed(2))
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h5>Utilidad de Operación Con Melate</h5>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Concepto</th>
              <th style={{width:"8rem"}}>01 San Pedro</th>
              <th style={{width:"8rem"}}>02 Limón</th>
              <th style={{width:"8rem"}}>03 Santa María</th>
              <th style={{width:"8rem"}}>04 SAD</th>
              <th style={{width:"8rem"}}>05 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>06 Nueva Sucursal</th>
              <th style={{width:"8rem"}}>Total</th>
            </tr>
          </thead>
          <tbody>
            {this.state.detallesUtilidadOperacionConMelate.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}><strong>{element.Concepto}</strong></td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc01).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc02).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc03).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc04).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc05).toFixed(2))}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Suc06).toFixed(2))}
                </td>
                <td>
                    {i === 0 ?
                  <strong>{this.numberWithCommas(parseFloat(element.Total).toFixed(2))}</strong>
                  :
                  this.numberWithCommas(parseFloat(element.Total).toFixed(2))
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <h5 id="idOtrosIngresosGastos">Otros Ingresos/Gastos</h5>
        <div className="otrosingresosgastos">
            <div>
                <label htmlFor="" style={{width:"10rem"}}>Rentas Empresa</label>
                <input style={{width:"6rem",textAlign:"right"}} value={this.numberWithCommas(parseFloat(this.state.RentasEmpresa).toFixed(2))} readOnly/>
                <br />
                <label htmlFor="" style={{width:"10rem"}}>Otros Gastos Empresa</label>
                <input style={{width:"6rem",textAlign:"right"}} value={this.numberWithCommas(parseFloat(this.state.OtrosGastosEmpresa).toFixed(2))} readOnly/>
                <br />
                <label htmlFor="" style={{width:"10rem"}}><strong>UAIR</strong></label>
                <input style={{width:"6rem",textAlign:"right",fontWeight:"bold"}} value={this.numberWithCommas(parseFloat(this.state.UAIR).toFixed(2))} readOnly/>
                <br />
                <br />
                <label htmlFor="" style={{width:"10rem"}}>Cifra Control</label>
                <input style={{width:"6rem",textAlign:"right"}} value={this.numberWithCommas(parseFloat(this.state.CifraControlTotal).toFixed(2))} readOnly/>
            </div>
        </div>







        <br />
        <h5>Movimientos Detalle</h5>
        <span id="idOrdenamientoRadioGroup">
          <h6>Ordenamiento</h6>
          <input type="radio" id="Fecha" name="orderGI" value="Fecha" checked={this.state.selectedOption === "Fecha"} onChange={this.handleOptionChange} />
          <label htmlFor="Fecha" style={{marginLeft:"5px"}}>Fecha Hora</label>
          <br />
          <input type="radio" id="Sucursal" name="orderGI" value="Sucursal" checked={this.state.selectedOption === "Sucursal"} onChange={this.handleOptionChange} />
          <label htmlFor="Sucursal" style={{marginLeft:"5px"}}>Sucursal</label>
          <br />
          <input type="radio" id="CuentaContable" name="orderGI" value="CuentaContable" checked={this.state.selectedOption === "CuentaContable"} onChange={this.handleOptionChange} />
          <label htmlFor="CuentaContable" style={{marginLeft:"5px"}}>Cuenta Contable</label>
          <br />
          <input type="radio" id="Monto" name="orderGI" value="Monto" checked={this.state.selectedOption === "Monto"} onChange={this.handleOptionChange} />
          <label htmlFor="Monto" style={{marginLeft:"5px"}}>Monto</label>
        </span>
        <table>
          <thead>
            <tr style={{ background: "#33FF90" }}>
              <th style={{width:"20rem"}}>Sucursal</th>
              <th style={{width:"20rem"}}>Unidad De Negocio</th>
              <th style={{width:"8rem"}}>Cuenta Contable</th>
              <th style={{width:"8rem"}}>Subcuenta Contable</th>
              <th style={{width:"8rem"}}>Comentarios</th>
              <th style={{width:"8rem"}}>Monto</th>
              <th style={{width:"8rem"}}>Fecha Hora</th>
              <th style={{width:"8rem"}}>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {this.state.detallesGastosInversiones.map((element, i) => (
              <tr key={i}>
                <td style={{ textAlign: "left" }}><strong>{element.Sucursal}</strong></td>
                <td style={{ textAlign: "left" }}><strong>{element.UnidadDeNegocio}</strong></td>
                <td style={{textAlign: "left"}}>
                  {element.CuentaContable}
                </td>
                <td style={{textAlign:"left"}}>
                  {element.SubcuentaContable}
                </td>
                <td style={{textAlign:"left"}}>
                  {element.Comentarios}
                </td>
                <td>
                  {this.numberWithCommas(parseFloat(element.Monto).toFixed(2))}
                </td>
                <td>
                  {element.FechaHora}
                </td>
                <td>
                  {element.Usuario}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <span className="totalMovimientos">
          <label htmlFor="TotaGI" style={{width:"13rem"}}><b>Total Movimientos Detalle</b></label>
          <input style={{width:"8rem", textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.TotalMovimientos.toFixed(2))} readOnly/>
        </span>









      </div>
    );
  };

  render() {
    return (
      <div className="container">
        {this.state.Periodos.length > 0 ? (
          <this.handleRender />
        ) : (
          <h3>Loading ...</h3>
        )}
      </div>
    );
  }
}

export default EstadoResultadosLimpiaduria;
