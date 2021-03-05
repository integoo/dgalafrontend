import React from "react";
import "./ComprasRecepcion.css";

class ComprasRecepcion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      detalles: [],
      sucursales: [],
      SucursalId: 1,
      unidadesdenegocioCatalogo:[],
      unidadesdenegocio: [],
      UnidadDeNegocioId: 1,
      proveedores: [],
      ProveedorId: 1,
      IVAProveedor: "",
      IVA: "",
      IVACompra:"",
      NumeroFactura: "",
      TotalFactura: "",
      CodigoId: 0,
      //IVAId: 0,
      //IVADescripcion: "",
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
    };
    this.unidadesInput = React.createRef();
    this.costoCompraInput = React.createRef();
    this.codigoBarrasInput = React.createRef();
    this.facturaInput = React.createRef();
  }

  async componentDidMount() {
    const arregloSucursales = await this.getSucursales();
    if (arregloSucursales.error) {
      alert(arregloSucursales.error);
      return;
    }

    let arregloUnidadesDeNegocio = await this.getUnidadesDeNeogicio();
    if (arregloUnidadesDeNegocio.error) {
      alert(arregloUnidadesDeNegocio.error);
      return;
    }
    const arregloUnidadesDeNegocioCatalogo = arregloUnidadesDeNegocio;
    arregloUnidadesDeNegocio = arregloUnidadesDeNegocio.filter(element => element.SucursalId === this.state.SucursalId)

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
      unidadesdenegocioCatalogo: arregloUnidadesDeNegocioCatalogo,
      unidadesdenegocio: arregloUnidadesDeNegocio,
      proveedores: arregloProveedores,
      IVAProveedor: arregloProveedores[0].IVA,
      socios: arregloSocios,
      SocioId: arregloSocios[0].SocioId,
    });
  }

  async getSucursales() {
    const url = this.props.url + `/api/catalogos/10`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      const vSucursalAsignada = parseInt(sessionStorage.getItem('SucursalId'))
      if(vSucursalAsignada !== 100){
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

  async getUnidadesDeNeogicio() {
    const naturalezaCC = -1;
    const url =
      this.props.url + `/ingresos/unidadesdenegociocatalogo/${naturalezaCC}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      let data = await response.json();
      if (data.length === 0) {
        data = { error: "Erro en Unidades De Negocio" };
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

    const arregloUnidadesDeNegocioCatalogo = this.state.unidadesdenegocioCatalogo
    
    const arregloUnidadesDeNegocio = arregloUnidadesDeNegocioCatalogo.filter(element => element.SucursalId === parseInt(SucursalId))

    this.setState({
      SucursalId: SucursalId,
      unidadesdenegocio: arregloUnidadesDeNegocio,
    });
  };

  handleUnidadesDeNegocio = (e) => {
      const UnidadDeNegocioId = e.target.value;
      this.setState({
          UnidadDeNegocioId: UnidadDeNegocioId,
      });
  }

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
    this.setState({
      TotalFactura: TotalFactura,
    });
  };

  handleSocios = (e) => {
      const SocioId = e.target.value;
      this.setState({
          SocioId: SocioId
      })
      this.codigoBarrasInput.current.focus();
  }

  handleCodigoBarras = (e) => {
    const vCodigoBarras = e.target.value;
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

  handleConsultar = async (e) => {
    e.preventDefault();
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

    const detallesAux = this.state.detalles;
    //Valida si ya existe el producto en el proceso de recepción
    let vposicion = -1;
    for (let i = 0; i < detallesAux.length; i++) {
      if (detallesAux[i].CodigoBarras === this.state.CodigoBarras) {
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
          //IVAId: detallesAux[vposicion].IVAId,
          //IVADescripcion: detallesAux[vposicion].IVADescripcion,
          //IVA: detallesAux[vposicion].IVA,
          IVADescripcion: "IVA "+this.state.IVA+"%",
          IEPSId: detallesAux[vposicion].IEPSId,
          IEPSDescripcion: detallesAux[vposicion].IEPSDescripcion,
          IEPS: detallesAux[vposicion].IEPS,

          Unidades: detallesAux[vposicion].UnidadesRecibidas,
          CostoCompra: detallesAux[vposicion].CostoCompra,
        });
      } else {
        return;
      }
    } else {
        let vIVA=0
        let vIVADescripcion = ""
        if (this.state.IVACompra === 'S'){
            vIVA = this.state.IVA
            vIVADescripcion = "IVA "+this.state.IVA+"%"
        }else{
            vIVADescripcion = "NO IVA COMPRA"
        }
      this.setState({
        CodigoId: arreglo[0].CodigoId,
        Descripcion: arreglo[0].Descripcion,
        //IVAId: arreglo[0].IVAId,
        //IVADescripcion: arreglo[0].IVADescripcion,
        IVA: vIVA,
        IVADescripcion: vIVADescripcion,
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
      CodigoId: 0,
      CodigoBarras: "",
      Descripcion: "",
      Unidades: "",
      CostoCompra: "",
      IVADescripcion:"",
      IEPSDescripcion: ""
    });
    document.querySelector("#codigobarras").disabled = false;
    this.codigoBarrasInput.current.focus();
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
    if (
      this.state.CodigoBarras === "" ||
      this.state.Descripcion === "" ||
      this.state.Unidades === "" ||
      this.state.CostoCompra === "" || 
      this.state.COstoCompra < 0.10
    ) {
      alert("Error en Dato. Revise los campos de la Forma");
      return;
    }
    let detallesAux = this.state.detalles;

    //Valida si ya existe el producto en el proceso de recepción
    let vposicion = -1;
    for (let i = 0; i < detallesAux.length; i++) {
      if (detallesAux[i].CodigoBarras === this.state.CodigoBarras) {
        //alert("El Producto ya existe en el Proceso de Recepción")
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
        UnidadesRecibidas: this.state.Unidades,
        CostoCompra: this.state.CostoCompra,
        CostoCompraSinImpuestos: vCostoCompraSinImpuestos,
        //IVAId: this.state.IVAId,
        //IVA: this.state.IVA,
        IVA: this.state.IVA,
        IVAMonto: vIVAMonto,
        IEPSId: this.state.IEPSId,
        IEPS: this.state.IEPS,
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
    //let extCostoCompraSinImpuestos = 0;
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
    document.querySelector("#unidaddenegocio").disabled = true;
    document.querySelector("#proveedores").disabled = true;
    document.querySelector("#IVAProveedor").disabled = true;
    document.querySelector("#factura").disabled = true;
    document.querySelector("#totalfactura").disabled = true;
    document.querySelector("#socios").disabled = true;
    this.setState({
      CodigoId: 0,
      CodigoBarras: "",
      Descripcion: "",
      Unidades: "",
      CostoCompra: "",
      extCostoCompraSinImpuestos: extCostoCompra - extIVAMonto - extIEPSMonto,
      extIVAMonto: extIVAMonto,
      extIEPSMonto: extIEPSMonto,
      extCostoCompra: extCostoCompra,
      IVADescripcion: "",
      IEPSDescripcion: "",
    });

    document.querySelector("#codigobarras").disabled = false;

    this.codigoBarrasInput.current.focus();
  };

  numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  handleSubmit = (e) => {
    e.preventDefault();
    // if(this.state.detalles.length === 0){
    //     alert("No hay Productos Recibidos")
    //     return
    // }
    // if(window.confirm("Seguro?")){
    //     alert("En Proceso...!!!")

    // }
  };

  handleGrabar = async () => {
    if(this.state.detalles.length === 0){
        alert("No hay Productos Recibidos")
        return
    }

    
    let json={SucursalId: this.state.SucursalId,
        UnidadDeNegocioId: this.state.UnidadDeNegocioId,
        ProveedorId: this.state.ProveedorId,
        IVAProveedor: this.state.IVA,
        NumeroFactura: this.state.NumeroFactura,
        TotalFactura: this.state.TotalFactura,
        SocioId: this.state.SocioId,
        Usuario: sessionStorage.getItem('user'), 
        detalles: this.state.detalles
    }
    
    if(window.confirm("Desea Recibir la Orden de Compra?")){
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
            const data = await response.text()
            alert(JSON.stringify(data))

        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

  }

  handleCancelar = () =>{
    this.setState({
        detalles: [],
        //sucursales: [],
        SucursalId: 1,
        //unidadesdenegocioCatalogo:[],
        //unidadesdenegocio: [],
        UnidadDeNegocioId: 1,
        //proveedores: [],
        ProveedorId: 1,
        //IVAProveedor: "",
        //IVA: "",
        //IVACompra:"",
        NumeroFactura: "",
        TotalFactura: "",
        CodigoId: 0,
        //IVAId: 0,
        //IVADescripcion: "",
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
        //socios:[],
        //SocioId: "",
    })
    document.querySelector("#sucursales").disabled = false;
    document.querySelector("#unidaddenegocio").disabled = false;
    document.querySelector("#proveedores").disabled = false;
    document.querySelector("#factura").disabled = false;
    document.querySelector("#totalfactura").disabled = false;
    document.querySelector("#socios").disabled = false;

  }
  

  handleRender = () => {
    return (
      <React.Fragment>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
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
            <label htmlFor="unidaddenegocio">Unidad de Negocio</label>
            <select
              onChange={this.handleUnidadesDeNegocio}
              id="unidaddenegocio"
              name="unidaddenegocio"
              value={this.state.UnidadDeNegocioId}
            >
                {this.state.unidadesdenegocio.map((element,i) =>(
                    <option key={i} value={element.UnidadDeNegocioId}>
                        {element.UnidadDeNegocio}
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
            <input id="IVAProveedor" name="IVAProveedor" value={this.state.IVAProveedor+"%"} disabled/>
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
            <label htmlFor="codigoBarras">Código Barras</label>
            <br />
            <input
              onChange={this.handleCodigoBarras}
              onKeyDown={this.handleCodigoBarrasEnter}
              id="codigobarras"
              name="codigobarras"
              size="15"
              maxLength="13"
              value={this.state.CodigoBarras}
              ref={this.codigoBarrasInput}
              autoComplete="off"
            />
            <button
              type="button"
              onClick={this.handleConsultar}
              id="btn-consultar"
              className="btn btn-primary btn-sm m-1"
            >
              Consultar
            </button>
            <br />
            <input
              id="iva"
              name="iva"
              value={this.state.IVADescripcion}
              disabled
            />
            <input
              id="ieps"
              name="ieps"
              value={this.state.IEPSDescripcion}
              disabled
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
            <label htmlFor="costocompra">
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
              autocomplete="off"
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
              autocomplete="off"
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
                  <tr>
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
            <label>Ext Costo Compra Sin Impuestos</label>
            <label>Ext IEPS</label>
            <label>Ext IVA</label>
            <label>Ext Costo Compra</label>
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
            />
            <input
              id="extIEPSMonto"
              name="extIEPSMonto"
              style={{ textAlign: "right" }}
              value={"$ " + this.state.extIEPSMonto.toFixed(2)}
            />
            <input
              id="extIVAMonto"
              name="extIVAMonto"
              style={{ textAlign: "right" }}
              value={"$ " + this.state.extIVAMonto.toFixed(2)}
            />
            <input
              id="extCostoCompra"
              name="extCostoCompra"
              style={{ textAlign: "right" }}
              value={
                "$ " +
                this.numberWithCommas(this.state.extCostoCompra.toFixed(2))
              }
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
    return this.state.proveedores !== "" ? (
      <this.handleRender />
    ) : (
      <h3>Loading . . .</h3>
    );
  }
}

export default ComprasRecepcion;
