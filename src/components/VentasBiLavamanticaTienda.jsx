import React from 'react'

import './VentasBiLavamaticaTienda.css'

class VentasBiLavamanticaTienda extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            Years: [],
            Year: 0,
            detallesLavamatica:[],
            detallesTienda:[],
            detallesDecorafiestas:[],
        }
    }

    componentDidMount = async()=>{

        if ((await this.getConsultaAnios()) === false) return;
        if ((await this.getDetallesLavamatica()) === false) return;
        if ((await this.getDetallesTienda()) === false) return;
        if ((await this.getDetallesDecorafiestas()) === false) return;

    }


    handleMesesColumnas = (data,transaccion) =>{
        let monto = 0
        let json={
            Transaccion:transaccion,
        }
        data.filter(e => e.Transaccion === transaccion).forEach(element => {
            monto = monto + parseFloat(element.Monto)
            if(element.Mes === 1){
                json.Ene = parseFloat(element.Monto)
            }
            if(element.Mes === 2){
                json.Feb = parseFloat(element.Monto)
            }
            if(element.Mes === 3){
                json.Mar = parseFloat(element.Monto)
            }
            if(element.Mes === 4){
                json.Abr = parseFloat(element.Monto)
            }
            if(element.Mes === 5){
                json.May = parseFloat(element.Monto)
            }
            if(element.Mes === 6){
                json.Jun = parseFloat(element.Monto)
            }
            if(element.Mes === 7){
                json.Jul = parseFloat(element.Monto)
            }
            if(element.Mes === 8){
                json.Ago = parseFloat(element.Monto)
            }
            if(element.Mes === 9){
                json.Sep = parseFloat(element.Monto)
            }
            if(element.Mes === 10){
                json.Oct = parseFloat(element.Monto)
            }
            if(element.Mes === 11){
                json.Nov = parseFloat(element.Monto)
            }
            if(element.Mes === 12){
                json.Dic = parseFloat(element.Monto)
            }
        });
        json.Total = parseFloat(monto)

        return json;
    }

    getDetallesLavamatica = async () => {
        const year = this.state.Year
        const url = this.props.url+`/api/ventas/bi/lavamatica/${year}`
        let bandera = false;
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }

            bandera = true;


            let arregloRegistro = []
            let json;
            
            json = this.handleMesesColumnas(data,'VentasConImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Impuestos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'VentasSinImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'CostoDeVentas')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'UtilidadBruta')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Egresos')
            arregloRegistro.push(json)

            json = this.handleMesesColumnas(data,'ComisionesVenta')
            arregloRegistro.push(json)

            json = this.handleMesesColumnas(data,'UtilidadNeta')
            arregloRegistro.push(json)





//############################## % Utilidad Neta ###############################
            json={
                Transaccion:"% UtilidadNeta",
                }
            json.Ene = arregloRegistro[6].Ene / arregloRegistro[2].Ene *100 || 0
            json.Feb = arregloRegistro[6].Feb / arregloRegistro[2].Feb *100 || 0
            json.Mar = arregloRegistro[6].Mar / arregloRegistro[2].Mar *100 || 0
            json.Abr = arregloRegistro[6].Abr / arregloRegistro[2].Abr *100 || 0
            json.May = arregloRegistro[6].May / arregloRegistro[2].May *100 || 0
            json.Jun = arregloRegistro[6].Jun / arregloRegistro[2].Jun *100 || 0
            json.Jul = arregloRegistro[6].Jul / arregloRegistro[2].Jul *100 || 0
            json.Ago = arregloRegistro[6].Ago / arregloRegistro[2].Ago *100 || 0
            json.Sep = arregloRegistro[6].Sep / arregloRegistro[2].Sep *100 || 0
            json.Oct = arregloRegistro[6].Oct / arregloRegistro[2].Oct *100 || 0
            json.Nov = arregloRegistro[6].Nov / arregloRegistro[2].Nov *100 || 0
            json.Dic = arregloRegistro[6].Dic / arregloRegistro[2].Dic *100 || 0
            json.Total = arregloRegistro[6].Total / arregloRegistro[2].Total *100 || 0

            arregloRegistro.push(json)


            this.setState({
                detallesLavamatica: arregloRegistro,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return bandera
    }



    getDetallesTienda = async () => {
        const year = this.state.Year
        const url = this.props.url+`/api/ventas/bi/tienda/${year}`
        let bandera = false;
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }

            bandera = true;


            let arregloRegistro = []
            let json;
            
            json = this.handleMesesColumnas(data,'VentasConImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Impuestos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'VentasSinImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'CostoDeVentas')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'UtilidadBruta')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Egresos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'UtilidadNeta')
            arregloRegistro.push(json)





