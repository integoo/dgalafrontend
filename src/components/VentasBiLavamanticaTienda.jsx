import React from 'react'

import './VentasBiLavamaticaTienda.css'
import {RechartsBarChart01,RechartsBarChart02,RechartsBarChart03} from './cmpnt/FuncionesRecharts'

import SelectSucursales from './cmpnt/SelectSucursales'

class VentasBiLavamanticaTienda extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            Years: [],
            Year: 0,
            // SucursalId: sessionStorage.getItem("SucursalId"),
            SucursalId: 0,
            detallesLavamatica:[],
            detallesLavamaticaRecharts:[],
            detallesTienda:[],
            detallesTiendaRecharts:[],
            detallesDecorafiestas:[],
            detallesInventarioPerpetuoHistoria:[],
            detallesInventarioPerpetuoHistoriaRecharts:[],
            lavadassecadasservicios:[],
            lavadassecadasserviciosRecharts:[],
        }
    }

    componentDidMount = async()=>{


        if ((await this.getConsultaAnios()) === false) return;
        // if ((await this.getDetallesLavamatica()) === false) return;
        // if ((await this.getLavadasSecadasServicios(SucursalId)) === false) return;
        // if ((await this.getDetallesTienda()) === false) return;
        // if ((await this.getDetallesDecorafiestas()) === false) return;
        // if ((await this.getDetallesInventarioPerpetuoHistoria()) === false) return;

    }

    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId
        })
        // this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
        this.getLavadasSecadasServicios(SucursalId)

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
            json.Ene = arregloRegistro[7].Ene / arregloRegistro[2].Ene *100 || 0
            json.Feb = arregloRegistro[7].Feb / arregloRegistro[2].Feb *100 || 0
            json.Mar = arregloRegistro[7].Mar / arregloRegistro[2].Mar *100 || 0
            json.Abr = arregloRegistro[7].Abr / arregloRegistro[2].Abr *100 || 0
            json.May = arregloRegistro[7].May / arregloRegistro[2].May *100 || 0
            json.Jun = arregloRegistro[7].Jun / arregloRegistro[2].Jun *100 || 0
            json.Jul = arregloRegistro[7].Jul / arregloRegistro[2].Jul *100 || 0
            json.Ago = arregloRegistro[7].Ago / arregloRegistro[2].Ago *100 || 0
            json.Sep = arregloRegistro[7].Sep / arregloRegistro[2].Sep *100 || 0
            json.Oct = arregloRegistro[7].Oct / arregloRegistro[2].Oct *100 || 0
            json.Nov = arregloRegistro[7].Nov / arregloRegistro[2].Nov *100 || 0
            json.Dic = arregloRegistro[7].Dic / arregloRegistro[2].Dic *100 || 0
            json.Total = arregloRegistro[7].Total / arregloRegistro[2].Total *100 || 0
            arregloRegistro.push(json)

            let arregloRegistroRecharts = []
            arregloRegistroRecharts.push({"name": "Ene", "VentaConImp": parseFloat(arregloRegistro[0].Ene.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Ene.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Feb", "VentaConImp": parseFloat(arregloRegistro[0].Feb.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Feb.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Mar", "VentaConImp": parseFloat(arregloRegistro[0].Mar.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Mar.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Abr", "VentaConImp": parseFloat(arregloRegistro[0].Abr.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Abr.toFixed(0))})
            arregloRegistroRecharts.push({"name": "May", "VentaConImp": parseFloat(arregloRegistro[0].May.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].May.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Jun", "VentaConImp": parseFloat(arregloRegistro[0].Jun.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Jun.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Jul", "VentaConImp": parseFloat(arregloRegistro[0].Jul.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Jul.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Ago", "VentaConImp": parseFloat(arregloRegistro[0].Ago.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Ago.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Sep", "VentaConImp": parseFloat(arregloRegistro[0].Sep.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Sep.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Oct", "VentaConImp": parseFloat(arregloRegistro[0].Oct.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Oct.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Nov", "VentaConImp": parseFloat(arregloRegistro[0].Nov.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Nov.toFixed(0))})
            arregloRegistroRecharts.push({"name": "Dic", "VentaConImp": parseFloat(arregloRegistro[0].Dic.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Dic.toFixed(0))})

            this.setState({
                detallesLavamatica: arregloRegistro,
                detallesLavamaticaRecharts: arregloRegistroRecharts,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return bandera
    }


    getLavadasSecadasServicios = async (SucursalId) => {
        const year = this.state.Year
        const url = this.props.url+`/api/lavadassecadasservicios/${SucursalId}/${year}`
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


            let dataRecharts = []
            dataRecharts.push({"name": "Ene", "Lavadas": parseInt(data[0].Ene), "Secadas": parseInt(data[1].Ene)})
            dataRecharts.push({"name": "Feb", "Lavadas": parseInt(data[0].Feb), "Secadas": parseInt(data[1].Feb)})
            dataRecharts.push({"name": "Mar", "Lavadas": parseInt(data[0].Mar), "Secadas": parseInt(data[1].Mar)})
            dataRecharts.push({"name": "Abr", "Lavadas": parseInt(data[0].Abr), "Secadas": parseInt(data[1].Abr)})
            dataRecharts.push({"name": "May", "Lavadas": parseInt(data[0].May), "Secadas": parseInt(data[1].May)})
            dataRecharts.push({"name": "Jun", "Lavadas": parseInt(data[0].Jun), "Secadas": parseInt(data[1].Jun)})
            dataRecharts.push({"name": "Jul", "Lavadas": parseInt(data[0].Jul), "Secadas": parseInt(data[1].Jul)})
            dataRecharts.push({"name": "Ago", "Lavadas": parseInt(data[0].Ago), "Secadas": parseInt(data[1].Ago)})
            dataRecharts.push({"name": "Sep", "Lavadas": parseInt(data[0].Sep), "Secadas": parseInt(data[1].Sep)})
            dataRecharts.push({"name": "Oct", "Lavadas": parseInt(data[0].Oct), "Secadas": parseInt(data[1].Oct)})
            dataRecharts.push({"name": "Nov", "Lavadas": parseInt(data[0].Nov), "Secadas": parseInt(data[1].Nov)})
            dataRecharts.push({"name": "Dic", "Lavadas": parseInt(data[0].Dic), "Secadas": parseInt(data[1].Dic)})
            
            this.setState({
                lavadassecadasservicios: data,
                lavadassecadasserviciosRecharts: dataRecharts,
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


            let arregloRegistroRecharts = []
            arregloRegistroRecharts.push({"name":"Ene","VentasConImp":parseInt(arregloRegistro[0].Ene.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Ene.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Ene.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Feb","VentasConImp":parseInt(arregloRegistro[0].Feb.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Feb.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Feb.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Mar","VentasConImp":parseInt(arregloRegistro[0].Mar.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Mar.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Mar.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Abr","VentasConImp":parseInt(arregloRegistro[0].Abr.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Abr.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Abr.toFixed(0))})
            arregloRegistroRecharts.push({"name":"May","VentasConImp":parseInt(arregloRegistro[0].May.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].May.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].May.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Jun","VentasConImp":parseInt(arregloRegistro[0].Jun.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Jun.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Jun.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Jul","VentasConImp":parseInt(arregloRegistro[0].Jul.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Jul.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Jul.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Ago","VentasConImp":parseInt(arregloRegistro[0].Ago.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Ago.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Ago.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Sep","VentasConImp":parseInt(arregloRegistro[0].Sep.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Sep.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Sep.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Oct","VentasConImp":parseInt(arregloRegistro[0].Oct.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Oct.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Oct.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Nov","VentasConImp":parseInt(arregloRegistro[0].Nov.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Nov.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Nov.toFixed(0))})
            arregloRegistroRecharts.push({"name":"Dic","VentasConImp":parseInt(arregloRegistro[0].Dic.toFixed(0)),"CostoDeVentas":parseInt(arregloRegistro[3].Dic.toFixed(0)),"UtilidadNeta":parseInt(arregloRegistro[6].Dic.toFixed(0))})
            this.setState({
                detallesTienda: arregloRegistro,
                detallesTiendaRecharts: arregloRegistroRecharts,
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


    getDetallesInventarioPerpetuoHistoria = async () => {
        const year = this.state.Year
        const url = this.props.url+`/api/consultainvnetarioperpetuohistoriaporperiodo/${year}`
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

            let dataRecharts = []
            dataRecharts.push({"name":"Ene", "InventarioPerpetuo":parseInt(parseFloat(data[0].Ene).toFixed(0))})
            dataRecharts.push({"name":"Feb", "InventarioPerpetuo":parseInt(parseFloat(data[0].Feb).toFixed(0))})
            dataRecharts.push({"name":"Mar", "InventarioPerpetuo":parseInt(parseFloat(data[0].Mar).toFixed(0))})
            dataRecharts.push({"name":"Abr", "InventarioPerpetuo":parseInt(parseFloat(data[0].Abr).toFixed(0))})
            dataRecharts.push({"name":"May", "InventarioPerpetuo":parseInt(parseFloat(data[0].May).toFixed(0))})
            dataRecharts.push({"name":"Jun", "InventarioPerpetuo":parseInt(parseFloat(data[0].Jun).toFixed(0))})
            dataRecharts.push({"name":"Jul", "InventarioPerpetuo":parseInt(parseFloat(data[0].Jul).toFixed(0))})
            dataRecharts.push({"name":"Ago", "InventarioPerpetuo":parseInt(parseFloat(data[0].Ago).toFixed(0))})
            dataRecharts.push({"name":"Sep", "InventarioPerpetuo":parseInt(parseFloat(data[0].Sep).toFixed(0))})
            dataRecharts.push({"name":"Oct", "InventarioPerpetuo":parseInt(parseFloat(data[0].Oct).toFixed(0))})
            dataRecharts.push({"name":"Nov", "InventarioPerpetuo":parseInt(parseFloat(data[0].Nov).toFixed(0))})
            dataRecharts.push({"name":"Dic", "InventarioPerpetuo":parseInt(parseFloat(data[0].Dic).toFixed(0))})

            this.setState({
                detallesInventarioPerpetuoHistoria: data,
                detallesInventarioPerpetuoHistoriaRecharts: dataRecharts,
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
          },async()=>{
                const SucursalId = this.state.SucursalId
                if ((await this.getDetallesLavamatica()) === false) return;
                if ((await this.getLavadasSecadasServicios(SucursalId)) === false) return;
                if ((await this.getDetallesTienda()) === false) return;
                if ((await this.getDetallesDecorafiestas()) === false) return;
                if ((await this.getDetallesInventarioPerpetuoHistoria()) === false) return;
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
            const SucursalId = this.state.SucursalId
            this.getLavadasSecadasServicios(SucursalId)
            if ((await this.getDetallesLavamatica()) === false) return;
            if ((await this.getDetallesTienda()) === false) return;
            if ((await this.getDetallesDecorafiestas()) === false) return;
            if ((await this.getDetallesInventarioPerpetuoHistoria()) === false) return;
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
                                        <td>{this.numberWithCommas(parseFloat(element.Ene).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Feb).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Mar).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Abr).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.May).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jun).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jul).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Ago).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Sep).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Oct).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Nov).toFixed(i === 8 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Dic).toFixed(i === 8 ? 2 : 0))}</td>
                                       {i !== 8  ? <td>{this.numberWithCommas(parseFloat(element.Total).toFixed(i === 8 ? 2 : 0))}</td>
                                        : <td style={{background:"green", color:"white"}}><b>{this.numberWithCommas(parseFloat(element.Total).toFixed(i === 8 ? 2 : 0))}</b></td>
                                        }
                                        

                                </tr>
                            ))
                            : null}
                            
                            
                            </tbody>
                            </table>

                <br />
                <br />



                <RechartsBarChart02 data={this.state.detallesLavamaticaRecharts} titulo={"Lavamática Ventas Con Impuesto y Utilidad Neta (Sin Impuestos)"} color1={"dodgerblue"} color2={"green"} />














                <span id="idYears">Lavamática
                    {/* <select onChange={this.handleYear} value={this.state.Year} className="ml-1">
                        {this.state.Years.map((element,i) =>
                            <option key={i} value={element.Year}>{element.Year}</option>
                            
                            )}
                        </select> */}
                        <span className="m-1">
                        <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} Administrador={this.props.Administrador} clase={'todasyfisicas'}/>
                        </span>
                </span>


                <h4>Estadística Lavadas, Secadas y Servicios</h4>
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
                        {this.state.lavadassecadasservicios.length > 0 ? 
                                this.state.lavadassecadasservicios.map((element,i) =>(
                                    <tr key={i}>
                                        <td style={{textAlign:"left", width:"210px"}}>{this.numberWithCommas(element.Descripcion)}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Ene))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Feb))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Mar))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Abr))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.May))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jun))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jul))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Ago))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Sep))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Oct))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Nov))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Dic))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Total))}</td>
                                                          

                                </tr>
                            ))
                            : null}
                                
                            </tbody>
                            </table>

                <br />
                <br />
 
                <RechartsBarChart02 data={this.state.lavadassecadasserviciosRecharts} titulo={"Lavadas y Secadas"}/>

















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
                                        <td>{this.numberWithCommas(parseFloat(element.Ene).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Feb).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Mar).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Abr).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.May).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jun).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jul).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Ago).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Sep).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Oct).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Nov).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Dic).toFixed(i === 7 ? 2 : 0))}</td>
                                        {i !== 7 ?<td>{this.numberWithCommas(parseFloat(element.Total).toFixed(i === 7 ? 2 : 0))}</td>
                                            : <td style={{background:"green", color:"white"}}><b>{this.numberWithCommas(parseFloat(element.Total).toFixed(i === 7 ? 2 : 0))}</b></td>
}
                                </tr>
                            ))
                            : null}

                            
                    </tbody>
                </table>

                <br />
                <br />

                <RechartsBarChart03 data={this.state.detallesTiendaRecharts} titulo={"Tienda Ventas Con Impuesto, Costo de Ventas, Utilidad Neta (Sin Impuesto)"}/>


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
                                        <td>{this.numberWithCommas(parseFloat(element.Ene).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Feb).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Mar).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Abr).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.May).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jun).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Jul).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Ago).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Sep).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Oct).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Nov).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Dic).toFixed(i === 7 ? 2 : 0))}</td>
                                        <td>{this.numberWithCommas(parseFloat(element.Total).toFixed(i === 7 ? 2 : 0))}</td>
                                </tr>
                            ))
                            : null}
                    </tbody>
                </table>

                <br />
                <br />

                <h4>Análisis de Inventario Perpetuo Historia</h4>
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.detallesInventarioPerpetuoHistoria.length > 0 ? 
                            this.state.detallesInventarioPerpetuoHistoria.map((element,i) =>(
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
                                </tr>
                            ))
                            : null}
                    </tbody>
                </table>

                <RechartsBarChart01 data={this.state.detallesInventarioPerpetuoHistoriaRecharts} titulo={"Inventario"}/>

                <br/>
                <br/>
                <br/>
        </div>
        )
    }
    
    render(){
        return(
            <div className="containerVentasBiLavamanticaTienda">
                {this.state.detallesInventarioPerpetuoHistoriaRecharts.length > 0 ? <this.handleRender /> :<h3>Procesando...</h3>}
            </div>
        )
    }
}

export default VentasBiLavamanticaTienda;