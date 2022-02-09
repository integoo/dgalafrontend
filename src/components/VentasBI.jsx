import React, { Component } from "react";

import "./VentasBI.css";

import LineChart from "./LineChart";

class VentasBI extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Years: [],
      Year: 0,
      Meses: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
        "Total"
      ],
      ventas: [],
      egresos: [],
      ventasMelate: [],
      pagosMelate: [],
      utilidadPerdida: [],
      utilidadPerdidaLimpiaduriaPorcentaje: [],
      utilidadPerdidaMelate: [],
      utilidadPerdidaMelatePorcentaje: [],
      data: [],
      dataMelate: [],
      dataGastosInversiones: [],
      dataGastosInversionesTotales: [],
      banderaOrdenamiento: false,
      dataLimpiaduriaMelateRentasOtrosUtilidad: []
    };
  }

  async componentDidMount() {
    if ((await this.getConsultaAnios()) === false) return;
    if ((await this.getConsultaVentasPorMes()) === false) return;
    if ((await this.getConsultaEgresosPorMes()) === false) return;
    
    if ((await this.getConsultaVentasMelatePorMes()) === false) return;
    if ((await this.getConsultaPagosMelatePorMes()) === false) return;

    if ((await this.getGastosInversionesPorAnio()) === false) return;

    if ((await this.getLimpiaduriaMelateRentasOtrosUtilidad()) === false) return;

    this.handleUtilidadPerdida();
    this.handleArrayLineChart();
    this.handleArrayLineChartMelate();
  }

  getConsultaAnios = async () => {
    const url = this.props.url + `/api/consultaaniosactivos`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();

      this.setState({
        Years: data,
        Year: data[0].Year,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  
  getConsultaVentasPorMes = async () => {
    const Year = this.state.Year;
    const url = this.props.url + `/api/consultalimpiaduriaventaspormes/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();
      this.setState({
        ventas: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaEgresosPorMes = async () => {
    const Year = this.state.Year;
    const url =
      this.props.url + `/api/consultalimpiaduriaegresospormes/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();

      this.setState({
        egresos: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaVentasMelatePorMes = async () => {
    const Year = this.state.Year;
    const url = this.props.url + `/api/consultamelateventaspormes/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();

      this.setState({
        ventasMelate: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getConsultaPagosMelatePorMes = async () => {
    const Year = this.state.Year;
    const url =
      this.props.url + `/api/consultamelateegresospormes/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      const data = await response.json();

      this.setState({
        pagosMelate: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };

  getGastosInversionesPorAnio = async () => {
    const Year = this.state.Year;
    const url =
      this.props.url + `/api/gastosinversionesporanio/${Year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      let data = await response.json();


      let TotalEne = 0
      let TotalFeb = 0
      let TotalMar = 0
      let TotalAbr = 0
      let TotalMay = 0
      let TotalJun = 0
      let TotalJul = 0
      let TotalAgo = 0
      let TotalSep = 0
      let TotalOct = 0
      let TotalNov = 0
      let TotalDic = 0
      let TotalTotal = 0
      data.forEach(element =>{
        TotalEne += parseFloat(element.Ene)
        TotalFeb += parseFloat(element.Feb)
        TotalMar += parseFloat(element.Mar)
        TotalAbr += parseFloat(element.Abr)
        TotalMay += parseFloat(element.May)
        TotalJun += parseFloat(element.Jun)
        TotalJul += parseFloat(element.Jul)
        TotalAgo += parseFloat(element.Ago)
        TotalSep += parseFloat(element.Sep)
        TotalOct += parseFloat(element.Oct)
        TotalNov += parseFloat(element.Nov)
        TotalDic += parseFloat(element.Dic)
        TotalTotal += parseFloat(element.Total)
      })

      
      
      const json = {"CuentaContable": "Total",
      "SubcuentaContable": "Total",
      "Ene": TotalEne,
      "Feb": TotalFeb,
      "Mar": TotalMar,
      "Abr": TotalAbr,
      "May": TotalMay,
      "Jun": TotalJun,
      "Jul": TotalJul,
      "Ago": TotalAgo,
      "Sep": TotalSep,
      "Oct": TotalOct,
      "Nov": TotalNov,
      "Dic": TotalDic,
      "Total": TotalTotal,
      "PorcentajeSimple": 100,
    }
    let dataGastosInversionesTotales = []
    dataGastosInversionesTotales.push(json)
    
        for(let i = 0; i < data.length; i++){
          data[i].id = i
          data[i].PorcentajeSimple = Math.abs(parseFloat(data[i].Total)) / Math.abs(parseFloat(TotalTotal)) *100
        }
    this.setState({
      dataGastosInversiones: data,
      dataGastosInversionesTotales: dataGastosInversionesTotales,
      
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };


  getLimpiaduriaMelateRentasOtrosUtilidad = async () => {
    const year = this.state.Year;
    const url =
      this.props.url + `/api/limpiaduria/bi/estadoresultadoslimpiadurianegocios/${year}`;
    let bandera = false;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });

      let data = await response.json();

      let TotalEne = 0
      let TotalFeb = 0
      let TotalMar = 0
      let TotalAbr = 0
      let TotalMay = 0
      let TotalJun = 0
      let TotalJul = 0
      let TotalAgo = 0
      let TotalSep = 0
      let TotalOct = 0
      let TotalNov = 0
      let TotalDic = 0
      let TotalTotal = 0
      data.forEach(element =>{
        TotalEne += parseFloat(element.Ene)
        TotalFeb += parseFloat(element.Feb)
        TotalMar += parseFloat(element.Mar)
        TotalAbr += parseFloat(element.Abr)
        TotalMay += parseFloat(element.May)
        TotalJun += parseFloat(element.Jun)
        TotalJul += parseFloat(element.Jul)
        TotalAgo += parseFloat(element.Ago)
        TotalSep += parseFloat(element.Sep)
        TotalOct += parseFloat(element.Oct)
        TotalNov += parseFloat(element.Nov)
        TotalDic += parseFloat(element.Dic)
        TotalTotal += parseFloat(element.Total)
      })

      
      
      const json = {
      "Negocio": "ExtTotal",
      "Ene": TotalEne,
      "Feb": TotalFeb,
      "Mar": TotalMar,
      "Abr": TotalAbr,
      "May": TotalMay,
      "Jun": TotalJun,
      "Jul": TotalJul,
      "Ago": TotalAgo,
      "Sep": TotalSep,
      "Oct": TotalOct,
      "Nov": TotalNov,
      "Dic": TotalDic,
      "Total": TotalTotal,
    }
    data.push(json)
    
    this.setState({
      dataLimpiaduriaMelateRentasOtrosUtilidad: data,
      });
      bandera = true;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
    return bandera;
  };



  handleYear = (e) => {
    const Year = e.target.value;
    this.setState(
      {
        Year: Year,
        dataLimpiaduriaMelateRentasOtrosUtilidad:[],
      },
      async () => {
        if ((await this.getConsultaVentasPorMes()) === false) return;
        if ((await this.getConsultaEgresosPorMes()) === false) return;

        if ((await this.getConsultaVentasMelatePorMes()) === false) return;
        if ((await this.getConsultaPagosMelatePorMes()) === false) return;
    
        if ((await this.getGastosInversionesPorAnio()) === false) return;

        if ((await this.getLimpiaduriaMelateRentasOtrosUtilidad()) === false) return;
    
        this.handleUtilidadPerdida();
        this.handleArrayLineChart();
        this.handleArrayLineChartMelate();

      }
    );
  };

  handleUtilidadPerdida = () => {
    //VENTAS
    const ventas = this.state.ventas;
    const egresos = this.state.egresos;

    let resultado = 0;
    let utilidadPerdida = [];
    for (let i = 0; i < ventas.length; i++) {
      resultado = parseFloat(ventas[i].Monto) + parseFloat(egresos[i].Monto);
      utilidadPerdida.push(resultado);
    }

    resultado = 0;
    let utilidadPerdidaLimpiaduriaPorcentaje = [];
    for (let i = 0; i < ventas.length; i++) {
      resultado = (parseFloat(ventas[i].Monto) + parseFloat(egresos[i].Monto)) / parseFloat(ventas[i].Monto);
      if(parseFloat(ventas[i].Monto) === Math.abs(parseFloat(egresos[i].Monto))){
       resultado = 0
      }
      utilidadPerdidaLimpiaduriaPorcentaje.push(resultado);
    }

    //MELATE
    const ventasMelate = this.state.ventasMelate;
    const pagosMelate = this.state.pagosMelate;

    resultado = 0;
    let utilidadPerdidaMelate = [];
    for (let i = 0; i < ventasMelate.length; i++) {
      resultado = parseFloat(ventasMelate[i].Monto) + parseFloat(pagosMelate[i].Monto);
      utilidadPerdidaMelate.push(resultado);
    }

    resultado = 0;
    let utilidadPerdidaMelatePorcentaje = [];
    for (let i = 0; i < ventasMelate.length; i++) {
      resultado = (parseFloat(ventasMelate[i].Monto) + parseFloat(pagosMelate[i].Monto)) /          parseFloat(ventasMelate[i].Monto);
      if(parseFloat(ventasMelate[i].Monto) === Math.abs(parseFloat(pagosMelate[i].Monto))){
       resultado = 0
      }
      utilidadPerdidaMelatePorcentaje.push(resultado);
    }

    this.setState({
      utilidadPerdida: utilidadPerdida,
      utilidadPerdidaLimpiaduriaPorcentaje: utilidadPerdidaLimpiaduriaPorcentaje,
      utilidadPerdidaMelate: utilidadPerdidaMelate,
      utilidadPerdidaMelatePorcentaje: utilidadPerdidaMelatePorcentaje,
    });
  };

  handleArrayLineChart = () => {
    const ventas = this.state.ventas;
    const egresos = this.state.egresos;

    //Prepara Arreglo de VENTAS
    let arregloVentas = [];
    ventas.forEach((element) => arregloVentas.push(parseFloat(element.Monto)));
    arregloVentas = arregloVentas.filter(
      (element,i) => parseFloat(element) !== 0 && i <= 11  //Menor-Igual a 11 para sólo los meses y no el Total
    );

    //Prepara Arreglo de EGRESOS
    let arregloEgresos = [];
    egresos.forEach((element) =>
      arregloEgresos.push(parseFloat(element.Monto) * -1)
    );
    arregloEgresos = arregloEgresos.filter(
      (element,i) => parseFloat(element) !== 0 && i <= 11 //Menor-Igual a 11 para sólo los meses y no el Total
    );

    const data = {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      datasets: [
        {
          label: "$ Ventas",
          // data: [72000,63000,65000,64000,77500,79000,86300],
          data: arregloVentas,
          fill: false,
          backgroundColor: "rgb(3, 113, 13, 0.9  )",
          borderColor: "rgb(5, 198, 22, 0.9  )",
        },
        {
          label: "$ Gastos/Inversiones",
          //data: [42000,33000,35000,34000,47500,49000,46300,21000],
          data: arregloEgresos,
          fill: false,
          backgroundColor: "rgb(255, 99, 132, 0.9)",
          borderColor: "rgba(247, 6, 10, 0.8)",
        },
      ],
    };
    this.setState({
      data: data,
    });
  };

  handleArrayLineChartMelate = () => {
    const ventasMelate = this.state.ventasMelate;
    const pagosMelate = this.state.pagosMelate;

    //Prepara Arreglo de VENTAS Melate
    let arregloVentasMelate = [];
    ventasMelate.forEach((element) => arregloVentasMelate.push(parseFloat(element.Monto)));
    arregloVentasMelate = arregloVentasMelate.filter(
      (element,i) => parseFloat(element) !== 0 && i <= 11 //Menor-Igual a 11 para sólo los meses y no el Total
    );

    //Prepara Arreglo de Pagos Melate
    let arregloPagosMelate = [];
    pagosMelate.forEach((element) =>
      arregloPagosMelate.push(parseFloat(element.Monto) * -1)
    );
    arregloPagosMelate = arregloPagosMelate.filter(
      (element,i) => parseFloat(element) !== 0 && i <= 11 //Menor-Igual a 11 para sólo los meses y no el Total
    );

    const data = {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      datasets: [
        {
          label: "$ Ventas Melate",
          // data: [72000,63000,65000,64000,77500,79000,86300],
          data: arregloVentasMelate,
          fill: false,
          backgroundColor: "rgb(3, 113, 13, 0.9  )",
          borderColor: "rgb(5, 198, 22, 0.9  )",
        },
        {
          label: "$ Pagos Melate",
          //data: [42000,33000,35000,34000,47500,49000,46300,21000],
          data: arregloPagosMelate,
          fill: false,
          backgroundColor: "rgb(255, 99, 132, 0.9)",
          borderColor: "rgba(247, 6, 10, 0.8)",
        },
      ],
    };
    this.setState({
      dataMelate: data,
    });
  };

  handleOdenamientoGastosInversiones = (e) =>{
    let banderaOrdenamiento = e.target.checked
    let data = this.state.dataGastosInversiones

    if(banderaOrdenamiento){
      data = data.sort((a,b) => a.Total - b.Total)
    }else{
      data = data.sort((a,b) => a.id - b.id)
    }

    this.setState({
      dataGastosInversiones: data,
      banderaOrdenamiento: !this.state.banderaOrdenamiento,
    })

  }

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleRender = () => {
    return (
      <div className="container">
        <select onChange={this.handleYear} value={this.state.Year} id="idYears">
          {this.state.Years.map((element, i) => (
            <option key={i} value={element.Year}>
              {element.Year}
            </option>
          ))}
        </select>

        <h3>Limpiaduría</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>Ventas</td>
              {this.state.ventas.map((element, i) => (
                <td key={i}>
                  {this.numberWithCommas(parseFloat(element.Monto).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Egresos </td>
              {this.state.egresos.map((element, i) => (
                <td key={i}>
                  {this.numberWithCommas(
                    (parseFloat(element.Monto) * -1).toFixed(0)
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad </td>
              {this.state.utilidadPerdida.map((element, i) => (
                element >= 0 ?
                <td key={i}>
                  {this.numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {this.numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad % </td>
              {this.state.utilidadPerdidaLimpiaduriaPorcentaje.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {"% "+this.numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {"% "+this.numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <br />
        <LineChart data={this.state.data} />


        <br />
        <h3>Melate</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ textAlign: "center" }}>Ventas Melate</td>
              {this.state.ventasMelate.map((element, i) => (
                <td key={i}>
                  {this.numberWithCommas(parseFloat(element.Monto).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Pagos Melate </td>
              {this.state.pagosMelate.map((element, i) => (
                <td key={i}>
                  {this.numberWithCommas(
                    (parseFloat(element.Monto) * -1).toFixed(0)
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad Melate </td>
              {this.state.utilidadPerdidaMelate.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {this.numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {this.numberWithCommas(parseFloat(element).toFixed(0))}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ textAlign: "center" }}>Utilidad % </td>
              {this.state.utilidadPerdidaMelatePorcentaje.map((element, i) => (
                element > 0 ?
                <td key={i}>
                  {"% "+this.numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
                :
                <td key={i} style={{color:"red"}}>
                  {"% "+this.numberWithCommas((parseFloat(element) *100).toFixed(2))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <br />
        <LineChart data={this.state.dataMelate} />


        <br />
        <h3>Gastos e Inversión</h3>
        <span id="idSpanOrdenamientoTotal">
          <label htmlFor="idOrdenamientoTotal">Ordenar Por Total</label>
          <input onChange={this.handleOdenamientoGastosInversiones} type="checkbox" id="idOrdenamientoTotal" checked={this.state.banderaOrdenamiento}/>
        </span>

        <table style={{ width: "95%", marginTop:"-20px" }}>
          <thead>
            <tr>
              <th>Cuenta Contable</th>
              <th>Subcuenta Contable</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
                <th>% Simple</th>
            </tr>
          </thead>
          <tbody>
              {this.state.dataGastosInversiones.map((element, i) => (
            <tr key={i}>
                <td style={{textAlign:"left"}}>{element.CuentaContable}</td>
                <td style={{textAlign:"left"}}>{element.SubcuentaContable}</td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Ene)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Feb)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Mar)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Abr)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.May)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Jun)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Jul)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Ago)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Sep)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Oct)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Nov)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Dic)).toFixed(0))}
                </td>
                <td >
                  <b>{this.numberWithCommas(Math.abs(parseFloat(element.Total)).toFixed(0))}</b>
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.PorcentajeSimple)).toFixed(2))+"%"}
                </td>
            </tr>
              ))}
          </tbody>
        </table>



        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Cuenta Contable</th>
              <th>Subcuenta Contable</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
                <th>% Simple</th>
            </tr>
          </thead>
          <tbody>
              {this.state.dataGastosInversionesTotales.map((element, i) => (
            <tr key={i}>
                <td style={{textAlign:"left"}}>{element.CuentaContable}</td>
                <td style={{textAlign:"left"}}>{element.SubcuentaContable}</td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Ene)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Feb)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Mar)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Abr)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.May)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Jun)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Jul)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Ago)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Sep)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Oct)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Nov)).toFixed(0))}
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.Dic)).toFixed(0))}
                </td>
                <td >
                  <b>{this.numberWithCommas(Math.abs(parseFloat(element.Total)).toFixed(0))}</b>
                </td>
                <td >
                  {this.numberWithCommas(Math.abs(parseFloat(element.PorcentajeSimple)).toFixed(2))+"%"}
                </td>
            </tr>
              ))}
          </tbody>
        </table>
        <br />
        <br />





        <h3>Resultados Limpiaduría, Melate, Rentas y Otros Ingresos (Utilidad)</h3>

        <table style={{ width: "95%" }}>
          <thead>
            <tr>
              <th>Transacción</th>
              {this.state.Meses.map((element, i) => (
                <th key={i}>{element}</th>
                ))}
            </tr>
          </thead>
          <tbody>
                {this.state.dataLimpiaduriaMelateRentasOtrosUtilidad.map((element,i) =>(
                <tr>
                  <td>{element.Negocio}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Ene).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Feb).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Mar).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Abr).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.May).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Jun).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Jul).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Ago).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Sep).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Oct).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Nov).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Dic).toFixed(0))}</td>
                  <td>{this.numberWithCommas(parseFloat(element.Total).toFixed(0))}</td>
                </tr>
                ))}
          </tbody>
        </table>
        <br /> 




      </div>
    );
  };

  render() {
    return (
      this.state.dataLimpiaduriaMelateRentasOtrosUtilidad.length > 0  ? 
      <this.handleRender />
    : <h4>Loading . . .</h4>
    )
  }
}
export default VentasBI;