//############################## % Utilidad Neta ###############################
            json={
                Transaccion:"% UtilidadNeta",
                }
            json.Ene = arregloRegistro[6].Ene / arregloRegistro[2].Ene *100 || 0
            json.Feb = arregloRegistro[6].Feb / arregloRegistro[2].Feb *100 || 0
            json.Mar = arregloRegistro[6].Mar / arregloRegistro[2].Mar *100 || 0
            json.Abr = arregloRegistro[6].Abr / arregloRegistro[2].Abr *100 || 0
            json.May = arregloRegistro[6].May / arregloRegistro[2].May *100 || 0
            json.Jun = arregloRegistro[6].Jun / arregloRegistro[2].Jun *100 || 0
            json.Jul = arregloRegistro[6].Jul / arregloRegistro[2].Jul *100 || 0
            json.Ago = arregloRegistro[6].Ago / arregloRegistro[2].Ago *100 || 0
            json.Sep = arregloRegistro[6].Sep / arregloRegistro[2].Sep *100 || 0
            json.Oct = arregloRegistro[6].Oct / arregloRegistro[2].Oct *100 || 0
            json.Nov = arregloRegistro[6].Nov / arregloRegistro[2].Nov *100 || 0
            json.Dic = arregloRegistro[6].Dic / arregloRegistro[2].Dic *100 || 0
            json.Total = arregloRegistro[6].Total / arregloRegistro[2].Total *100 || 0

            arregloRegistro.push(json)

            this.setState({
                detallesTienda: arregloRegistro,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return bandera
    }


    getDetallesDecorafiestas = async () => {
        const year = this.state.Year
        const url = this.props.url+`/api/ventas/bi/decorafiestas/${year}`
        let bandera = false;
        try{
            const response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }

            bandera = true;


            let arregloRegistro = []
            let json;
            
            json = this.handleMesesColumnas(data,'VentasConImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Impuestos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'VentasSinImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'CostoDeVentas')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'UtilidadBruta')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Egresos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'UtilidadNeta')
            arregloRegistro.push(json)





//############################## % Utilidad Neta ###############################
            json={
                Transaccion:"% UtilidadNeta",
                }
            json.Ene = arregloRegistro[6].Ene / arregloRegistro[2].Ene *100 || 0
            json.Feb = arregloRegistro[6].Feb / arregloRegistro[2].Feb *100 || 0
            json.Mar = arregloRegistro[6].Mar / arregloRegistro[2].Mar *100 || 0
            json.Abr = arregloRegistro[6].Abr / arregloRegistro[2].Abr *100 || 0
            json.May = arregloRegistro[6].May / arregloRegistro[2].May *100 || 0
            json.Jun = arregloRegistro[6].Jun / arregloRegistro[2].Jun *100 || 0
            json.Jul = arregloRegistro[6].Jul / arregloRegistro[2].Jul *100 || 0
            json.Ago = arregloRegistro[6].Ago / arregloRegistro[2].Ago *100 || 0
            json.Sep = arregloRegistro[6].Sep / arregloRegistro[2].Sep *100 || 0
            json.Oct = arregloRegistro[6].Oct / arregloRegistro[2].Oct *100 || 0
            json.Nov = arregloRegistro[6].Nov / arregloRegistro[2].Nov *100 || 0
            json.Dic = arregloRegistro[6].Dic / arregloRegistro[2].Dic *100 || 0
            json.Total = arregloRegistro[6].Total / arregloRegistro[2].Total *100 || 0

            arregloRegistro.push(json)

            this.setState({
                detallesDecorafiestas: arregloRegistro,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return bandera
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

      handleYear = (e) =>{
        const Year = e.target.value

        this.setState({
            Year: Year,
        },async()=>{
            if ((await this.getDetallesLavamatica()) === false) return;
            if ((await this.getDetallesTienda()) === false) return;
            if ((await this.getDetallesDecorafiestas()) === false) return;
        })


      }
    

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleRender = () =>{
        return(
            <div className="main">
                <span id="idYears">Ejercicio
                    <select onChange={this.handleYear} value={this.state.Year} className="ml-1">
                        {this.state.Years.map((element,i) =>
                            <option key={i} value={element.Year}>{element.Year}</option>
                            
                            )}
                    </select>
                </span>

                <h4>Inteligencia de Negocios Lavamática</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Transacción</th>
                            <th>Ene</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dic</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.detallesLavamatica.length > 0 ? 
                                this.state.detallesLavamatica.map((element,i) =>(

                                    <tr key={i}>
                                        <td>{this.numberWithCommas(element.Transaccion)}</td>
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
                            ))
                            : null}
                            
                            
                            </tbody>
                            </table>

                <br />
                <br />
                <h4>Inteligencia de Negocios Tienda</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Transacción</th>
                            <th>Ene</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dic</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.detallesTienda.length > 0 ? 
                            this.state.detallesTienda.map((element,i) =>(
                                <tr key={i}>
                                        <td>{this.numberWithCommas(element.Transaccion)}</td>
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
                            ))
                            : null}

                            
                    </tbody>
                </table>

                <br />
                <br />

                <h4>Inteligencia de Negocios Decorafiestas</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Transacción</th>
                            <th>Ene</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>May</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dic</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.detallesDecorafiestas.length > 0 ? 
                            this.state.detallesDecorafiestas.map((element,i) =>(
                                <tr key={i}>
                                        <td>{this.numberWithCommas(element.Transaccion)}</td>
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
                            ))
                            : null}

                            
                    </tbody>
                </table>
                <br/>
                <br/>
                <br/>
        </div>
        )
    }
    
    render(){
        return(
            <div className="containerVentasBiLavamanticaTienda">
                {this.state.detallesDecorafiestas.length > 0 ? <this.handleRender /> :<h3>Procesando...</h3>}
            </div>
        )
    }
}

export default VentasBiLavamanticaTienda;