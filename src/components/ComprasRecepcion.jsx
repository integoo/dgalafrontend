import React from "react";
import "./ComprasRecepcion.css";

import InputCodigoBarras from './cmpnt/InputCodigoBarras'

class ComprasRecepcion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detalles: [],
      sucursales: [],
      SucursalId: 1,
      proveedores: [],
      ProveedorId: 1,
      IVAProveedor: "",
      IVA: "",
      IVACompra:"",
      NumeroFactura: "",
      TotalFactura: 0.00,
      CodigoId: "",
      UnidadesInventario:"",
      //IVAId: 0,
      IVADescripcion: "",
      //IVA: 0,
      IVAMonto: 0.0,
      extIVAMonto: 0.0,
      IEPSId: 0,
      IEPSDescripcion: "",
      IEPS: 0,
      IEPSMonto: 0.0,
      extIEPSMonto: 0.0,
      CodigoBarras: "",
      Descripcion: "",
      Unidades: "",
      CostoCompra: "",
      extCostoCompraSinImpuestos: 0.0,
      extCostoCompra: 0.0,
      socios:[],
      SocioId: "",
      SoloInventariable: 'S',
    };
    this.unidadesInput = React.createRef();
    this.costoCompraInput = React.createRef();
    this.CodigoBarrasInput = React.createRef();
    this.facturaInput = React.createRef();
  }

  async componentDidMount() {
    const arregloSucursales = await this.getSucursales();
    if (arregloSucursales.error) {
      alert(arregloSucursales.error);
      return;
    }

    const arregloProveedores = await this.getProveedores();
    if (arregloProveedores.error) {
      alert(arregloProveedores.error);
      return;
    }

    const arregloSocios = await this.getSocios();
    if(arregloSocios.error){
        alert(arregloSocios.error);
        return;
    }

    this.setState({
      sucursales: arregloSucursales,
      proveedores: arregloProveedores,
      IVAProveedor: arregloProveedores[0].IVA,
      socios: arregloSocios,
      SocioId: arregloSocios[0].SocioId,
    });
  }

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
      const vSucursalAsignada = parseInt(sessionStorage.getItem('SucursalId'))
      // if(vSucursalAsignada !== 100){
      if(Administrador !== 'S'){
          data = data.filter(element => element.SucursalId === vSucursalAsignada)
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

  async getProveedores() {
    const url = this.props.url + `/api/catalogos/11`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "Error en Proveedores" };
      }
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  }

  async getSocios(){
      const url = this.props.url + `/api/catalogos/12`;
      try{
          const response = await fetch(url, {
              headers: {
                  Authorization: `Bearer ${this.props.accessToken}`,
              },
          });
          let data = await response.json();
          if(data.length === 0){
              data = {error: "Error en Socios"};
          }
          return data;
      }catch(error){
          console.log(error.message)
          alert(error.message)
      }
  }

  async getProducto(id) {
    const url = this.props.url + `/api/productodescripcion/${id}`;
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

  handleSucursales = (e) => {
    const SucursalId = e.target.value;
    this.setState({
      SucursalId: SucursalId,
    });
    this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
  };

  handleProveedores = (e) => {
    const ProveedorId = e.target.value;
    const arregloProveedores = this.state.proveedores;
    const IVAProveedor = arregloProveedores.find(element => element.ProveedorId === parseInt(ProveedorId))

    this.setState({
      ProveedorId: ProveedorId,
      IVAProveedor: IVAProveedor.IVA
    });
    this.facturaInput.current.focus();
  };

  handleFactura = (e) => {
    const NumeroFactura = e.target.value;
    this.setState({
      NumeroFactura: NumeroFactura.toUpperCase(),
    });
  };

  handleTotalFactura = (e) => {
    const TotalFactura = e.target.value;
    if(TotalFactura > 9999999999){
      alert("Error: El Dato de Total Factura está fuera de Rango")
      return
    }
    this.setState({
      TotalFactura: TotalFactura,
    });
  };

  handleSocios = (e) => {
      const SocioId = e.target.value;
      this.setState({
          SocioId: SocioId
      })
      //this.CodigoBarrasInput.current.focus();
  }

  handleCodigoBarras = (e) => {
    const vCodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: vCodigoBarras,
    });
  };

  handleCodigoBarrasEnter = (e) => {
    if (e.key === "Enter") {
      if (this.state.CodigoBarras !== "") {
        this.handleConsultar(e);
      } else {
        alert("Código de Barras Inválido");
        return;
      }
    }
  };

  //handleConsultar = async (e) => {
  handleConsultar = async () => {
    //e.preventDefault();
    let arreglo = [];
    if (this.state.CodigoBarras !== "") {
      arreglo = await this.getProducto(this.state.CodigoBarras);
    } else {
      alert("Código de Barras Inválido");
      return;
    }
    if (arreglo.error) {
      alert(arreglo.error);
      return;
    }
    if(arreglo[0].CompraVenta === 'V'){
      alert("Producto es solo para VENTA")
      this.setState({
        CodigoId: "",
        CodigoBarras: "",
        Descripcion: "",
        Unidades: "",
        CostoCompra: "",
        IVADescripcion:"",
        IEPSDescripcion: ""
      });

      document.querySelector("#codigobarras").disabled = false;
      this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
      //this.CodigoBarrasInput.current.focus()
      return
    }

    const detallesAux = this.state.detalles;
    //Valida si ya existe el producto en el proceso de recepción
    let vposicion = -1;
    for (let i = 0; i < detallesAux.length; i++) {
      //if (detallesAux[i].CodigoBarras === this.state.CodigoBarras) {
      if (detallesAux[i].CodigoId === arreglo[0].CodigoId) {
        vposicion = i;
        continue;
      }
    }

    if (vposicion !== -1) {
      if (
        window.confirm(
          "El Producto ya existe en en el Proceso de Recepción. Deseas Modificarlo?"
        )
      ) {
        this.setState({
          CodigoId: detallesAux[vposicion].CodigoId,
          Descripcion: detallesAux[vposicion].Descripcion,
          IVADescripcion: detallesAux[vposicion].IVADescripcion,
          IEPSId: detallesAux[vposicion].IEPSId,
          IEPSDescripcion: detallesAux[vposicion].IEPSDescripcion,
          IEPS: detallesAux[vposicion].IEPS,

          Unidades: detallesAux[vposicion].UnidadesRecibidas,
          CostoCompra: detallesAux[vposicion].CostoCompra,
        });
      } else {
        this.setState({
          CodigoId: "",
          CodigoBarras: "",
          Descripcion: "",
          UnidadesInventario:"",
          IVADescripcion:"",
          IEPSDescripcion: "",
        })
        this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
        return;
      }
    } else {
        let vIVA=0
        let vIVADescripcion = ""
        let vIVAMonto = 0
        if (arreglo[0].IVACompra === 'S'){
          if(arreglo[0].IVAId <= 2){
            vIVA = arreglo[0].IVA
            //vIVA = 0
            vIVADescripcion = arreglo[0].IVADescripcion
          }else{
            vIVADescripcion = "IVA "+this.state.IVAProveedor+"%"
            vIVA = this.state.IVAProveedor
          }
            vIVAMonto = parseFloat(arreglo[0].CostoCompra) * parseFloat(vIVA)/100
        }else{
            vIVADescripcion = "NO IVA COMPRA"
            vIVA = 0
            vIVAMonto = 0
        }
      this.setState({
        CodigoId: arreglo[0].CodigoId,
        Descripcion: arreglo[0].Descripcion,
        IVA: vIVA,
        IVADescripcion: vIVADescripcion,
        IVAMonto: vIVAMonto,
        IEPSId: arreglo[0].IEPSId,
        IEPSDescripcion: arreglo[0].IEPSDescripcion,
        IEPS: arreglo[0].IEPS,
        IVACompra: arreglo[0].IVACompra,
      });
    }

    document.querySelector("#codigobarras").disabled = true;
    this.unidadesInput.current.focus();
  };

  handleAgregarCancelar = (e) => {
    e.preventDefault();
    this.setState({
      CodigoId: "",
      CodigoBarras: "",
      Descripcion: "",
      UnidadesInventario: "",
      Unidades: "",
      CostoCompra: "",
      IVADescripcion:"",
      IEPSDescripcion: ""
    });
    document.querySelector("#codigobarras").disabled = false;
    //this.CodigoBarrasInput.current.focus();
    this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
  };

  handleUnidades = (e) => {
    const re = /^[0-9\b]+$/;
    if (e.target.value === "" || re.test(e.target.value)) {
      const Unidades = e.target.value;
      if (Unidades < 0) {
        alert("No se permite recibir Unidades NEGATIVAS");
        return;
      }
      this.setState({
        Unidades: Unidades,
      });
    }
  };

  handleUnidadesEnter = (e) => {
    if (e.key === "Enter") {
        if(e.target.value === "") return;

      this.costoCompraInput.current.focus();
    }
  };

  handleCostoCompra = (e) => {
    const CostoCompra = e.target.value;
    if (CostoCompra < 0) {
      alert("No se permite registrar Costo Compra NEGATIVO");
      return;
    }
    this.setState({
      CostoCompra: CostoCompra,
    });
  };

  handleCostoCompraEnter = (e) => {
      if(e.key === 'Enter'){
         if(e.target.value === "") {
             return
         }else{
             this.handleAgregar()
         }
      }
  }

  handleAgregar = (e) => {
    if(this.state.TotalFactura === ""){
      alert("Total Factura debe ser Número")
      return
    }
    if (
      this.state.CodigoId === "" || parseInt(this.state.CodigoId) === 0 ||
      this.state.CodigoBarras === "" ||
      this.state.Descripcion === "" ||
      this.state.Unidades === "" ||
      this.state.CostoCompra === "" || 
      this.state.CostoCompra < 0.10
    ) {
      alert("Error en Dato. Revise los campos de la Forma");
      return;
    }
    let detallesAux = this.state.detalles;

    //Valida si ya existe el producto en el proceso de recepción
    let vposicion = -1;
    for (let i = 0; i < detallesAux.length; i++) {
      if (detallesAux[i].CodigoBarras === this.state.CodigoBarras) {
        vposicion = i;
        continue;
      }
    }

    const vCostoCompraSinImpuestos =
    this.state.CostoCompra /
    (1 + (parseFloat(this.state.IVA) + parseFloat(this.state.IEPS)) / 100);
    const vIVAMonto =
      (vCostoCompraSinImpuestos * parseFloat(this.state.IVA)) / 100;
    const vIEPSMonto =
      (vCostoCompraSinImpuestos * parseFloat(this.state.IEPS)) / 100;

    if (vposicion === -1) {
      const json = {
        CodigoId: this.state.CodigoId,
        CodigoBarras: this.state.CodigoBarras,
        Descripcion: this.state.Descripcion,
        UnidadesRecibidas: parseInt(this.state.Unidades),
        CostoCompra: parseFloat(this.state.CostoCompra),
        CostoCompraSinImpuestos: parseFloat(vCostoCompraSinImpuestos),
        IVADescripcion: this.state.IVADescripcion,
        IEPSDescripcion: this.state.IEPSDescripcion,
        IVA: parseFloat(this.state.IVA),
        IVAMonto: vIVAMonto,
        IEPSId: this.state.IEPSId,
        IEPS: parseFloat(this.state.IEPS),
        IEPSMonto: vIEPSMonto,
      };

      detallesAux.push(json);
    } else {
      detallesAux[vposicion].UnidadesRecibidas = this.state.Unidades;
      detallesAux[vposicion].CostoCompra = this.state.CostoCompra;
      detallesAux[vposicion].CostoCompraSinImpuestos = vCostoCompraSinImpuestos;
      detallesAux[vposicion].IVAMonto = vIVAMonto;
      detallesAux[vposicion].IEPSMonto = vIEPSMonto;
    }

    this.setState({
      detalles: detallesAux,
    });
    let extCostoCompra = 0;
    let extIVAMonto = 0;
    let extIEPSMonto = 0;
    detallesAux.map((element, i) => {
      extCostoCompra +=
        parseInt(element.UnidadesRecibidas) * parseFloat(element.CostoCompra);
      extIVAMonto +=
        parseInt(element.UnidadesRecibidas) * parseFloat(element.IVAMonto);
      extIEPSMonto +=
        parseInt(element.UnidadesRecibidas) * parseFloat(element.IEPSMonto);
        return null
    });

    document.querySelector("#sucursales").disabled = true;
    document.querySelector("#proveedores").disabled = true;
    document.querySelector("#IVAProveedor").disabled = true;
    document.querySelector("#factura").disabled = true;
    document.querySelector("#totalfactura").disabled = true;
    document.querySelector("#socios").disabled = true;
    this.setState({
      CodigoId: "",
      CodigoBarras: "",
      Descripcion: "",
      Unidades: "",
      UnidadesInventario: "",
      CostoCompra: "",
      extCostoCompraSinImpuestos: extCostoCompra - extIVAMonto - extIEPSMonto,
      extIVAMonto: extIVAMonto,
      extIEPSMonto: extIEPSMonto,
      extCostoCompra: extCostoCompra,
      IVADescripcion: "",
      IEPSDescripcion: "",
    });

    document.querySelector("#codigobarras").disabled = false;

    //this.CodigoBarrasInput.current.focus();
    this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  onhandleCodigoBarras = (CodigoBarras) =>{
    this.setState({
        CodigoBarras: CodigoBarras,
        Descripcion: "",
        //UnidadesInventario:0,
    })
}

  onhandleConsulta = (CodigoBarras,Descripcion,UnidadesInventario) => {
    //alert("Aqui tenemos que adecuar las funcionalidades de handleConsultar")
    this.setState({
        CodigoBarras: CodigoBarras,
        Descripcion: Descripcion,
        UnidadesInventario: UnidadesInventario,
        //UnidadesInventario: UnidadesInventario,
    },()=>{
      this.handleConsultar()
      this.unidadesInput.current.focus()
    })
}

  handleSubmit = (e) => {
    e.preventDefault();
  };

  handleGrabar = async () => {
    const SucursalId = this.state.SucursalId
    if(this.state.detalles.length === 0){
        alert("No hay Productos Recibidos")
        return
    }
    
    let json={SucursalId: this.state.SucursalId,
        ProveedorId: this.state.ProveedorId,
        //IVAProveedor: this.state.IVA,
        IVAProveedor: this.state.IVAProveedor,  //Junio 8 2021
        NumeroFactura: this.state.NumeroFactura,
        TotalFactura: this.state.TotalFactura,
        SocioId: this.state.SocioId,
        Usuario: sessionStorage.getItem('user'), 
        detalles: this.state.detalles
    }
    
    if(window.confirm("Desea Recibir la Orden de Compra en Sucursal "+SucursalId+"?")){
        try{
            const url = this.props.url+`/api/grabarecepcionordencompra`
            const response = await fetch(url,{
                method: "POST",
                body: JSON.stringify(json),
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                    "Content-Type": "application/json"
                },
            });
            //const data = await response.text()
            const data = await response.json()
            if(data.error){
              console.log(data.error)
              alert(data.error)
              return
            }
            alert(JSON.stringify(data))
            this.setState({
              NumeroFactura:"",
              TotalFactura: 0.00,
              CodigoBarras: "",
              Descripcion: "",
              Unidades: "",
              CostoCompra: "",
              detalles: [],
              extCostoCompraSinImpuestos:0.0,
              extIVAMonto: 0.0,
              extIEPSMonto: 0.0,
              extCostoCompra:0.0,
            })
            document.querySelector("#sucursales").disabled = false
            document.querySelector("#proveedores").disabled = false
            document.querySelector("#factura").disabled = false
            document.querySelector("#totalfactura").disabled = false
            document.querySelector("#socios").disabled = false

        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

  }

  handleCancelar = () =>{
    this.setState({
        detalles: [],
        SucursalId: 1,
        UnidadDeNegocioId: 1,
        ProveedorId: 1,
        NumeroFactura: "",
        TotalFactura: 0,
        CodigoId: "",
        UnidadesInventario: "",
        IVAMonto: 0.0,
        extIVAMonto: 0.0,
        IEPSId: 0,
        IEPSDescripcion: "",
        IEPS: 0,
        IEPSMonto: 0.0,
        extIEPSMonto: 0.0,
        CodigoBarras: "",
        Descripcion: "",
        Unidades: "",
        CostoCompra: "",
        extCostoCompraSinImpuestos: 0.0,
        extCostoCompra: 0.0,
    })
    document.querySelector("#sucursales").disabled = false;
    document.querySelector("#proveedores").disabled = false;
    document.querySelector("#factura").disabled = false;
    document.querySelector("#totalfactura").disabled = false;
    document.querySelector("#socios").disabled = false;

    this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
  }
  

  handleRender = () => {
    return (
      <React.Fragment>
        <div className="container">
          <form onSubmit={this.handleSubmit} className="one">
            <span className="badge badge-success">
              <h3>Compras Recepcion</h3>
            </span>
            <br />
            <label htmlFor="sucursales">Sucursales</label>
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
            <br />
            <label htmlFor="proveedores">Proveedores</label>
            <select
              onChange={this.handleProveedores}
              id="proveedores"
              name="proveedores"
              value={this.state.ProveedorId}
            >
              {this.state.proveedores.map((element, i) => (
                <option key={i} value={element.ProveedorId}>
                  {element.Proveedor}
                </option>
              ))}
            </select>
            <label id="labelivaproveedor">IVA</label>
            <input id="IVAProveedor" name="IVAProveedor" value={this.state.IVAProveedor+"%"} disabled readOnly/>
            <br />
            <label htmlFor="factura">Factura</label>
            <input
              onChange={this.handleFactura}
              id="factura"
              name="factura"
              autoComplete="off"
              style={{ textTransform: "uppercase" }}
              value={this.state.NumeroFactura}
              ref={this.facturaInput}
              required
            />
            <br />
            <label htmlFor="totalfactura">Total Factura</label>
            <input
              onChange={this.handleTotalFactura}
              id="totalfactura"
              name="totalfactura"
              type="number"
              step="0.01"
              value={this.state.TotalFactura}
              required
            />
            <br />
            <label>Pago (Socios) </label>
            <select onChange={this.handleSocios} id="socios" name="socios" value={this.state.SocioId}>
                {this.state.socios.map((element,i) => (
                    <option key={i} value={element.SocioId}>{element.Socio}</option>

                ))}
            </select>
            <br />
            {/* <label htmlFor="codigoBarras">Código Barras</label>
            <br />
            <input
              onChange={this.handleCodigoBarras}
              onKeyDown={this.handleCodigoBarrasEnter}
              id="codigobarras"
              name="codigobarras"
              size="15"
              maxLength="13"
              style={{textTransform:"capitalize"}}
              value={this.state.CodigoBarras}
              ref={this.CodigoBarrasInput}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={this.handleConsultar}
              id="btn-consultar"
              className="btn btn-primary btn-sm m-1"
            >
              Consultar
            </button> */}


            <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp = {this.onhandleCodigoBarras} handleConsultaProp = {this.onhandleConsulta} CodigoBarrasProp = {this.state.CodigoBarras} SoloInventariable={this.state.SoloInventariable} ref={this.CodigoBarrasInput}/>
           
            <label htmlFor="">Código</label>
            <input value={this.state.CodigoId} style={{width:"4rem"}} disabled="true" readOnly/>
            <label htmlFor="" className="ml-2" style={{width: "5rem"}}>Unidades Inventario</label>
            <input value={this.state.UnidadesInventario} style={{width:"4rem"}} disabled="true" readOnly/>



            <br />
            <input
              id="iva"
              name="iva"
              value={this.state.IVADescripcion}
              readOnly
            />
            <input
              id="ieps"
              name="ieps"
              value={this.state.IEPSDescripcion}
              className="ml-2"
              readOnly
            />
            <br />
            <label htmlFor="descripcion">Descripción</label>
            <br />
            <input
              id="descripcion"
              name="descripcion"
              size="65"
              value={this.state.Descripcion}
              readOnly
            />
            <br />
            <label htmlFor="unidades">Unidades</label>
            <label htmlFor="costocompra" style={{width:"10rem",marginLeft:"6rem"}}>
              Costo Compra Unitario C/Impuesto
            </label>
            <br />
            <input
              onChange={this.handleUnidades}
              onKeyDown={this.handleUnidadesEnter}
              type="number"
              id="unidades"
              name="unidades"
              size="15"
              autoComplete="off"
              value={this.state.Unidades}
              ref={this.unidadesInput}
            />
            <input
              onChange={this.handleCostoCompra}
              onKeyDown={this.handleCostoCompraEnter}
              type="number"
              step="0.01"
              id="costocompra"
              name="costocompra"
              size="15"
              style={{marginLeft:".5rem"}}
              autoComplete="off"
              value={this.state.CostoCompra}
              ref={this.costoCompraInput}
            />
            <button
              type="button"
              onClick={this.handleAgregar}
              className="btn btn-success btn-sm ml-1"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={this.handleAgregarCancelar}
              className="btn btn-danger btn-sm ml-1"
            >
              Cancelar
            </button>
            <br />
            <br />
            <table>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Código Barras</th>
                  <th>Descripcion</th>
                  <th>Unidades Recibidas</th>
                  <th>Costo Compra</th>
                  <th>Ext Costo Compra</th>
                </tr>
              </thead>
              <tbody>
                {this.state.detalles.map((element, i) => (
                  <tr key={i}>
                    <td>{element.CodigoId}</td>
                    <td>{element.CodigoBarras}</td>
                    <td>{element.Descripcion}</td>
                    <td style={{ textAlign: "right" }}>
                      {element.UnidadesRecibidas}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      ${" "}
                      {this.numberWithCommas(
                        parseFloat(element.CostoCompra).toFixed(2)
                      )}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      ${" "}
                      {this.numberWithCommas(
                        parseFloat(
                          element.CostoCompra *
                            parseInt(element.UnidadesRecibidas)
                        ).toFixed(2)
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <label htmlFor="" style={{marginLeft:"4rem"}}>Ext Costo Compra Sin Impuestos</label>
            <label htmlFor="" style={{marginLeft:"5rem"}}>Ext IEPS</label>
            <label htmlFor="" style={{marginLeft:"5rem"}}>Ext IVA</label>
            <label htmlFor="" style={{marginLeft:"5rem"}}>Ext Costo Compra</label>
            <br />
            <input
              id="extCostoCompraSinImpuestos"
              name="extCostoCompraSinImpuestos"
              style={{ textAlign: "right" }}
              value={
                "$ " +
                this.numberWithCommas(
                  this.state.extCostoCompraSinImpuestos.toFixed(2)
                )
              }
              readOnly
            />
            <input
              id="extIEPSMonto"
              name="extIEPSMonto"
              style={{ textAlign: "right" }}
              value={"$ " + this.state.extIEPSMonto.toFixed(2)}
              readOnly
            />
            <input
              id="extIVAMonto"
              name="extIVAMonto"
              style={{ textAlign: "right" }}
              value={"$ " + this.state.extIVAMonto.toFixed(2)}
              readOnly
            />
            <input
              id="extCostoCompra"
              name="extCostoCompra"
              style={{ textAlign: "right" }}
              value={
                "$ " +
                this.numberWithCommas(this.state.extCostoCompra.toFixed(2))
              }
              readOnly
            />
            <br />
            <button type="button" onClick={this.handleGrabar}  className="btn btn-success btn-lg m-2">
              Grabar
            </button>
            <button type="reset" className="btn btn-danger btn-lg" onClick={this.handleCancelar}>Cancelar</button>
          </form>
        </div>
      </React.Fragment>
    );
  };
  render() {
     return (
       <React.Fragment>
         {this.state.socios.length > 0 ? <this.handleRender /> : <h3>Loading . . .</h3>}
       </React.Fragment>
    )
  }
}

export default ComprasRecepcion;
