import React from "react";
import "./PuntoDeVenta.css";

class PuntoDeVenta extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sucursales: [],
      SucursalId: "",
      detalles: [],
      CodigoBarras: "",
      totalTicket: 0.0,
      VentanaDescripcion: "",
      VentanaDescripcionDetalles: [],
      ventasPendientes: [],
      detallesNotaSeleccionada: [],
      FolioId: 0,
      clientes: [],
      ClienteId: 0,
      porcentajePorServicio: 70, //ESTE ES EL PORCENTAJE PARA COBRAR EL SERVICIO POR ENCARGO
    };
    this.CodigoBarrasInput = React.createRef();
    this.ventanadescripcionInput = React.createRef();
  }

  async componentDidMount() {
    const arregloSucursales = await this.getSucursales();
    if (arregloSucursales.error) {
      alert(arregloSucursales.error);
      return;
    }
    const SucursalId = arregloSucursales[0].SucursalId;

    //###################### CONSULTA VENTAS PENDIENTES EN BASES  DE DATOS ########################
    const arregloVentasPendientes = await this.getVentasPendientesArreglo(
      SucursalId
    );
    //#############################################################################################

    await this.getClientes(); //Consulta Catálogo de Clientes

    this.setState({
      sucursales: arregloSucursales,
      SucursalId: arregloSucursales[0].SucursalId,
      ventasPendientes: arregloVentasPendientes,
    });
    document.querySelector(".ventanaproductos").style.display = "none";
    document.querySelector(".CatalogoClientes").style.display = "none";
    this.CodigoBarrasInput.current.focus();
  }

  addRowHandlers = () => {
    const table = document.getElementById("table1");
    const rows = table.getElementsByTagName("tr");
    for (let i = 1; i < rows.length; i++) {
      //EL for es desde el rengón 1 porque el 0 son los encabezados de las columnas y marca error si se seleccionan.
      let currentRow = table.rows[i];
      let createClickHandler = (row) => {
        return () => {
          let cell = row.getElementsByTagName("td")[1];
          let vcodigobarras = cell.innerHTML;
          this.setState({
            CodigoBarras: vcodigobarras,
            VentanaDescripcion: "",
            VentanaDescripcionDetalles: [],
          });
          document.querySelector(".ventanaproductos").style.display = "none";
          document.querySelector("#btn-cancelarventa").style.display = "block";
          this.CodigoBarrasInput.current.focus();
        };
      };
      currentRow.onclick = createClickHandler(currentRow);
    }
  };

  async getSucursales() {
    const url = this.props.url + `/api/catalogos/10`;
    const Administrador = this.props.Administrador
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      const vSucursalAsignada = parseInt(sessionStorage.getItem("SucursalId"));
      // if (vSucursalAsignada !== 100) {
      if (Administrador !== 'S') {
        data = data.filter(
          (element) => element.SucursalId === vSucursalAsignada
        );
      }
      if (data.length === 0) {
        data = { error: "Error en Sucursales" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  getClientes = async () => {
    const url = this.props.url + `/api/catalogoclientes`;
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
      this.setState({
        clientes: data,
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  //Este Método forma el json de Encabezados y Detalles para las Ventas Pendientes
  getVentasPendientesArreglo = async (SucursalId) => {
    const url =
      this.props.url + `/api/consultaventaspendientesarreglo/${SucursalId}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.log(error.message);
      alert(error.message);
      return;
    }
  };

  getVentaPendientePorFolio = async (FolioId) => {
    const SucursalId = this.state.SucursalId;
    const url =
      this.props.url +
      `/api/consultaventapendienteporfolio/${SucursalId}/${FolioId}`;
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
      alert(error.message);
      return;
    }
    return data;
  };

  onRegistrarVentas = async () => {
    const FolioId = this.state.FolioId;
    let response;
    let url;
    let data;
    let json = {};
    const detalles = this.state.detalles;
    const ClienteId = this.state.ClienteId;

    if (detalles.length === 0) {
      //alert("No hay productos");
      this.CodigoBarrasInput.current.focus();
      return;
    }

    if (window.confirm('Desea Cerrar la Venta?')){ 
      document.querySelector(".main").style.cursor = "progress"; //Cambia el cursos a "progress"
    }else{
      this.CodigoBarrasInput.current.focus()
      return;
    }

    
    let UnidadesVendidas = 1; //Esto se va a modificar cuando se pueda multiplicar los productos

    //############ SECCION PARA HACER EL ARREGLO DE JSON ENCABEZADO Y DETALLES ##################
    let arreglo = [];
    let jsonDetalles;
    detalles.map((element, i) => {
      if (FolioId === 0) {
        jsonDetalles = {
          SerialId: i + 1, //ESTE ES EL QUE CAMBIA
          CodigoId: element.CodigoId,
          CodigoBarras: element.CodigoBarras,
          Descripcion: element.Descripcion,
          Unidades: UnidadesVendidas,
          PrecioVentaConImpuesto: parseFloat(element.PrecioVentaConImpuesto),
          Accion: element.Accion,
        };
      } else {
        jsonDetalles = {
          SerialId: element.SerialId, //ESTE ES EL QUE CAMBIA
          CodigoId: element.CodigoId,
          CodigoBarras: element.CodigoBarras,
          Unidades: UnidadesVendidas,
          PrecioVentaConImpuesto: parseFloat(element.PrecioVentaConImpuesto),
          Accion: element.Accion,
        };
      }
      arreglo.push(jsonDetalles);
      return null;
    });

    json = {
      SucursalId: this.state.SucursalId,
      FolioId: FolioId,
      ClienteId: ClienteId,
      CajeroId: parseInt(sessionStorage.getItem("ColaboradorId")),
      VendedorId: parseInt(sessionStorage.getItem("ColaboradorId")),
      Usuario: sessionStorage.getItem("user"),
      Status: "V",
      detalles: arreglo,
    };
    //##########################################################################################
    if (FolioId === 0) {
      //Inserta Venta con status 'V' (Cerrara) en la Base de Datos
      try {
        url = this.props.url + `/api/grabaventas`;
        response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            Authorization: `Bear ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          document.querySelector(".main").style.cursor = "default";
          return;
        }
        this.setState({
          CodigoBarras: "",
          detalles: [],
          totalTicket: 0.0,
          FolioId: 0,
          ClienteId: 0,
        });
        alert("FOLIO VENTA: " + data.Success);
        document.querySelector(".main").style.cursor = "default";
        this.CodigoBarrasInput.current.focus();
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        document.querySelector(".main").style.cursor = "default";
      }
    } else {
      //Actualiza la Venta Pendiente "P" a Venta Cerrada "V" afectando Inventario
      //Cierra Venta
      url = this.props.url + `/api/cierraventa`;
      try {
        response = await fetch(url, {
          method: "PUT",
          body: JSON.stringify(json),
          headers: {
            Authorization: `Bearer ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          document.querySelector(".main").style.cursor = "default";
          return;
        }

        this.setState({
          CodigoBarras: "",
          detalles: [],
          totalTicket: 0.0,
          FolioId: 0,
          ClienteId: 0,
        });
        alert("FOLIO VENTA (Cierre Venta): " + data.message);
        this.CodigoBarrasInput.current.focus();
        document.querySelector(".main").style.cursor = "default";
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        document.querySelector(".main").style.cursor = "default";
        return;
      }
    }
  };

  onRegistrarVentasPendientes = async () => {
    const SucursalId = this.state.SucursalId;
    const FolioId = this.state.FolioId;
    const ClienteId = this.state.ClienteId;
    let detalles = this.state.detalles;
    let json = {};
    let ventasPendientes = [];
    if (parseInt(FolioId) === 0) {
      //Si FolioId es CERO es que no hay abierta ninguna venta en proceso
      if (detalles.length === 0) {
        //alert("No hay productos");
        this.CodigoBarrasInput.current.focus();
        return;
      }

      //##################### FORMA json PARA INSERTAR EN BASE DE DATOS #############################
      json = {
        SucursalId: this.state.SucursalId,
        FolioId: FolioId,
        ClienteId: ClienteId,
        CajeroId: parseInt(sessionStorage.getItem("ColaboradorId")),
        VendedorId: parseInt(sessionStorage.getItem("ColaboradorId")),
        Usuario: sessionStorage.getItem("user"),
        Status: "P",
        detalles: detalles,
      };

      try {
        //if (window.config('Desea Cerrar la Venta')){
        const url = this.props.url + `/api/grabaventas`;
        let response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(json),
          headers: {
            Authorization: `Bear ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        let data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          return;
        }
        //############## CONSULTA VENTAS PENDIENTES EN BASES  DE DATOS  Status = 'P'#################
        const arregloVentasPendientes = await this.getVentasPendientesArreglo(
          SucursalId
        );
        //###########################################################################################

        this.setState({
          CodigoBarras: "",
          detalles: [],
          totalTicket: 0.0,
          FolioId: 0,
          cantidadNotasAbiertas: ventasPendientes.length,
          ventasPendientes: arregloVentasPendientes,
          Cliente: 0,
        });
        alert("FOLIO VENTA EN PROCESO (PENDING!!!!): " + data.Success);
        this.CodigoBarrasInput.current.focus();
      } catch (error) {
        console.log(error.message);
        alert(error.message);
      }
      //#################################################
    } else {
      //AQUI EL FOLIOID NO CAMBIO PERO SE VUELVE A GUARDAR COMO PENDIENTE.
      let arregloNotas = this.state.ventasPendientes;
      this.state.detallesNotaSeleccionada.forEach((element) => {
        arregloNotas.push(element);
      });
      const arregloNotasOrdenadas = arregloNotas.sort(
        (a, b) => parseInt(a.FolioId) - parseInt(b.FolioId)
      );
      this.setState({
        ventasPendientes: arregloNotasOrdenadas,
        totalTicket: 0.0,
        detalles: [],
        FolioId: 0,
        ClienteId: 0,
      });
      this.CodigoBarrasInput.current.focus();
    }
  };

  handleSucursales = (e) => {
    const SucursalId = e.target.value;
    this.setState({
      SucursalId: SucursalId,
    });
    this.CodigoBarrasInput.current.focus();
  };

  handleClientes = (e) => {
    //const ClienteId = e.target.value;
    //const arregloClientes = this.state.clientes;
    alert("EN CONSTRUCCION ...(PROXIMAMENTE!!!")
    return
    // const arreglo2Clientes = arregloClientes.filter(
    //   (element) => parseInt(element.ClienteId) === parseInt(ClienteId)
    // );
    // alert(JSON.stringify(arreglo2Clientes))
    //alert(JSON.stringify(ClienteId));
    // if (parseInt(ClienteId) === 2) {
    //   document.querySelector(".CatalogoClientes").style.display = "block";
    // }
    // this.setState({
    //   ClienteId: ClienteId,
    // });
    // this.CodigoBarrasInput.current.focus();
  };

  handleCodigoBarras = (e) => {
    const CodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: CodigoBarras,
    });
  };

async getCodigoBarraPrincipal(CodigoId){
  let CodigoBarras="0"
  const url = this.props.url + `/api/codigobarrasprincipal/${CodigoId}`
  const response = await fetch(url,{
    headers: {
      Authorization: `Bearer ${this.props.accessToken}`,
    },
  });
  let data = await response.json()
  if(data.length === 0 ){
    CodigoBarras = ""
  }else{
    CodigoBarras = data[0].CodigoBarras
  }
  return CodigoBarras
}

  async getProducto(id) {
    const SucursalId = this.state.SucursalId;
    const url = this.props.url + `/api/productosdatosventa/${SucursalId}/${id}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    });
    let data = await response.json();
    if (data.length === 0) {
      data = { error: "Producto No Existe" };
    }
    return data;
  }

  async getProductosDescripcion(desc) {
    const url = this.props.url + `/api/productosdescripcion/${desc}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    });
    let data = await response.json();
    return data;
  }

  handleBuscar = async (e) => {
    e.preventDefault();
    const SucursalId = this.state.SucursalId;
    const ClienteId = this.state.ClienteId;
    const FolioId = this.state.FolioId;
    let CodigoBarras = this.state.CodigoBarras;

    //####### Funcionalidad para Capturar Códigos Internos y lo convierte a su Codigo de Barras #######
    // let numbers = /^[0-9]+$/;
    // if (CodigoBarras.match(numbers) && CodigoBarras.length < 6){

    //### Para Marcado Rápido productos que empiezan con I y que su longitud es menor que 6 lo toma como
    //### código interno para buscar su Código de Barras Principal
    if (CodigoBarras[0] === 'I' && CodigoBarras.length < 6){
      CodigoBarras = CodigoBarras.substring(1)
      CodigoBarras = await this.getCodigoBarraPrincipal(parseInt(CodigoBarras))
      if(CodigoBarras === ""){
        alert("Codigo Interno No Existen")
        return
      }
      this.setState({
        CodigoBarras: CodigoBarras,
      })
    }
    //###############################################################################################

    let CategoriaId = 0

    let Unidades = 1; //Esto va a cambiar cuando se agregue la opción de multiplicar

    let arreglo = [];

    if (CodigoBarras !== "") {
      //Si se tiene un Código de Barras

      arreglo = await this.getProducto(CodigoBarras);

      if (arreglo.error) {
        alert(arreglo.error);
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }

      if (arreglo[0].PrecioVentaConImpuesto <= 0) {
        alert("Este producto No tiene Precio de Venta");
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }

      if (arreglo[0].CostoPromedio <= 0) {
        alert("Este producto No tiene Costo o no se ha Recibido");
        this.setState({
          CodigoBarras: "",
        });
        this.CodigoBarrasInput.current.focus();
        return;
      }
    } else {
      //Si no se tiene un Codigo de Barras se abre la Ventana de Búsqueda
      if (
        document.querySelector(".ventanaproductos").style.display === "none"
      ) {
        document.querySelector(".ventanaproductos").style.display = "block";
        document.querySelector("#btn-cancelarventa").style.display = "none";
        this.ventanadescripcionInput.current.focus();
      } else {
        this.setState({
          VentanaDescripcion: "",
          VentanaDescripcionDetalles: [],
        });
        document.querySelector(".ventanaproductos").style.display = "none";
        document.querySelector("#btn-cancelarventa").style.display = "block";
        this.CodigoBarrasInput.current.focus();
      }
      return;
    }

    CategoriaId = arreglo[0].CategoriaId
    let detalles = this.state.detalles;

    //####################### VALIDACIONES DE "SERVICIO POR ENCARGO" ("CodigoId" = 65) ###############
    if(parseInt(arreglo[0].CodigoId) === 65) {
      this.setState({
        servicioPorEncargo:"S",
      })

      //### VALIDA QUE YA EXISTA EN LA VENTA UN PRODUCTO DE LA "CategoriaId" = 3 (03 LAVAMATICA)#### 
      if(!detalles.find(element => parseInt(element.CategoriaId) === 3)){
        alert("No existe ningún producto de Categoría \"03 LAVAMATICA\" ")
        this.setState({
          CodigoBarras: "",
        })
        this.CodigoBarrasInput.current.focus()
        return
      }
      
      //#### VALIDA QUE EL "SERVICIO POR ENCARGO" ("CodigoId" = 65) NO SE REGISTRE MAS DE UNA VEZ #####
      if(detalles.find(element => parseInt(element.CodigoId) === 65)){
        alert("El \"SERVICIO POR ENCARGO\" ya está registrado en esta Venta")
        this.setState({
          CodigoBarras: "",
        })
        this.CodigoBarrasInput.current.focus()
        return;
      }
      // //#### CALCULA EL MONTO $ DE VENTA DE PRODUCTOS DE CATEGORIA "03 LAVAMATICA" SIN CODIGO 65 #####
      // let total = 0;
      // detalles.forEach(element => {
      //   if(parseInt(element.CategoriaId) === 3){
      //     total = total + (parseFloat(element.PrecioVentaConImpuesto) * parseInt(element.Unidades))
      //   }
      //   return null
      // })
      // //arreglo[0].PrecioVentaConImpuesto = 1000
      // //alert(JSON.stringify(arreglo))
      // alert(JSON.stringify(total))
    }

    //################### DETERMINA EL SerialId siguiente de detalles ###################
    let nextSerialId = 0;
    detalles.forEach((element) => {
      if (parseInt(element.SerialId) > nextSerialId) {
        nextSerialId = parseInt(element.SerialId);
      }
    });
    nextSerialId = nextSerialId + 1;

    //######### SECCION PARA GENERAR LOS json PARA GRABAR EN DB Y DESPLEGAR EN PANTALLA ##############

    let json2 = {
      //No incluye la Descripcion del Producto y es para el body de POST /api/agregaregistronota
      SucursalId: SucursalId,
      FolioId: FolioId,
      ClienteId: ClienteId,
      CajeroId: parseInt(sessionStorage.getItem("ColaboradorId")),
      VendedorId: parseInt(sessionStorage.getItem("ColaboradorId")),
      SerialId: nextSerialId,
      CodigoId: arreglo[0].CodigoId,
      CodigoBarras: this.state.CodigoBarras,
      UnidadesRegistradas: Unidades,
      PrecioVentaConImpuesto: parseFloat(arreglo[0].PrecioVentaConImpuesto),
      CategoriaId: CategoriaId,
      Usuario: sessionStorage.getItem("user"),
    };

    let json = {
      //Sí incluye la Descripcion del Producto y es para guardar en this.state.detalles
      SucursalId: SucursalId,
      ClienteId: ClienteId,
      FolioId: FolioId,
      SerialId: nextSerialId,
      CodigoId: arreglo[0].CodigoId,
      CodigoBarras: this.state.CodigoBarras,
      Descripcion: arreglo[0].Descripcion,
      Unidades: Unidades,
      PrecioVentaConImpuesto: arreglo[0].PrecioVentaConImpuesto,
      CategoriaId: CategoriaId,
      Usuario: sessionStorage.getItem("user"),
      ColaboradorId: parseInt(sessionStorage.getItem("ColaboradorId")),
    };

    //#########################################################################################

    if (FolioId > 0) {
      //SI FOLIO ES MAYOR DE CERO INSERTA REGISTRO DE PRODUCTO EN LA DB

      const url = this.props.url + `/api/agregaregistroventapendiente`;
      try {
        const response = await fetch(url, {
          method: "POST",
          body: JSON.stringify(json2),
          headers: {
            authorization: `Bearer ${this.props.accessToken}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.error) {
          console.log(data.error);
          alert(data.error);
          return;
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        return;
      }
    }
    //##################

    detalles.push(json); //Guarda json en detalles para this.state.detalles






      //### VALIDA QUE YA EXISTA EN LA VENTA UN PRODUCTO DE LA "CategoriaId" = 3 (03 LAVAMATICA)#### 
      if(detalles.find(element => parseInt(element.CategoriaId) === 3)){
        let totalTicketCategoria3 = 0;
        let position65;
        detalles.forEach((element,i) => {
          if(parseInt(element.CategoriaId) === 3 && parseInt(element.CodigoId) !== 65){
            totalTicketCategoria3 = totalTicketCategoria3 + (parseFloat(element.PrecioVentaConImpuesto) * parseInt(element.Unidades))
          }
          if(parseInt(element.CodigoId) === 65){
            position65 = i
          }
          return null
        })
        if(position65 !== undefined){
          let precioServicioPorEncargo = totalTicketCategoria3 * parseFloat((this.state.porcentajePorServicio/100))
          detalles[position65].PrecioVentaConImpuesto = precioServicioPorEncargo.toFixed(2)
        }
      }

      //###################### CALCULA EL TOTAL DEL TICKET ###########################
      let totalTicket=0
      detalles.forEach(element => {
        totalTicket+= parseFloat(element.PrecioVentaConImpuesto) * parseInt(element.Unidades)
      })
      //##############################################################################

    // let totalTicket =
    //   parseFloat(this.state.totalTicket) +
    //   parseFloat(arreglo[0].PrecioVentaConImpuesto) * Unidades;

    this.setState({
      detalles: detalles,
      totalTicket: totalTicket,
      CodigoBarras: "",
    });

    this.CodigoBarrasInput.current.focus();
  };

  handleBuscarEnter = (e) => {
    if (e.key === "Enter") {
      this.handleBuscar(e);
    }
  };


  handleCancelar = async (e) => {
    e.preventDefault();
    const FolioId = this.state.FolioId;
    const detalles = this.state.detalles

    if(detalles.length === 0){
      this.CodigoBarrasInput.current.focus()
      if(this.state.CodigoBarras){
        this.setState({
          CodigoBarras: "",
        })
      }
      return
    }

    if(window.confirm("Desea Cancelar la Venta?")){
      document.querySelector(".main").style.cursor = "progress"
    }else{
      return;
    }

    if (parseInt(FolioId) > 0) {
      //Hay una VENTA PENDIENTE en DB y se va cancelar Status="C"

      //Cancela Nota Abierta
      const url = this.props.url + `/api/cancelaventapendiente`;

      const json = {
        SucursalId: this.state.SucursalId,
        FolioId: FolioId,
        ColaboradorId: sessionStorage.getItem("ColaboradorId"),
        Usuario: sessionStorage.getItem("user"),
      };

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
          alert(data.error);
          document.querySelector(".main").style.cursor = "default"
          return;
        }
        alert(data.message);
      } catch (error) {
        console.log(error.message);
        document.querySelector(".main").style.cursor = "default"
        alert(error.message);
      }
    }

    this.setState({
      CodigoBarras: "",
      totalTicket: 0.0,
      detalles: [],
      FolioId: 0,
      ClienteId: 0,
      NotaModificada: false,
    });
    document.querySelector(".main").style.cursor = "default"
    this.CodigoBarrasInput.current.focus();
  };

  handleVentanaDescripcion = async (e) => {
    const VentanaDescripcion = e.target.value.toUpperCase();
    this.setState({
      VentanaDescripcion: VentanaDescripcion,
    });
    let arreglo = [];
    if (VentanaDescripcion.length >= 3) {
      arreglo = await this.getProductosDescripcion(VentanaDescripcion);
    }
    if (arreglo.error) {
      alert(arreglo.error);
      return;
    }
    this.setState({
      VentanaDescripcionDetalles: arreglo,
    });
    this.addRowHandlers();
  };

  handleVentanaDescripcionKeyDown =(e)=>{
    const descripcion = this.state.VentanaDescripcion
    if(e.key==="Enter" && descripcion === ""){
      //document.querySelector(".ventanaproductos").style.display = "none";
      document.querySelector(".ventanaproductos").style.display = !document.querySelector(".ventanaproductos").style.display;
      document.querySelector("#btn-cancelarventa").style.display = "block";
      this.CodigoBarrasInput.current.focus();
    }
  }

  handleEliminar = async (e) => {
    e.preventDefault();
    const SerialId = parseInt(e.target.id);
    const FolioId = this.state.FolioId;
    let arregloDetalles = this.state.detalles;

    if (FolioId !== 0) {
      //Si hay una NOTA abierta pone el registro con "Status"='C' en la base de datos.
      const CodigoId = arregloDetalles.filter(
        (element) => element.SerialId === parseInt(SerialId)
      )[0].CodigoId;

      const json = {
        SucursalId: this.state.SucursalId,
        FolioId: FolioId,
        CodigoId: CodigoId,
        SerialId: SerialId,
        Usuario: sessionStorage.getItem("user"),
        ColaboradorId: parseInt(sessionStorage.getItem("ColaboradorId")),
      };
      const url = this.props.url + `/api/eliminaregistroventapendiente`;

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
          console.log(data.error);
          alert(data.error);
          return;
        }
      } catch (error) {
        console.log(error.message);
        alert(error.message);
        return;
      }
    }
    //Aquí se elimina el registro "Cancelado" en el arreglo para ya no desplegarlo en Pantalla.
    //(En Nota grabada en Base de Datos y Nota en Proceso)
    arregloDetalles = arregloDetalles.filter(
      (element) => element.SerialId !== parseInt(SerialId)
      );

    let vtotalTicket = 0;
    for (let i = 0; i < arregloDetalles.length; i++) {
      vtotalTicket +=
        parseFloat(arregloDetalles[i].PrecioVentaConImpuesto) *
        parseInt(arregloDetalles[i].Unidades); //Antes tenía "UnidadesRegistradas" pero lo cambié al Modificar Nota
    }
    if (arregloDetalles.length === 0) {
      //Cancelar Ticket
      this.setState({
        CodigoBarras: "",
        totalTicket: 0.0,
        detalles: [],
        ClienteId: 0,
      });
    } else {
      this.setState({
        CodigoBarras: "",
        detalles: arregloDetalles,
        totalTicket: vtotalTicket,
      });
    }
    this.CodigoBarrasInput.current.focus();
  };

  ventasPendientesRecupera = async (FolioId) => {
    if (this.state.detalles.length === 0) {
      const SucursalId = parseInt(this.state.SucursalId);
      const arregloVentaPendientePorFolio = await this.getVentaPendientePorFolio(
        FolioId
      );
      let totalTicket = 0;
      let arregloDetalles = [];
      let json_elemento;
      let vFolioId;
      let vClienteId;
      let vColaboradorId;
      let vUsuario;
      let json;
      const Usuario = sessionStorage.getItem("user");
      const ColaboradorId = parseInt(sessionStorage.getItem("ColaboradorId"));

      arregloVentaPendientePorFolio.forEach((element) => {
        vFolioId = parseInt(element.FolioId);
        vClienteId = parseInt(element.ClienteId);

        totalTicket +=
          parseFloat(element.PrecioVentaConImpuesto) *
          parseInt(element.UnidadesRegistradas);

        json_elemento = {
          SucursalId: SucursalId,
          ClienteId: vClienteId,
          FolioId: FolioId,
          SerialId: element.SerialId,
          CodigoId: element.CodigoId,
          CodigoBarras: element.CodigoBarras,
          Descripcion: element.Descripcion,
          Unidades: element.UnidadesRegistradas,
          PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
          Usuario: Usuario,
          ColaboradorId: ColaboradorId,
          Accion: "X",
        };
        arregloDetalles.push(json_elemento);
      });

      //###### SECCION PARA SELECCIONAR Y DESPLEGAR, ASI COMO QUITAR TEMPORALMENTE DEL ARREGLO ##############

      const detallesNotaSeleccionada = this.state.ventasPendientes.filter(
        (element) => parseInt(element.FolioId) === parseInt(FolioId)
      );

      const detalleNotasArreglo = this.state.ventasPendientes.filter(
        (element) => parseInt(element.FolioId) !== parseInt(FolioId)
      );

      //################## SECCION PARA FORMAR EL ARREGLO PARA DESPLEGAR ###########################
      vFolioId = 0;
      let detallesPendientes = [];
      let ventasPendientes = [];
      detalleNotasArreglo.forEach((element, i) => {
        if (parseInt(element.FolioId) === parseInt(vFolioId) || i === 0) {
          vFolioId = parseInt(element.FolioId);
          vClienteId = element.ClienteId;
          vColaboradorId = element.ColaboradorId;
          vUsuario = element.Usuario;
          json = {
            CodigoId: element.CodigoId,
            Descripcion: element.Descripcion,
            UnidadesRegistradas: element.UnidadesRegistradas,
            PrecioVentaConImpuesto: element.PrecioVentaConImpuesto,
          };
          detallesPendientes.push(json);
        } else {
          json = {
            SucursalId: SucursalId,
            FolioId: vFolioId,
            ClienteId: vClienteId,
            CajeroId: vColaboradorId,
            VendedorId: vColaboradorId,
            Usuario: vUsuario,
            Status: "P",
            detalles: detallesPendientes,
          };
          ventasPendientes.push(json);
        }
      });
      json = {
        SucursalId: SucursalId,
        FolioId: vFolioId,
        ClienteId: vClienteId,
        CajeroId: vColaboradorId,
        VendedorId: vColaboradorId,
        Usuario: vUsuario,
        Status: "P",
        detalles: detallesPendientes,
      };
      ventasPendientes.push(json);

      //####################################################################

      this.setState({
        detalles: arregloDetalles,
        totalTicket: totalTicket,
        CodigoBarras: "",
        FolioId: FolioId,
        detallesNotaSeleccionada: detallesNotaSeleccionada,
        ventasPendientes: detalleNotasArreglo,
        ClienteId: vClienteId,
      });

      this.CodigoBarrasInput.current.focus();
    }
  };

  handleRender = () => {
    return (
      <React.Fragment>
        <div className="main">
          {/* Catálogo de Clientes */}
          <div className="CatalogoClientes">
            <button className="btn btn-secondary">X</button>
            <br />
            <label htmlFor="">Cliente</label>
            <input onChange={this.handleClienteNombre} id="clientenombre" name="clientenombre" />
            <table id="tableClientes" onClick={this.handlerRowClickedII}>
              <thead>
                <tr>
                  <th>ClienteId</th>
                  <th>Cliente</th>
                </tr>
              </thead>
              <tbody>

              </tbody>
            </table>
          </div>
          <div className="col-md-5 header">
            <select
              onChange={this.handleSucursales}
              id="sucursales"
              name="sucursales"
              value={this.state.SucursalId}
            >
              {this.state.sucursales.map((element, i) => (
                <option key={i} value={element.SucursalId}>
                  {element.Sucursal}
                </option>
              ))}
            </select>
            <select
              onChange={this.handleClientes}
              className="ml-2"
              id="clientes"
              name="clientes"
              value={this.state.ClienteId}
            >
              {this.state.clientes.map((element, i) => (
                <option key={i} value={element.ClienteId}>
                  {element.Cliente}
                </option>
              ))}
            </select>
            <br />
            <label
              htmlFor="codigobarras"
              style={{ fontSize: ".8em", width: "3em" }}
            >
              Código Barras
            </label>
            <input
              onChange={this.handleCodigoBarras}
              onKeyPress={this.handleBuscarEnter}
              id="codigobarras"
              name="codigobarras"
              size="15"
              maxLength="13"
              value={this.state.CodigoBarras}
              ref={this.CodigoBarrasInput}
              autoComplete="off"
            />
            <button
              onClick={this.handleBuscar}
              className="btn btn-primary btn-sm ml-2"
            >
              Buscar
            </button>
            <br />

            <div className="ventanaproductos">
              <label htmlFor="ventanadescripcion" style={{ width: "5rem" }}>
                Descripcion
              </label>
              <input
                onChange={this.handleVentanaDescripcion}
                onKeyDown={this.handleVentanaDescripcionKeyDown}
                id="ventanadescripcion"
                name="ventanadescripcion"
                value={this.state.VentanaDescripcion}
                ref={this.ventanadescripcionInput}
                autoComplete="off"
              />
              <table id="table1" onClick={this.handlerRowClicked}>
                <thead>
                  <tr>
                    <th>Codigo</th>
                    <th>Codigo Barras</th>
                    <th>Descripcion</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.VentanaDescripcionDetalles.map((element, i) => (
                    <tr key={i}>
                      <td>{element.CodigoId}</td>
                      <td>{element.CodigoBarras}</td>
                      <td>{element.Descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <label style={{ fontSize: ".8em", width: "4em" }}>
              Total Unidades
            </label>
            <input
              id="totalUnidades"
              name="totalUnidades"
              size="3"
              maxLength="3"
              type="text"
              value={this.state.detalles.length}
              style={{ textAlign: "right" }}
              readOnly
            />
            <button
              onClick={this.handleCancelar}
              className="btn btn-danger btn-sm ml-5"
              id="btn-cancelarventa"
            >
              <small>CANCELAR TICKET</small>
            </button>
            <br />
          </div>
          <div className="col-md-5">
            <div className="content">
              <ul>
                {this.state.detalles.sort((a,b) => { return a.CodigoId - b.CodigoId}).map((element, i) => (
                  <li key={i}>
                    <small>{element.Descripcion}</small> {element.CodigoBarras}{" "}
                    <br /> <strong>$ {element.PrecioVentaConImpuesto}</strong>
                    <button
                      onClick={(e) => {
                        if (
                          window.confirm(
                            "Are you sure you wish to delete this item?"
                          )
                        )
                          this.handleEliminar(e);
                      }}
                      // id={i}
                      id={element.SerialId}
                      className="btn btn-danger btn-sm ml-2"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {/*DESPLIEGA NOTAS PENDIENTES */}
            <div id="notaspendientes">
              <div>
                <span style={{ fontSize: "0.7rem" }}>
                  <strong>Notas en Proceso</strong>{" "}
                  {/* {this.state.cantidadNotasAbiertas} */}
                  {this.state.ventasPendientes.length}
                </span>
              </div>
              <div>
                <span style={{ fontSize: "0.7rem" }}>
                  <strong>Nota :</strong>
                </span>
                <span className="badge badge-success">
                  {this.state.FolioId}
                </span>
                <br />
              </div>
            </div>
            <div className="notas">
              {/* La siguiente instrucción hace un DISTINCT de los NotaId 
                         {[...new Set(this.state.detallesNotas.map(x => x.NotaId))].map((element,i) => */}
              {/* ( */}
              {/* <button onClick={()=>{this.ventasPendientesRecupera(element)}} key={i}>{element}</button> */}
              {/* ) } */}

              {/* {this.state.NotasEncabezados.map((element, i) => ( */}
              {this.state.ventasPendientes.map((element, i) => (
                <div key={i}>
                  <button
                    onClick={() => {
                      this.ventasPendientesRecupera(element.FolioId);
                    }}
                  >
                    {element.FolioId}
                  </button>
                  <span>{element.Cliente}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-md-5 footer">
            <label style={{ width: "2em" }}>
              <small>
                <strong>Total Ticket</strong>
              </small>
            </label>
            <input
              id="totalTicket"
              name="totalTicket"
              size="8"
              maxLength="8"
              type="text"
              value={"$ " + this.state.totalTicket}
              style={{ textAlign: "right" }}
              readOnly
            />

            <button
              onClick={this.onRegistrarVentas}
              className="btn btn-success btn-sm mt-2"
              id="btn-registrarventa"
            >
              REGISTRAR VENTA
            </button>
            <button
              onClick={this.onRegistrarVentasPendientes}
              className="btn btn-warning btn-sm mt-3"
              style={{ fontSize: "0.77rem" }}
              id="btn-nota"
            >
              {/* REGISTRAR NOTA */}
              VENTA (ON HOLD)
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  };
  render() {
    return this.state.sucursales.length ? (
      <this.handleRender />
    ) : (
      <h3>Loading...</h3>
    );
  }
}

export default PuntoDeVenta;
