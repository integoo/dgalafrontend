import React from 'react';

import './RetirosDeCaja.css'

import SelectSucursales from './cmpnt/SelectSucursales'

class RetirosDeCaja extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            SucursalId: 1,
            PeriodoAbierto:0,
            YearPeriodoAbierto:0,
            MesPeriodoAbierto:0,
            Periodo:"",
            Year:0,
            Mes:0,
            BaseYear:2021, //Este año no se debe modificar
            Years: [],
            VentaMensual:0,
            RetirosAcumulados:0,
            RetirosEnProceso:0,
            MontoPendiente:0,
            retiros:[],
            retirosEmpresa:[],
            MontoRetiro:"",
            Administrador: 'N',
            CantidadesEmpresa: [],
            CantidadesSucursal: [],
            alerta: ""
        }

        this.retiroInput = React.createRef()
    }

    async componentDidMount(){
        //Acceso DB dgaladb colaborador Administrador?
        const Administrador = await this.handleAdministrador()

        let ArregloCantidadesSucursal=[]
        let ExtVenta=0
        let CantidadRetiro=0
        let CantidadRetiroProceso=0

        //Acceso DB dgaladb para FECHA DE HOY
        const FechaHoy = await this.handleFechaHoy()
        const Year = FechaHoy.toString().substr(0,4)
        let Years=[]
        for (let i=parseInt(this.state.BaseYear); i<=parseInt(Year)+1; i++){
            Years.push(i)
        }

        //Acceso DB dgaladb para consultar PERIODO ABIERTO
        const PeriodoAbierto = await this.handlePeriodoAbierto()

        
        //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
        //const ArregloCantidades = await this.handleVentasRetiros(PeriodoAbierto, this.state.SucursalId)
        const ArregloCantidades = await this.handleVentasRetiros(PeriodoAbierto)
        if (ArregloCantidades.length > 0){
            ArregloCantidadesSucursal = ArregloCantidades.filter(element => element.SucursalId === this.state.SucursalId)
            ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
            CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
            CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
        }
        
        //Acceso DB dgaladb para detalle RETIROS
        // const ArregloRetiros = await this.handleRetiros(this.state.SucursalId, PeriodoAbierto)
        const ArregloRetirosEmpresa = await this.handleRetiros(PeriodoAbierto)
        const ArregloRetiros = ArregloRetirosEmpresa.filter(element => element.SucursalId === this.state.SucursalId)

        let alerta = ""
        if (Administrador === 'S'){
            alerta = "Su Usuario es ADMINISTRADOR"
        }
        this.setState({
            Administrador: Administrador,
            Years: Years,
            PeriodoAbierto: PeriodoAbierto,
            YearPeriodoAberto: PeriodoAbierto.toString().substr(0,4),
            MesPeriodoAbierto: parseInt(PeriodoAbierto.toString().substr(4,2)),
            Periodo: PeriodoAbierto,
            Year: PeriodoAbierto.toString().substr(0,4),
            Mes: parseInt(PeriodoAbierto.toString().substr(4,2)),
            VentaMensual:parseFloat(ExtVenta).toFixed(2),
            RetirosAcumulados:CantidadRetiro,
            RetirosEnProceso:CantidadRetiroProceso,
            MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
            retiros: ArregloRetiros,
            retirosEmpresa: ArregloRetirosEmpresa,
            CantidadesEmpresa: ArregloCantidades,
            CantidadesSucursal: ArregloCantidadesSucursal,
            alerta: alerta,
        })

        setTimeout(()=>{document.querySelector('.alert').style.display="none"},1000)

        this.retiroInput.current.focus()
    }

    handleAdministrador = async() =>{
        const ColaboradorId = sessionStorage.getItem("ColaboradorId")
        const url = this.props.url + `/api/colaboradoradministrador/${ColaboradorId}`
        let data;
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
            if (data.error){
                console.log(data.error)
                alert(data.error)
            }
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
        return data[0].Administrador
    }

    handleFechaHoy = async() =>{
        let FechaHoy;
        const url = this.props.url + `/api/fechahoy`;
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
            FechaHoy = data[0].FechaHoy
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
        return FechaHoy
    }
    
    handlePeriodoAbierto = async() =>{
        let periodo;
        const url = this.props.url + `/api/periodoabierto`;
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
            periodo = data[0].Periodo
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
        return periodo
    }

    handleVentasRetiros = async(Periodo) =>{
        const url = this.props.url + `/api/cierremescantidades/${Periodo}`;
        let data;
        try{
            const response = await fetch(url,{
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
            
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
        return data
    }

    handleRetiros = async(Periodo) =>{
        let data;
        const url = this.props.url + `/api/consultaretiros/${Periodo}`
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
            if(data.error){
                console.log(data.error)
                alert(data.error)
                return
            }
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
        return data
    }

    handleSucursal = (SucursalId) =>{
        let ArregloCantidadesSucursal = [] 
        let ExtVenta = 0
        let CantidadRetiro = 0
        let CantidadRetiroProceso = 0
        //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
        // const ArregloCantidades = await this.handleVentasRetiros(Periodo, SucursalId)
        //const ArregloCantidadesEmpresa = await this.handleVentasRetiros(Periodo)
        // if(ArregloCantidadesSucursal.length > 0) {
            ArregloCantidadesSucursal = this.state.CantidadesEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
            if(ArregloCantidadesSucursal.length > 0){
                ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
                CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
                CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
        }

        //Acceso DB dgaladb para detalle RETIROS
        //const ArregloRetiros = await this.handleRetiros(SucursalId, Periodo)
        const ArregloRetiros = this.state.retirosEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))

        this.setState({
            SucursalId: SucursalId,
            VentaMensual:parseFloat(ExtVenta).toFixed(2),
            RetirosAcumulados:CantidadRetiro,
            RetirosEnProceso:CantidadRetiroProceso,
            MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
            retiros: ArregloRetiros,
        })
        this.retiroInput.current.focus()
    }

    handleMes = async(e) =>{
    // handleMes = (e) =>{
        const Mes = e.target.value
        const Periodo = this.state.Year + Mes.padStart(2,"0")
        const SucursalId = this.state.SucursalId

        let ArregloCantidadesSucursal = []
        let ExtVenta = 0
        let CantidadRetiro = 0
        let CantidadRetiroProceso = 0

        //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
        // const ArregloCantidades = await this.handleVentasRetiros(Periodo, SucursalId)
        const ArregloCantidadesEmpresa = await this.handleVentasRetiros(Periodo)
        
        ArregloCantidadesSucursal = ArregloCantidadesEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
        if(ArregloCantidadesSucursal.length > 0){
            ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
            CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
            CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
        }

        //Acceso DB dgaladb para detalle RETIROS
        // const ArregloRetiros = await this.handleRetiros(SucursalId, Periodo)
        const ArregloRetirosEmpresa = await this.handleRetiros(Periodo)
        const ArregloRetirosSucursal = ArregloRetirosEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))

        this.setState({
            Mes: Mes,
            Periodo: Periodo,
            VentaMensual:parseFloat(ExtVenta).toFixed(2),
            RetirosAcumulados:CantidadRetiro,
            RetirosEnProceso:CantidadRetiroProceso,
            MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
            retiros: ArregloRetirosSucursal,
            retirosEmpresa: ArregloRetirosEmpresa,
            CantidadesEmpresa: ArregloCantidadesEmpresa,
            CantidadesSucursal: ArregloCantidadesSucursal,
        })
        this.retiroInput.current.focus()
    }

    handleYear = async(e) =>{
    // handleYear =(e) =>{
        const Year = e.target.value
        const Periodo = Year + this.state.Mes.toString().padStart(2,"0")
        const SucursalId = this.state.SucursalId

        let ExtVenta = 0
        let CantidadRetiro = 0
        let CantidadRetiroProceso = 0

        //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
        // const ArregloCantidades = await this.handleVentasRetiros(Periodo, SucursalId)
        const ArregloCantidadesEmpresa = await this.handleVentasRetiros(Periodo)
        const ArregloCantidadesSucursal = ArregloCantidadesEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
        if(ArregloCantidadesSucursal.length >0){
            ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
            CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
            CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
        }

        //Acceso DB dgaladb para detalle RETIROS
        // const ArregloRetiros = await this.handleRetiros(SucursalId, Periodo)
        const ArregloRetirosEmpresa = await this.handleRetiros(Periodo)
        const ArregloRetirosSucursal = ArregloRetirosEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))

        this.setState({
            Year: Year,
            Periodo: Periodo,
            VentaMensual:parseFloat(ExtVenta).toFixed(2),
            RetirosAcumulados:CantidadRetiro,
            RetirosEnProceso:CantidadRetiroProceso,
            MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
            retiros: ArregloRetirosSucursal,
            retirosEmpresa: ArregloRetirosEmpresa,
        })
        this.retiroInput.current.focus()
    }

    handleMontoRetiro = (e) =>{
        const MontoRetiro = e.target.value
        this.setState({
            MontoRetiro: MontoRetiro,
        })
    }

    handleGrabaRetiro = async(e) =>{
        e.preventDefault()
        const PeriodoAbierto = this.state.PeriodoAbierto
        const Periodo = this.state.Periodo

        if(Periodo !== PeriodoAbierto ){
            alert("No es permitido registrar un Retiro en un mes No Abierto.\nPeriodo Abierto: "+PeriodoAbierto)
            return
        }

        if (parseFloat(this.state.VentaMensual) <= 0){
            this.setState({
                MontoRetiro:"",
            })
            alert("Esta sucursal No tiene Venta Registrada")
            this.retiroInput.current.focus()
            return
        }

        if (parseFloat(this.state.MontoRetiro) <= 0 ){
            this.setState({
                MontoRetiro:"",
            })
            alert("El Retiro tiene que ser MAYOR A CERO")
            this.retiroInput.current.focus()
            return
        }

        if(parseFloat(this.state.MontoPendiente) < parseFloat(this.state.MontoRetiro)){
            if(!window.confirm("El MONTO DEL RETIRO excede el MONTO PENDIENTE a Retirar. ¿Desea Continuar?")){
                this.setState({
                    MontoRetiro:"",
                })
                return 
            }
        }
        const json={
            SucursalId: this.state.SucursalId,
            Retiro: this.state.MontoRetiro,
            Periodo: this.state.Periodo,
            ColaboradorId: sessionStorage.getItem("ColaboradorId"),
            Usuario: sessionStorage.getItem("user")
        }
        const url = this.props.url + `/api/cargaretiros`
        try{
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json",
                }
            })
            const data = await response.json()

            let ExtVenta = 0
            let CantidadRetiro = 0
            let CantidadRetiroProceso = 0

            //Acceso DB dgaladb para consultar Cantidades VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
            // const ArregloCantidades = await this.handleVentasRetiros(this.state.Periodo, this.state.SucursalId)
            const ArregloCantidades = await this.handleVentasRetiros(this.state.Periodo)
            const ArregloCantidadesSucursal = ArregloCantidades.filter(element => element.SucursalId === parseInt(this.state.SucursalId))
            if (ArregloCantidadesSucursal.length > 0){
                ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
                CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
                CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
            }

            //Acceso DB dgaladb para detalle RETIROS
            // const ArregloRetirosEmpresa = await this.handleRetiros(this.state.SucursalId, this.state.Periodo)
            const ArregloRetirosEmpresa = await this.handleRetiros(this.state.Periodo)
            const ArregloRetiros = ArregloRetirosEmpresa.filter(element => element.SucursalId === parseInt(this.state.SucursalId))
            this.setState({
                VentaMensual:parseFloat(ExtVenta).toFixed(2),
                RetirosAcumulados:CantidadRetiro,
                RetirosEnProceso:CantidadRetiroProceso,
                MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
                retiros: ArregloRetiros,
                retirosEmpresa: ArregloRetirosEmpresa,
                MontoRetiro:""
            })
            alert(JSON.stringify(data))
            this.retiroInput.current.focus()
        }catch(error){
            console.log(error.message)
            alert(error.message)
            return
        }
    }

    handleCerrarAbrirMes = async (e) =>{
        e.preventDefault()
        const Administrador = this.state.Administrador
        if(Administrador !== 'S'){
            alert("Su usuario NO ES ADMINISTRADOR")
            return;
        }

        //Valida Retiros que no haya Retiros en Proceso
        const retirosProceso = this.state.retirosEmpresa.filter(element => element.Status === 'P')
        if(retirosProceso.length){
            alert(`Hay ${retirosProceso.length} Retiros en PROCESO` )
            return
        }

        //Valida Monto Pendiente a retirar (Déficit) por Sucursal
        let bandera=false;
        let mensaje = ""
        this.state.CantidadesEmpresa.map((element) =>{
            if(parseFloat(element.ExtVenta) > parseFloat(element.CantidadRetiro)){
                mensaje+="La Sucursal "+element.SucursalId + " tiene un Déficit de $ " + this.numberWithCommas(parseFloat(element.ExtVenta-element.CantidadRetiro))+" pesos \n"
                bandera=true
            }
            return null
        })
        if(bandera === true){
            if(!window.confirm(mensaje+"\n¿Desea Cerrar el Mes con Déficit en los Retiros?")){
                return
            }
        }

        const json={
            Periodo: this.state.Periodo ,
            Usuario: sessionStorage.getItem("user")
        }

        const url = this.props.url + `/api/cierra-abre-mes-retiros`
        try{
            const response = await fetch(url, {
                method: "POST",
                body: JSON.stringify(json),
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json"
                },
            });
            const data = await response.json()

            //Acceso DB dgaladb para consultar PERIODO ABIERTO
            const PeriodoAbierto = await this.handlePeriodoAbierto()

            //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
            let ArregloCantidadesSucursal=[]
            let ExtVenta=0
            let CantidadRetiro=0
            let CantidadRetiroProceso=0
            const ArregloCantidadesEmpresa = await this.handleVentasRetiros(PeriodoAbierto)
            if (ArregloCantidadesEmpresa.length > 0){
                ArregloCantidadesSucursal = ArregloCantidadesEmpresa.filter(element => parseInt(element.SucursalId) === parseInt(this.state.SucursalId))
                ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
                CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
                CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
            }
        
            //Acceso DB dgaladb para detalle RETIROS
            // const ArregloRetiros = await this.handleRetiros(this.state.SucursalId, PeriodoAbierto)
            const ArregloRetirosEmpresa = await this.handleRetiros(PeriodoAbierto)
            const ArregloRetiros = ArregloRetirosEmpresa.filter(element => element.SucursalId === this.state.SucursalId)


            this.setState({
                PeriodoAbierto: PeriodoAbierto,
                YearPeriodoAberto: PeriodoAbierto.toString().substr(0,4),
                MesPeriodoAbierto: parseInt(PeriodoAbierto.toString().substr(4,2)),
                Periodo: PeriodoAbierto,
                Year: PeriodoAbierto.toString().substr(0,4),
                Mes: parseInt(PeriodoAbierto.toString().substr(4,2)),
                VentaMensual:parseFloat(ExtVenta).toFixed(2),
                RetirosAcumulados:CantidadRetiro,
                RetirosEnProceso:CantidadRetiroProceso,
                MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
                retiros: ArregloRetiros,
                retirosEmpresa: ArregloRetirosEmpresa,
                CantidadesEmpresa: ArregloCantidadesEmpresa,
                CantidadesSucursal: ArregloCantidadesSucursal,
                alerta: "Nuevo Periodo Abierto "+PeriodoAbierto,
            })


            alert(JSON.stringify(data))
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleAceptar = async(FolioId) =>{
        const Administrador = this.state.Administrador
        
        if(Administrador !== 'S'){
            alert("Su usuario NO ES ADMINISTRADOR")
            return;
        }
        if (window.confirm('Desea Aceptar este Retiro?')){
            const SucursalId = this.state.SucursalId
            const ColaboradorId = sessionStorage.getItem("ColaboradorId")
            const Usuario = sessionStorage.getItem("user")
            const json = {
                SucursalId: SucursalId,
                FolioId: FolioId,
                ColaboradorId: ColaboradorId,
                Usuario: Usuario,
            }
            const url = this.props.url + `/api/aceptaretiro`
            try{
                const response = await fetch(url,{
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        Authorization: `Bearer ${this.props.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json()

                let ExtVenta = 0
                let CantidadRetiro = 0
                let CantidadRetiroProceso = 0

                //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
                // const ArregloCantidades = await this.handleVentasRetiros(this.state.Periodo, SucursalId)
                const ArregloCantidadesEmpresa = await this.handleVentasRetiros(parseInt(this.state.Periodo))
                const ArregloCantidadesSucursal = ArregloCantidadesEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
                if(ArregloCantidadesSucursal.length > 0) {
                    ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
                    CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
                    CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
                }

                //Acceso DB dgaladb para detalle RETIROS
                // const ArregloRetiros = await this.handleRetiros(SucursalId, this.state.Periodo)
                const ArregloRetirosEmpresa = await this.handleRetiros(this.state.Periodo)
                const ArregloRetiros = ArregloRetirosEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
                this.setState({
                    VentaMensual:parseFloat(ExtVenta).toFixed(2),
                    RetirosAcumulados:CantidadRetiro,
                    RetirosEnProceso:CantidadRetiroProceso,
                    MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
                    retiros: ArregloRetiros,
                    retirosEmpresa: ArregloRetirosEmpresa,
                    CantidadesEmpresa: ArregloCantidadesEmpresa,
                    CantidadesSucursal: ArregloCantidadesSucursal,
                })
                alert(JSON.stringify(data))
                this.retiroInput.current.focus()
            }catch(error){
                console.log(error.message)
                alert(error.message)
                return
            }
        }

    }

    handleCancelar = async(FolioId) =>{
        if(window.confirm('Desea Cancelar este Retiro?')) {
            const SucursalId = this.state.SucursalId
            //const Administrador = this.state.Administrador
            const ColaboradorId = sessionStorage.getItem("ColaboradorId")
            const Usuario = sessionStorage.getItem("user")

            const json = {
                SucursalId: SucursalId,
                FolioId: FolioId,
                ColaboradorId: ColaboradorId,
                Usuario: Usuario,
            }
            const url = this.props.url + `/api/cancelaretiro`
            try{
                const response = await fetch(url,{
                    method: "POST",
                    body: JSON.stringify(json),
                    headers: {
                        Authorization: `Bearer ${this.props.accessToken}`,
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json()

                let ExtVenta = 0
                let CantidadRetiro = 0
                let CantidadRetiroProceso = 0


                //Acceso DB dgaladb para consultar VENTAS, RETIROS RECIBIDOS, RETIROS PROCESO
                // const ArregloCantidades = await this.handleVentasRetiros(this.state.Periodo, SucursalId)
                const ArregloCantidadesEmpresa = await this.handleVentasRetiros(this.state.Periodo)
                const ArregloCantidadesSucursal = ArregloCantidadesEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
                if (ArregloCantidadesSucursal.length > 0){
                    ExtVenta = ArregloCantidadesSucursal[0].ExtVenta
                    CantidadRetiro = ArregloCantidadesSucursal[0].CantidadRetiro
                    CantidadRetiroProceso = ArregloCantidadesSucursal[0].CantidadRetiroProceso
                }

                //Acceso DB dgaladb para detalle RETIROS
                // const ArregloRetiros = await this.handleRetiros(SucursalId, this.state.Periodo)
                const ArregloRetirosEmpresa = await this.handleRetiros(this.state.Periodo)
                const ArregloRetirosSucursal = ArregloRetirosEmpresa.filter(element => element.SucursalId === parseInt(SucursalId))
                this.setState({
                    VentaMensual:parseFloat(ExtVenta).toFixed(2),
                    RetirosAcumulados:CantidadRetiro,
                    RetirosEnProceso:CantidadRetiroProceso,
                    MontoPendiente:parseFloat(ExtVenta - CantidadRetiro - CantidadRetiroProceso).toFixed(2),
                    retiros: ArregloRetirosSucursal,
                    retirosEmpresa: ArregloRetirosEmpresa,
                    CantidadesEmpresa: ArregloCantidadesEmpresa,
                    CantidadesSucursal: ArregloCantidadesSucursal,
                })

                alert(JSON.stringify(data))
                this.retiroInput.current.focus();
            }catch(error){
                console.log(error.message)
                alert(error.message)
            }
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleRender = () => {
        return(
            <div className="row mt-2">
                <div className="col-md-6">

           

                    <div className="card">
                            <div className="card-header text-center">
                                <span className="badge badge-success"><h3>Retiros de Caja</h3></span>
                                <br />
                                <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} Administrador={this.state.Administrador}/>
                                <select onChange={this.handleMes} className="m-2"id="mes" name="mes" value={this.state.Mes}>
                                        <option value="1">January</option>
                                        <option value="2">February</option>
                                        <option value="3">March</option>
                                        <option value="4">April</option>
                                        <option value="5">May</option>
                                        <option value="6">June</option>
                                        <option value="7">July</option>
                                        <option value="8">August</option>
                                        <option value="9">September</option>
                                        <option value="10">October</option>
                                        <option value="11">November</option>
                                        <option value="12">December</option>
                                </select>
                                <select onChange={this.handleYear} id="year" name="year" value={this.state.Year}>
                                    {this.state.Years.map((element,i) =>(<option key={i} value={element}>{element}</option>))}
                                </select>
                            </div>
                                    <div>
                                        <label htmlFor="" style={{width:"12rem"}}>Venta Mensual</label>
                                        <input style={{textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.VentaMensual)} readOnly/>
                                    </div>
                                    <div>
                                        <label htmlFor="" style={{width:"12rem"}}>Retiros Entregados</label>
                                        <input style={{textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.RetirosAcumulados)} readOnly/>
                                    </div>
                                    <div>
                                        <label htmlFor="" style={{width:"12rem"}}>Retiros En Proceso</label>
                                        <input style={{textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.RetirosEnProceso)} readOnly/>
                                    </div>
                                    <div>
                                        <label htmlFor="" style={{width:"12rem"}}>Monto Pendiente</label>
                                        <input style={{textAlign:"right"}} value={"$ "+this.numberWithCommas(this.state.MontoPendiente)} readOnly/>
                                    </div> 
                        </div>
                                <div className="card-body">
                                    <form>
                                        <div className="form-group">
                                            <input onChange={this.handleMontoRetiro} type="number" className="form-control mb-2" id="retiro" name="retiro" step="0.01" min="0.0"  placeholder="Monto del Retiro $" value={this.state.MontoRetiro} ref={this.retiroInput}/>
                                            <button onClick={this.handleGrabaRetiro} className="btn btn-success btn-block form-control">Registrar Retiro</button>
                                            <button onClick={this.handleCerrarAbrirMes} className="btn btn-warning btn-block form-control">Cerrar Mes</button>
                                        </div>
                                    </form>                                        
                                </div>


                    {/* Alertas */}
                    <div className="alert alert-danger text-center">
                        <p>{this.state.alerta}</p>
                    </div>




                </div>
                <div className="col-md-6">
                    {this.state.retiros.length > 0 
                            ?
                            this.state.retiros.map((element,i) =>(
                                <div className="contentdetalles" style={{textAlign:"center" }} key={i}>

                                    {element.Status === 'P' //Retiros en PROCESSO
                                        ?
                                            <div className="contentRetirosProceso">
                                                <span  className="badge badge-primary mt-2 mb-3">Retiro Id = {element.FolioId}</span>
                                                <br />
                                                <span>Por Aceptar <strong>{"$ "+this.numberWithCommas(element.CantidadRetiro)}</strong></span>
                                                <button onClick={() =>{this.handleAceptar(element.FolioId)}} id={element.FolioId} className="btn btn-success btn-sm ml-4">Aceptar</button>
                                                <button onClick={() =>{this.handleCancelar(element.FolioId)}} className="btn btn-danger btn-sm ml-1">Cancelar</button>
                                            </div>
                                        :            
                                        

                                        

                                            element.Status === 'R'
                                                ?
                                                //Retiros RECIBIDOS
                                                <div className="contentRetirosEntregados">
                                                    <span  className="badge badge-primary m-2">Retiro Id = {element.FolioId}</span>
                                                    <br />
                                                    <span>Retiro Recibido <strong>{"$ "+this.numberWithCommas(element.CantidadRetiro)}</strong></span>
                                                    <br />
                                                    {/* <span>Registrado: <strong>{element.UserGenera}</strong> {element.FechaHoraGenera.substr(0,10)} {element.FechaHoraGenera.substr(11,8)}</span> */}
                                                    <span>Registrado: <strong>{element.UserGenera}</strong> {element.FechaHoraGenera}</span>
                                                    <br />
                                                    <span>Recibido  : <strong>{element.UserRecibe}</strong> {element.FechaHoraRecibe}</span>
                                                </div>
                                                :
                                                element.Status === 'C'
                                                ?
                                                    <div className="contentRetirosCancelados">
                                                        <span  className="badge badge-primary m-2">Retiro Id = {element.FolioId}</span>
                                                        <br />
                                                        <span>Retiro Cancelado <strong>{"$ "+this.numberWithCommas(element.CantidadRetiro)}</strong></span>
                                                        <br />
                                                        <span>Registrado: <strong>{element.UserGenera}</strong> {element.FechaHoraGenera}</span>
                                                        <br />
                                                        <p>Cancelado: <strong>{element.UserCancela}</strong> {element.FechaHoraCancela}</p>
                                                    </div>
                                                :
                                                    null
                                            
                                    }

                                </div>))
                            :
                            <div className="contentdetalles" style={{textAlign:"center"}}>
                                <span className="badge badge-primary">Retiro id=0</span><span> Recibido <strong>$ 0.00</strong></span> 
                                <br />
                                <span>Registro: 0000-00-00 00:00</span>
                                <br />
                                <span>Recepción: 0000-00-00 00:00</span>
                            </div>
                    }
                </div>
            </div>
        )
    }

    
    render(){
        return(
            <React.Fragment>
                <div className="container">
                   {this.state.Year===0 ? <h1>Loading...</h1> : <this.handleRender /> }
                </div>
            </React.Fragment>
        )
    }
}
export default RetirosDeCaja;
