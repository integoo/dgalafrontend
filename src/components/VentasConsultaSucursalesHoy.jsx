import React from 'react'

class VentasConsultaSucursalesHoy extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            detalles: [],
            GranTotalVenta:0,
            GranTotalVentaProyectada:0,
            CuotaTotal:0,
            LogroTotal:0,

            VentasTendenciaLimpiaduria: [],
            GranTotalVentaProyectadaLimpiaduria: 0,
            CuotaTotalLimpiaduria: 0,
            LogroTotalLimpiaduria: 0,
            FechaMaximaLimpiaduria:"",
            
            VentasTendenciaMelate: [],
            GranTotalVentaProyectadaMelate: 0,
            CuotaTotalMelate: 0,
            LogroTotalMelate: 0,
            FechaMaximaMelate:"",


            Periodos: [],
            PeriodoActual:"",
            Periodo: "",
            Hoy:"",
            Ayer:"",
            PrimerDiaMes: "",
            UltimoDiaMes:"",
            VentasTendencia:[],
            checkboxvalue: false,
            disabledvalue: false,
        }
    }

    async componentDidMount(){
        try{
            const url = this.props.url + `/api/ventassucursaleshoy`
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                alert(data.error)
                return
            }
            let GranTotalVenta=0
            data.forEach(element => {
                GranTotalVenta+= parseFloat(element.ExtVentaConImp)
            });
            this.setState({
                detalles: data,
                GranTotalVenta: GranTotalVenta,
            })
        }catch(error){
            alert(error.message)
            return
        }

        await this.handleConsultaPeriodos()
        await this.handleVentasMesYTendencia(this.state.checkboxvalue)
        await this.handleVentasMesYTendenciaLimpiaduria()
        await this.handleVentasMesYTendenciaMelate()
    }

    handleConsultaPeriodos = async() =>{
        const url = this.props.url + `/api/consultaperiodos`
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            this.setState({
                Periodos: data,
                Hoy: data[0].Hoy,
                Ayer: data[0].Ayer,
                PeriodoActual: data[0].Periodo,

                
                Periodo: data[0].Periodo,
                PrimerDiaMes: data[0].PrimerDiaMes,
                UltimoDiaMes: data[0].UltimoDiaMes,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }

    }

    handleVentasMesYTendencia = async(incluyeHoy)=>{

        //SI EL PERIODO ES EL ACTUAL
        const FechaInicial = this.state.PrimerDiaMes 
        let FechaFinal = this.state.Ayer
        const Hoy = this.state.Hoy
        const PeriodoActual = this.state.PeriodoActual
        const Periodo = this.state.Periodo
        const d = new Date(this.state.UltimoDiaMes)
        const DiasMes = parseInt(d.getDate())  //Dias que tiene el mes
        //SI es periodo actual y se quiere consultar la tendencia incluyendo el día de hoy
        if (incluyeHoy === true && PeriodoActual === Periodo ){
            FechaFinal = Hoy
        }


        // Si hoy es primero de mes
        if (FechaInicial === Hoy){
            FechaFinal = Hoy
        }
        
        // Si se quiere consultar un periodo anterior
        if(PeriodoActual !== Periodo){
            FechaFinal=this.state.UltimoDiaMes
        }

        const url = this.props.url + `/api/ventassucursalesperiodolavamatica/${FechaInicial}/${FechaFinal}/${DiasMes}`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            //####################################
            let GranTotalVentaProyectada = 0
            let CuotaTotal = 0
            let LogroTotal = 0
            for (let i =0; i < data.length; i++){
                GranTotalVentaProyectada += parseInt(data[i].VentaProyectada)
                CuotaTotal+= parseInt(data[i].Cuota)
            }

            if(CuotaTotal > 0){
                LogroTotal = GranTotalVentaProyectada / CuotaTotal * 100
            }else{
                LogroTotal = 100
            }
            //####################################
            this.setState({
                VentasTendencia: data,
                GranTotalVentaProyectada: GranTotalVentaProyectada,
                CuotaTotal: CuotaTotal,
                LogroTotal: LogroTotal,
            })

        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleVentasMesYTendenciaLimpiaduria = async ()=>{
        const UnidadDeNegocioId = 1 //Limpiaduria
              //SI EL PERIODO ES EL ACTUAL
              const FechaInicial = this.state.PrimerDiaMes 
              let FechaFinal = this.state.Ayer
              const Hoy = this.state.Hoy
              const PeriodoActual = this.state.PeriodoActual
              const Periodo = this.state.Periodo
              const d = new Date(this.state.UltimoDiaMes)
              const DiasMes = parseInt(d.getDate())  //Dias que tiene el mes
              //SI es periodo actual y se quiere consultar la tendencia incluyendo el día de hoy
              //if (incluyeHoy === true && PeriodoActual === Periodo ){
              //    FechaFinal = Hoy
              //}
      
      
              // Si hoy es primero de mes
              if (FechaInicial === Hoy){
                  FechaFinal = Hoy
              }
              
              // Si se quiere consultar un periodo anterior
              if(PeriodoActual !== Periodo){
                  FechaFinal=this.state.UltimoDiaMes
              }

        const url = this.props.url + `/api/ventassucursalesperiodounidaddenegocio/${FechaInicial}/${FechaFinal}/${DiasMes}/${UnidadDeNegocioId}`
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`
                }
            })
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            let GranTotalVentaProyectada = 0
            let CuotaTotal = 0 
            let LogroTotal = 0
            data.forEach((element) =>{
                GranTotalVentaProyectada += parseFloat(element.VentaProyectada)
                CuotaTotal += parseFloat(element.Cuota)
            })
            if(CuotaTotal === 0){
                LogroTotal = 0 
              }else{
                LogroTotal = GranTotalVentaProyectada /CuotaTotal * 100 
            }

            this.setState({
                VentasTendenciaLimpiaduria: data,
                GranTotalVentaProyectadaLimpiaduria: GranTotalVentaProyectada,
                CuotaTotalLimpiaduria: CuotaTotal,
                LogroTotalLimpiaduria: LogroTotal,
                FechaMaximaLimpiaduria: data[0].FechaMaxima,

            })

        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleVentasMesYTendenciaMelate = async ()=>{
        const UnidadDeNegocioId = 2 //Melate

        //SI EL PERIODO ES EL ACTUAL
        const FechaInicial = this.state.PrimerDiaMes 
        let FechaFinal = this.state.Ayer
        const Hoy = this.state.Hoy
        const PeriodoActual = this.state.PeriodoActual
        const Periodo = this.state.Periodo
        const d = new Date(this.state.UltimoDiaMes)
        const DiasMes = parseInt(d.getDate())  //Dias que tiene el mes
        //SI es periodo actual y se quiere consultar la tendencia incluyendo el día de hoy
        //if (incluyeHoy === true && PeriodoActual === Periodo ){
        //    FechaFinal = Hoy
        //}


        // Si hoy es primero de mes
        if (FechaInicial === Hoy){
            FechaFinal = Hoy
        }
        
        // Si se quiere consultar un periodo anterior
        if(PeriodoActual !== Periodo){
            FechaFinal=this.state.UltimoDiaMes
        }

  const url = this.props.url + `/api/ventassucursalesperiodounidaddenegocio/${FechaInicial}/${FechaFinal}/${DiasMes}/${UnidadDeNegocioId}`
  try{
      const response = await fetch(url,{
          headers:{
              Authorization: `Bearer ${this.props.accessToken}`
          }
      })
      const data = await response.json()
      if(data.error){
          console.log(data.error)
          alert(data.error)
          return
      }
      let GranTotalVentaProyectada = 0
      let CuotaTotal = 0 
      let LogroTotal = 0
      data.forEach((element) =>{
          GranTotalVentaProyectada += parseFloat(element.VentaProyectada)
          CuotaTotal += parseFloat(element.Cuota)
      })
      if(CuotaTotal === 0){
          LogroTotal = 0 
        }else{
          LogroTotal = GranTotalVentaProyectada /CuotaTotal * 100 
      }

      this.setState({
          VentasTendenciaMelate: data,
          GranTotalVentaProyectadaMelate: GranTotalVentaProyectada,
          CuotaTotalMelate: CuotaTotal,
          LogroTotalMelate: LogroTotal,
          FechaMaximaMelate: data[0].FechaMaxima,
      })

  }catch(error){
      console.log(error.message)
      alert(error.message)
  }
}

    handlePeriodo =(e)=>{
        const Periodo = e.target.value
        const PeriodoActual = this.state.PeriodoActual
        const arregloTemp = this.state.Periodos.filter(element => element.Periodo === Periodo)
        let banderaValue = false
        let checkboxValue = this.state.checkboxvalue


        if (Periodo !== PeriodoActual){
            banderaValue= true
            checkboxValue = false
        }

        this.setState({
            Periodo: Periodo,
            PrimerDiaMes: arregloTemp[0].PrimerDiaMes,
            UltimoDiaMes: arregloTemp[0].UltimoDiaMes,
            disabledvalue: banderaValue,
            checkboxvalue: checkboxValue,
        },()=>this.handleVentasMesYTendencia(this.state.checkboxvalue))
    }

    handlecheckbox =(e)=>{
        this.setState({
            checkboxvalue:!this.state.checkboxvalue,
        }, ()=> this.handleVentasMesYTendencia(this.state.checkboxvalue) )
        
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleRender = () =>{
        return(
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <span className="badge badge-primary">Lavamática/Tienda Venta HOY</span>
                            <table style={{marginBottom:"10px"}}>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>ExtVentaConImp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.detalles.map((element,i) =>(
                                        <tr key={i}>
                                            <td>{element.Sucursal}</td>
                                            <td  style={{textAlign:"right"}}>$ {this.numberWithCommas(element.ExtVentaConImp)}</td>
                                        </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="GranTotalVenta text-right">
                                <label htmlFor="" style={{fontSize:"0.7rem"}}><strong>Gran Total Venta</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.GranTotalVenta.toFixed(2))} id="grantotalventa" name="grantotalventa" style={{width:"7rem", textAlign:"right"}} readOnly />
                            </div>
                            <hr />
                            <span className="badge badge-primary mb-2"> Lavamática/Tienda Venta y Tendencia Mes</span>
                            <div>
                            <label htmlFor="" style={{width:"3rem",fontSize:".8rem"}}>Periodo</label>
                            <select onChange={this.handlePeriodo} value={this.state.Periodo}>
                                {this.state.Periodos.map((element,i) =>(
                                    <option key={i} value={element.Periodo}>{element.Periodo}</option>
                                    ))}
                            </select>
                                <input onChange={this.handlecheckbox} className="ml-3 mr-2" type="checkbox" defaultChecked={this.state.checkboxvalue} disabled={this.state.disabledvalue}/>
                                <label style={{fontSize:".7rem"}} htmlFor="">Incluir HOY en Tendencia</label>

                            </div>

                            <table style={{marginBottom:"10px"}}>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Venta</th>
                                        <th>Venta Proyectada</th>
                                        <th>Cuota Mes</th>
                                        <th>Diferencia $</th>
                                        <th>Logro %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.state.VentasTendencia.map((element,i) =>(
                                            <tr key={i}>
                                                <td>{element.Sucursal}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Venta))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.VentaProyectada))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Cuota))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.DiferenciaDinero))}</td>
                                                <td style={{textAlign:"right"}}>{element.DiferenciaPorcentaje}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="totalventaproyectada text-right" >
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Cuota</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.CuotaTotal.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Venta</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.GranTotalVentaProyectada.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Logro %</strong></label>
                                <input value={"% "+this.numberWithCommas(this.state.LogroTotal.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">



                            <span className="badge badge-primary">Limpiaduría Venta y Tendencia Mes</span>
                            <table style={{marginBottom:"10px"}}>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Venta</th>
                                        <th>Venta Proyectada</th>
                                        <th>Cuota Mes</th>
                                        <th>Diferencia $</th>
                                        <th>Logro %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.state.VentasTendenciaLimpiaduria.map((element,i) =>(
                                            <tr key={i}>
                                                <td>{element.Sucursal}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Venta))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.VentaProyectada))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Cuota))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.DiferenciaDinero))}</td>
                                                <td style={{textAlign:"right"}}>{element.DiferenciaPorcentaje}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="totalventaproyectada text-right" >
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Cuota</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.CuotaTotalLimpiaduria.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Venta</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.GranTotalVentaProyectadaLimpiaduria.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Logro %</strong></label>
                                <input value={"% "+this.numberWithCommas(this.state.LogroTotalLimpiaduria.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                {this.state.Ayer === this.state.FechaMaximaLimpiaduria 
                                ?
                                <p style={{fontSize:".5rem" }}>Ultima Actualizacion : {this.state.FechaMaximaLimpiaduria.substr(0,10)}</p>
                                :
                                <p style={{fontSize:".5rem",color:"red" }}>Ultima Actualizacion : {this.state.FechaMaximaLimpiaduria.substr(0,10)}</p>
                                }
                            </div>





                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            




                        <span className="badge badge-primary">Melate Venta y Tendencia Mes</span>
                            <table style={{marginBottom:"10px"}}>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>Venta</th>
                                        <th>Venta Proyectada</th>
                                        <th>Cuota Mes</th>
                                        <th>Diferencia $</th>
                                        <th>Logro %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                        {this.state.VentasTendenciaMelate.map((element,i) =>(
                                            <tr key={i}>
                                                <td>{element.Sucursal}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Venta))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.VentaProyectada))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.Cuota))}</td>
                                                <td style={{textAlign:"right"}}>{this.numberWithCommas(parseInt(element.DiferenciaDinero))}</td>
                                                <td style={{textAlign:"right"}}>{element.DiferenciaPorcentaje}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="totalventaproyectada text-right" >
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Cuota</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.CuotaTotalMelate.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Total Venta</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.GranTotalVentaProyectadaMelate.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                <label htmlFor="" style={{width:"12rem"}}><strong>Logro %</strong></label>
                                <input value={"% "+this.numberWithCommas(this.state.LogroTotalMelate.toFixed(2))} id="grantotalventaproyectada" name="grantotalventaproyectada" style={{width:"7rem", textAlign:"right"}} readOnly />
                                {this.state.Ayer === this.state.FechaMaximaMelate 
                                ?
                                <p style={{fontSize:".5rem" }}>Ultima Actualizacion : {this.state.FechaMaximaMelate.substr(0,10)}</p>
                                :
                                <p style={{fontSize:".5rem",color:"red" }}>Ultima Actualizacion : {this.state.FechaMaximaMelate.substr(0,10)}</p>
                                }

                            </div>









                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render(){
        return(
            <React.Fragment>
                <div className="container">
                    {this.state.VentasTendencia ? <this.handleRender /> : <h1>Loading ...</h1>}
                </div>
            </React.Fragment>
        )
    }
}

export default VentasConsultaSucursalesHoy;