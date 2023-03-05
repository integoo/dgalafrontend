import React from 'react'

import './VentasBiLavamaticaTienda.css'
import {RechartsBarChart01,RechartsBarChart03,RechartsComposedChart02,RechartsComposedChart04} from './cmpnt/FuncionesRecharts'

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
            detallesLavamaticaPorcenUtilidadRecharts:[],
            detallesTienda:[],
            detallesTiendaRecharts:[],
            detallesTiendaPorcenUtilidadRecharts:[],
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
        let url = this.props.url+`/api/ventas/bi/lavamatica/${year}`
        let bandera = false;
        try{
            let response = await fetch(url, {
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




//####################### Ventas del Año Anterior ###########################
            const LastYear = parseInt(year) - 1 
            url = this.props.url+`/api/ventas/bi/lavamatica/${LastYear}`
            response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const dataLastYear = await response.json()
            if(dataLastYear.error){
                console.log(dataLastYear.error)
                alert(dataLastYear.error)
                return
            }

            //##################### Prepara %Utilidad Año Anterior ##################################
            let detallesLavamaticaPorcenUtilidadLastYearRecharts =[]
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Ene","Monto":parseFloat(parseFloat((dataLastYear[84].Monto) / dataLastYear[24].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Feb","Monto":parseFloat(parseFloat((dataLastYear[85].Monto) / dataLastYear[25].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Mar","Monto":parseFloat(parseFloat((dataLastYear[86].Monto) / dataLastYear[26].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Abr","Monto":parseFloat(parseFloat((dataLastYear[87].Monto) / dataLastYear[27].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"May","Monto":parseFloat(parseFloat((dataLastYear[88].Monto) / dataLastYear[28].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Jun","Monto":parseFloat(parseFloat((dataLastYear[89].Monto) / dataLastYear[29].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Jul","Monto":parseFloat(parseFloat((dataLastYear[90].Monto) / dataLastYear[30].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Ago","Monto":parseFloat(parseFloat((dataLastYear[91].Monto) / dataLastYear[31].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Sep","Monto":parseFloat(parseFloat((dataLastYear[92].Monto) / dataLastYear[32].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Oct","Monto":parseFloat(parseFloat((dataLastYear[93].Monto) / dataLastYear[33].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Nov","Monto":parseFloat(parseFloat((dataLastYear[94].Monto) / dataLastYear[34].Monto) * 100 ||0).toFixed(2)})
            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Dic","Monto":parseFloat(parseFloat((dataLastYear[95].Monto) / dataLastYear[35].Monto) * 100 ||0).toFixed(2)})

            //##########Calcula % Total de Utilidad del Año Pasado
            let utilidadNetaTotal = 0
            for (let i = 84; i<=95; i++){
                utilidadNetaTotal += parseFloat(dataLastYear[i].Monto)
            }
            utilidadNetaTotal = parseInt(utilidadNetaTotal.toFixed(0))
            
            let ventaSinImpuestoTotal = 0
            for (let i = 24; i<=35; i++){
                ventaSinImpuestoTotal += parseFloat(dataLastYear[i].Monto)
            }
            ventaSinImpuestoTotal = parseInt(ventaSinImpuestoTotal.toFixed(0))

            let porceUtilidadLastYear = (utilidadNetaTotal / ventaSinImpuestoTotal * 100).toFixed(2)

            //###################################################

            detallesLavamaticaPorcenUtilidadLastYearRecharts.push({"name":"Total","Monto":porceUtilidadLastYear})
            //########################################################################################
//#############################################################################





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
            arregloRegistroRecharts.push({"name": "Ene", "VentaConImp": parseFloat(arregloRegistro[0].Ene.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Ene.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[0].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[84].Monto)})
            arregloRegistroRecharts.push({"name": "Feb", "VentaConImp": parseFloat(arregloRegistro[0].Feb.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Feb.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[1].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[85].Monto)})
            arregloRegistroRecharts.push({"name": "Mar", "VentaConImp": parseFloat(arregloRegistro[0].Mar.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Mar.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[2].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[86].Monto)})
            arregloRegistroRecharts.push({"name": "Abr", "VentaConImp": parseFloat(arregloRegistro[0].Abr.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Abr.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[3].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[87].Monto)})
            arregloRegistroRecharts.push({"name": "May", "VentaConImp": parseFloat(arregloRegistro[0].May.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].May.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[4].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[88].Monto)})
            arregloRegistroRecharts.push({"name": "Jun", "VentaConImp": parseFloat(arregloRegistro[0].Jun.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Jun.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[5].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[89].Monto)})
            arregloRegistroRecharts.push({"name": "Jul", "VentaConImp": parseFloat(arregloRegistro[0].Jul.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Jul.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[6].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[90].Monto)})
            arregloRegistroRecharts.push({"name": "Ago", "VentaConImp": parseFloat(arregloRegistro[0].Ago.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Ago.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[7].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[91].Monto)})
            arregloRegistroRecharts.push({"name": "Sep", "VentaConImp": parseFloat(arregloRegistro[0].Sep.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Sep.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[8].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[92].Monto)})
            arregloRegistroRecharts.push({"name": "Oct", "VentaConImp": parseFloat(arregloRegistro[0].Oct.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Oct.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[9].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[93].Monto)})
            arregloRegistroRecharts.push({"name": "Nov", "VentaConImp": parseFloat(arregloRegistro[0].Nov.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Nov.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[10].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[94].Monto)})
            arregloRegistroRecharts.push({"name": "Dic", "VentaConImp": parseFloat(arregloRegistro[0].Dic.toFixed(0)), "UtilidadNeta": parseFloat(arregloRegistro[7].Dic.toFixed(0)), "VentaConImpLastYear":parseFloat(dataLastYear[11].Monto),"UtilidadNetaLastYear":parseInt(dataLastYear[95].Monto)})
           
           //#################### Prepara Info para Gráfica de % Utilidad Lavamática Año Actual y Año Anterior ###################
                let detallesLavamaticaPorcenUtilidadRecharts = []
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Ene","%Utilidad":parseFloat(arregloRegistro[8].Ene.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[0].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Feb","%Utilidad":parseFloat(arregloRegistro[8].Feb.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[1].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Mar","%Utilidad":parseFloat(arregloRegistro[8].Mar.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[2].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Abr","%Utilidad":parseFloat(arregloRegistro[8].Abr.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[3].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"May","%Utilidad":parseFloat(arregloRegistro[8].May.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[4].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Jun","%Utilidad":parseFloat(arregloRegistro[8].Jun.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[5].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Jul","%Utilidad":parseFloat(arregloRegistro[8].Jul.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[6].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Ago","%Utilidad":parseFloat(arregloRegistro[8].Ago.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[7].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Sep","%Utilidad":parseFloat(arregloRegistro[8].Sep.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[8].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Oct","%Utilidad":parseFloat(arregloRegistro[8].Oct.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[9].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Nov","%Utilidad":parseFloat(arregloRegistro[8].Nov.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[10].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Dic","%Utilidad":parseFloat(arregloRegistro[8].Dic.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[11].Monto})
                detallesLavamaticaPorcenUtilidadRecharts.push({"name":"Total","%Utilidad":parseFloat(arregloRegistro[8].Total.toFixed(2)),"%UtilidadLastYear":detallesLavamaticaPorcenUtilidadLastYearRecharts[12].Monto})
           //##########################################################################################
            this.setState({
                detallesLavamatica: arregloRegistro,
                detallesLavamaticaRecharts: arregloRegistroRecharts,
                detallesLavamaticaPorcenUtilidadRecharts: detallesLavamaticaPorcenUtilidadRecharts,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return bandera
    }


    getLavadasSecadasServicios = async (SucursalId) => {
        const year = this.state.Year
        let url = this.props.url+`/api/lavadassecadasservicios/${SucursalId}/${year}`
        let bandera = false;
        try{
            let response = await fetch(url, {
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


            //############# Lavadas y Secadas del Año Anterior  #######################
            const LastYear = parseInt(year) - 1
            url = this.props.url+`/api/lavadassecadasservicios/${SucursalId}/${LastYear}`
            response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const dataLastYear = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }




            //#########################################################################

            bandera = true;


            let dataRecharts = []
            dataRecharts.push({"name": "Ene", "Lavadas": parseInt(data[0].Ene), "Secadas": parseInt(data[1].Ene),"LavadasLastYear": parseInt(dataLastYear[0].Ene), "SecadasLastYear": parseInt(dataLastYear[1].Ene)})
            dataRecharts.push({"name": "Feb", "Lavadas": parseInt(data[0].Feb), "Secadas": parseInt(data[1].Feb),"LavadasLastYear": parseInt(dataLastYear[0].Feb), "SecadasLastYear": parseInt(dataLastYear[1].Feb)})
            dataRecharts.push({"name": "Mar", "Lavadas": parseInt(data[0].Mar), "Secadas": parseInt(data[1].Mar),"LavadasLastYear": parseInt(dataLastYear[0].Mar), "SecadasLastYear": parseInt(dataLastYear[1].Mar)})
            dataRecharts.push({"name": "Abr", "Lavadas": parseInt(data[0].Abr), "Secadas": parseInt(data[1].Abr),"LavadasLastYear": parseInt(dataLastYear[0].Abr), "SecadasLastYear": parseInt(dataLastYear[1].Abr)})
            dataRecharts.push({"name": "May", "Lavadas": parseInt(data[0].May), "Secadas": parseInt(data[1].May),"LavadasLastYear": parseInt(dataLastYear[0].May), "SecadasLastYear": parseInt(dataLastYear[1].May)})
            dataRecharts.push({"name": "Jun", "Lavadas": parseInt(data[0].Jun), "Secadas": parseInt(data[1].Jun),"LavadasLastYear": parseInt(dataLastYear[0].Jun), "SecadasLastYear": parseInt(dataLastYear[1].Jun)})
            dataRecharts.push({"name": "Jul", "Lavadas": parseInt(data[0].Jul), "Secadas": parseInt(data[1].Jul),"LavadasLastYear": parseInt(dataLastYear[0].Jul), "SecadasLastYear": parseInt(dataLastYear[1].Jul)})
            dataRecharts.push({"name": "Ago", "Lavadas": parseInt(data[0].Ago), "Secadas": parseInt(data[1].Ago),"LavadasLastYear": parseInt(dataLastYear[0].Ago), "SecadasLastYear": parseInt(dataLastYear[1].Ago)})
            dataRecharts.push({"name": "Sep", "Lavadas": parseInt(data[0].Sep), "Secadas": parseInt(data[1].Sep),"LavadasLastYear": parseInt(dataLastYear[0].Sep), "SecadasLastYear": parseInt(dataLastYear[1].Sep)})
            dataRecharts.push({"name": "Oct", "Lavadas": parseInt(data[0].Oct), "Secadas": parseInt(data[1].Oct),"LavadasLastYear": parseInt(dataLastYear[0].Oct), "SecadasLastYear": parseInt(dataLastYear[1].Oct)})
            dataRecharts.push({"name": "Nov", "Lavadas": parseInt(data[0].Nov), "Secadas": parseInt(data[1].Nov),"LavadasLastYear": parseInt(dataLastYear[0].Nov), "SecadasLastYear": parseInt(dataLastYear[1].Nov)})
            dataRecharts.push({"name": "Dic", "Lavadas": parseInt(data[0].Dic), "Secadas": parseInt(data[1].Dic),"LavadasLastYear": parseInt(dataLastYear[0].Dic), "SecadasLastYear": parseInt(dataLastYear[1].Dic)})
            
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
        let url = this.props.url+`/api/ventas/bi/tienda/${year}`
        let bandera = false;
        try{
            let response = await fetch(url, {
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

            //############### Tienda de Año Anterior ########################
            const lastYear = parseInt(year) - 1
            url = this.props.url+`/api/ventas/bi/tienda/${lastYear}`
            response = await fetch(url, {
                headers:{
                    Authorization:`Bearer ${this.props.accessToken}`,
                },
            });
            const dataLastYear = await response.json()
            if(dataLastYear.error){
                console.log(dataLastYear.error)
                alert(dataLastYear.error)
                return
            }






            let detallesTiendaPorcenUtilidadLastYearRecharts =[]
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Ene","Monto":parseFloat(parseFloat((dataLastYear[72].Monto) / dataLastYear[12].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Feb","Monto":parseFloat(parseFloat((dataLastYear[73].Monto) / dataLastYear[25].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Mar","Monto":parseFloat(parseFloat((dataLastYear[74].Monto) / dataLastYear[26].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Abr","Monto":parseFloat(parseFloat((dataLastYear[75].Monto) / dataLastYear[27].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"May","Monto":parseFloat(parseFloat((dataLastYear[76].Monto) / dataLastYear[28].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Jun","Monto":parseFloat(parseFloat((dataLastYear[77].Monto) / dataLastYear[29].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Jul","Monto":parseFloat(parseFloat((dataLastYear[78].Monto) / dataLastYear[30].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Ago","Monto":parseFloat(parseFloat((dataLastYear[79].Monto) / dataLastYear[31].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Sep","Monto":parseFloat(parseFloat((dataLastYear[80].Monto) / dataLastYear[32].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Oct","Monto":parseFloat(parseFloat((dataLastYear[81].Monto) / dataLastYear[33].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Nov","Monto":parseFloat(parseFloat((dataLastYear[82].Monto) / dataLastYear[34].Monto) * 100 ||0).toFixed(2)})
            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Dic","Monto":parseFloat(parseFloat((dataLastYear[83].Monto) / dataLastYear[35].Monto) * 100 ||0).toFixed(2)})

            //##########Calcula % Total de Utilidad del Año Pasado
            let utilidadNetaTotal = 0
            for (let i = 72; i<=83; i++){
                utilidadNetaTotal += parseFloat(dataLastYear[i].Monto)
            }
            utilidadNetaTotal = parseInt(utilidadNetaTotal.toFixed(0))
            
            let ventaSinImpuestoTotal = 0
            for (let i = 24; i<=35; i++){
                ventaSinImpuestoTotal += parseFloat(dataLastYear[i].Monto)
            }
            ventaSinImpuestoTotal = parseInt(ventaSinImpuestoTotal.toFixed(0))

            let porceUtilidadLastYear = (utilidadNetaTotal / ventaSinImpuestoTotal * 100).toFixed(2)

            //###################################################

            detallesTiendaPorcenUtilidadLastYearRecharts.push({"name":"Total","Monto":porceUtilidadLastYear})
            // //########################################################################################












            //alert(JSON.stringify(dataLastYear[78]))

            //###############################################################


            let arregloRegistro = []
            let json;
            
            json = this.handleMesesColumnas(data,'VentasConImpuesto')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'Impuestos')
            arregloRegistro.push(json)
            json = this.handleMesesColumnas(data,'VentasSinImpuesto')
            arregloRegistro.push(json)
            // json = this.handleMesesColumnas(data,'CostoDeVentas')
            json = this.handleMesesColumnas(data,'CostoPromedio')
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

                //######### Porcentaje Utilidad Tienda para Gráfica ###################
                let detallesTiendaPorcenUtilidadRecharts = []
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Ene","%Utilidad":parseFloat(arregloRegistro[7].Ene.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[0].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Feb","%Utilidad":parseFloat(arregloRegistro[7].Feb.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[1].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Mar","%Utilidad":parseFloat(arregloRegistro[7].Mar.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[2].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Abr","%Utilidad":parseFloat(arregloRegistro[7].Abr.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[3].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "May","%Utilidad":parseFloat(arregloRegistro[7].May.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[4].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Jun","%Utilidad":parseFloat(arregloRegistro[7].Jun.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[5].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Jul","%Utilidad":parseFloat(arregloRegistro[7].Jul.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[6].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Ago","%Utilidad":parseFloat(arregloRegistro[7].Ago.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[7].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Sep","%Utilidad":parseFloat(arregloRegistro[7].Sep.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[8].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Oct","%Utilidad":parseFloat(arregloRegistro[7].Oct.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[9].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Nov","%Utilidad":parseFloat(arregloRegistro[7].Nov.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[10].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Dic","%Utilidad":parseFloat(arregloRegistro[7].Dic.toFixed(2)),"%UtilidadLastYear":detallesTiendaPorcenUtilidadLastYearRecharts[11].Monto})
                detallesTiendaPorcenUtilidadRecharts.push({"name": "Total","%Utilidad":parseFloat(arregloRegistro[7].Total.toFixed(2)),"%UtilidadLastYear": detallesTiendaPorcenUtilidadLastYearRecharts[12].Monto})
                //#####################################################################

            this.setState({
                detallesTienda: arregloRegistro,
                detallesTiendaRecharts: arregloRegistroRecharts,
                detallesTiendaPorcenUtilidadRecharts: detallesTiendaPorcenUtilidadRecharts,
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



                {/* <RechartsBarChart02 data={this.state.detallesLavamaticaRecharts} titulo={"Lavamática Ventas Con Impuesto y Utilidad Neta (Sin Impuestos)"} color1={"dodgerblue"} color2={"green"} /> */}
                <RechartsComposedChart04 data={this.state.detallesLavamaticaRecharts} titulo={"Lavamática Ventas Con Impuesto y Utilidad Neta (Sin Impuestos)"} color1={"dodgerblue"} color2={"green"} color3={"#005599"} color4={"orange"} />
                <RechartsComposedChart02 data={this.state.detallesLavamaticaPorcenUtilidadRecharts} titulo={"% Utilidad Lavamática"} color1={"green"} color2={"#005599"}/>












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
 
                {/* <RechartsBarChart02 data={this.state.lavadassecadasserviciosRecharts} titulo={"Lavadas y Secadas"}/> */}
                <RechartsComposedChart04 data={this.state.lavadassecadasserviciosRecharts} titulo={"Lavadas y Secadas"} color1={"orange"} color2={"#9370db"} color3={"red"} color4={"#005599"} />

















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

                <RechartsBarChart03 data={this.state.detallesTiendaRecharts} titulo={"Tienda Ventas Con Impuesto, Costo de Ventas, Utilidad Neta (Sin Impuesto)"} />
                <RechartsComposedChart02 data={this.state.detallesTiendaPorcenUtilidadRecharts} titulo={"% Utilidad de Tienda"} color1={"green"} color2={"purple"} />

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