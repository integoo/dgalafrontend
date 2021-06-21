import React from "react";

import "./ConsultaArticulo.css";

import SelectSucursales from "./cmpnt/SelectSucursales";
import InputCodigoBarras from "./cmpnt/InputCodigoBarras";

class ConsultaArticulo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      SucursalId: "",
      CodigoBarras: "",
      CodigoBarrasDisplay:"",
      CodigoId: "",
      Categoria: "",
      Subcategoria: "",
      //IVAIdProductos: "",
      IVADescripcion:"",
      IVACompraProductos:"",
      IEPSIdProductos: "",
      PadreHijo: "",
      Hermano: "",
      Inventariable: "",
      CompraVenta: "",
      ComisionVentaPorcentaje: "",
      StatusProductos: "",
      FechaHoraProductos: "",
      UsuarioProductos: "",
      UnidadesInventario: "",
      UnidadesTransito: "",
      UnidadesComprometidas: "",
      CostoCompra: "",
      CostoPromedio: "",
      Margen: "",
      MargenReal: "",
      PrecioVentaSinImpuesto:"",
      IVAIdInventario: "",
      IVAInventario: "",
      IVAMontoInventario: "",
      IEPSIdInventario: "",
      IEPSInventario: "",
      IEPSMontoInventario: "",
      PrecioVentaConImpuesto: "",
      Maximo: "",
      Minino: "",
      FechaCambioPrecio: "",
      FechaUltimaVenta: "",
      FechaUltimaCompra: "",
      FechaUltimoTraspasoSalida: "",
      FechaUltimoTaspasoEntrada: "",
      FechaUltimoAjuste: "",
      StatusInventario: "",
      FechaHoraInventario: "",
      UsuarioInventario: "",
      detallesInventarios: [],
    };
    this.CodigoBarrasInput = React.createRef();
  }

  handleSucursal = (SucursalId) => {
    this.setState({
      SucursalId: SucursalId,
    });
    this.onhandleCancel()
    this.CodigoBarrasInput.current.handleRefSucursalId(SucursalId)
    this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
  };

  onhandleCodigoBarras = (CodigoBarras) => {
    this.setState({
      CodigoBarras: CodigoBarras,
      Descripcion: "",
      UnidadesInventario: "",
    });
    if(this.state.CodigoBarrasDisplay){
      this.onhandleCancel()
    }
  };

  onhandleConsulta = async(CodigoBarras, Descripcion, UnidadesInventario, UnidadesDisponibles, CodigoId) => {
      const detalles = await this.handleProductosInventarioPerpetuo(this.state.SucursalId,CodigoId)
      this.setState({
        CodigoBarrasDisplay: CodigoBarras,
        Descripcion: Descripcion,
        CodigoId: CodigoId,
        Categoria: detalles[0].Categoria,
        Subcategoria: detalles[0].Subcategoria,
        //IVAIdProductos: detalles[0].IVAIdProductos,
        IVADescripcion: detalles[0].IVADescripcion,
        IVACompraProductos: detalles[0].IVACompraProductos,
        IEPSIdProductos: detalles[0].IEPSIdProductos,
        PadreHijo: detalles[0].PadreHijo,
        Hermano: detalles[0].Hermano,
        Inventariable: detalles[0].Inventariable,
        CompraVenta: detalles[0].CompraVenta,
        ComisionVentaPorcentaje: detalles[0].ComisionVentaPorcentaje,
        StatusProductos: detalles[0].StatusProductos,
        FechaHoraProductos: detalles[0].FechaHoraProductos,
        UsuarioProductos: detalles[0].UsuarioProductos,
        UnidadesInventario: detalles[0].UnidadesInventario,
        UnidadesTransito: detalles[0].UnidadesTransito,
        UnidadesComprometidas: detalles[0].UnidadesComprometidas,
        CostoCompra: detalles[0].CostoCompra,
        CostoPromedio: detalles[0].CostoPromedio,
        Margen: detalles[0].Margen,
        MargenReal: detalles[0].MargenReal,
        PrecioVentaSinImpuesto: detalles[0].PrecioVentaSinImpuesto,
        IVAIdInventario: detalles[0].IVAIdInventario,
        IVAInventario: detalles[0].IVAInventario,
        IVAMontoInventario: detalles[0].IVAMontoInventario,
        IEPSIdInventario: detalles[0].IEPSIdInventario,
        IEPSInventario: detalles[0].IEPSInventario,
        IEPSMontoInventario: detalles[0].IEPSMontoInventario,
        PrecioVentaConImpuesto: detalles[0].PrecioVentaConImpuesto,
        Maximo: detalles[0].Maximo,
        Minimo: detalles[0].Minimo,
        FechaCambioPrecio: detalles[0].FechaCambioPrecio,
        FechaUltimaVenta: detalles[0].FechaUltimaVenta,
        FechaUltimaCompra: detalles[0].FechaUltimaCompra,
        FechaUltimoTraspasoSalida: detalles[0].FechaUltimoTraspasoSalida,
        FechaUltimoTaspasoEntrada: detalles[0].FechaUltimoTraspasoEntrada,
        FechaUltimoAjuste: detalles[0].FechaUltimoAjuste,
        StatusInventario: detalles[0].StatusInventario,
        FechaHoraInventario: detalles[0].FechaHoraInventario,
        UsuarioInventario: detalles[0].UsuarioInventario,
        detallesInventarios: detalles[1],
      });

      this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()

    //this.UnidadesAjustadasInput.current.focus();
  };

  onhandleCancel = () => {
    this.setState({
      CodigoBarrasDisplay: "",
      Descripcion: "",
      CodigoId: "",
      Categoria: "",
      Subcategoria: "",
      //IVAIdProductos: "",
      IVADescripcion: "",
      IVACompraProductos: "",
      IEPSIdProductos: "",
      PadreHijo: "",
      Hermano: "",
      Inventariable: "",
      CompraVenta: "",
      ComisionVentaPorcentaje: "",
      StatusProductos: "",
      FechaHoraProductos: "",
      UsuarioProductos: "",
      UnidadesInventario: "",
      UnidadesTransito: "",
      UnidadesComprometidas: "",
      CostoCompra: "",
      CostoPromedio: "",
      Margen: "",
      MargenReal: "",
      PrecioVentaSinImpuesto: "",
      IVAIdInventario: "",
      IVAInventario: "",
      IVAMontoInventario: "",
      IEPSIdInventario: "",
      IEPSInventario: "",
      IEPSMontoInventario: "",
      PrecioVentaConImpuesto: "",
      Maximo: "",
      Minimo: "",
      FechaCambioPrecio: "",
      FechaUltimaVenta: "",
      FechaUltimaCompra: "",
      FechaUltimoTraspasoSalida: "",
      FechaUltimoTaspasoEntrada: "",
      FechaUltimoAjuste: "",
      StatusInventario: "",
      FechaHoraInventario: "",
      UsuarioInventario: "",
      detallesInventarios: [],
    });

    //this.CodigoBarrasInput.current.handleRefCodigoBarrasInput()
};

  handleProductosInventarioPerpetuo = async (SucursalId,CodigoId) =>{
      const url=this.props.url+`/api/consultaproductosinventarioperpetuo/${SucursalId}/${CodigoId}`
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
            data = {"error": error.message}
            console.log(error.message)
            alert(error.message)
        }
        return data
  }

  handleRender = () => {
    return (
      <div className="">
        <label htmlFor="">Sucursales</label>
        <SelectSucursales
          accessToken={this.props.accessToken}
          url={this.props.url}
          SucursalAsignada={this.state.SucursalId}
          onhandleSucursal={this.handleSucursal}
          Administrador={this.state.Administrador}
        />
        <InputCodigoBarras
          accessToken={this.props.accessToken}
          url={this.props.url}
          handleCodigoBarrasProp={this.onhandleCodigoBarras}
          handleConsultaProp={this.onhandleConsulta}
          CodigoBarrasProp={this.state.CodigoBarras}
          SoloInventariable={this.state.SoloInventariable}
          ref={this.CodigoBarrasInput}
        />
        <label htmlFor="">Descripcion</label>
        <input
          id="descripcion"
          name="descripcion"
          value={this.state.Descripcion}
          style={{width: "45rem"}}
          readOnly
        />
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="">Código Barras</label>
            <input id="codigobarras" name="codigobarras" value={this.state.CodigoBarrasDisplay} readOnly/>
            <br />
            <label htmlFor="">Código</label>
            <input id="codigo" name="codigo" value={this.state.CodigoId} readOnly/>
            <br />
            <label htmlFor="">Categoría</label>
            <input id="categoria" name="categoria" value={this.state.Categoria} readOnly/>
            <br />
            <label htmlFor="">Subcategoría</label>
            <input id="subcategoria" name="subcategoria" value={this.state.Subcategoria} readOnly/>
            <br />
            <label htmlFor="">IVA (Productos)</label>
            <input id="ivaid" name="ivaid" value={this.state.IVADescripcion} readOnly/>
            <br />
            <label htmlFor="">IVACompra (Productos)</label>
            <input id="ivacompra" name="ivacompra" value={this.state.IVACompraProductos} readOnly/>
            <br />
            <label htmlFor="">IEPSId</label>
            <input id="iepsid" name="iepsid" value={this.state.IEPSIdProductos} readOnly/>
            <br />
            <label htmlFor="">PadreHijo</label>
            <input id="padrehijo" name="padrehijo" value={this.state.PadreHijo} readOnly/>
            <br />
            <label htmlFor="">Hermano</label>
            <input id="hermano" name="hermano" value={this.state.Hermano} readOnly/>
            <br />
            <label htmlFor="">Inventariable</label>
            <input id="inventariable" name="inventariable" value={this.state.Inventariable} readOnly/>
            <br />
            <label htmlFor="">CompraVenta</label>
            <input id="compraventa" name="compraventa" value={this.state.CompraVenta} readOnly/>
            <br />
            <label htmlFor="">Comision Venta Porcentaje</label>
            <input
              id="comisionventaporcentaje"
              name="comisionventaporcentaje"
              value={this.state.ComisionVentaPorcentaje}
              readOnly
            />
            <br />
            <label htmlFor="">Status (Productos)</label>
            <input id="statusproductos" name="statusproductos" value={this.state.StatusProductos} readOnly/>
            <br />
            <label htmlFor="">FechaHora (Productos)</label>
            <input id="fechahoraproductos" name="fechahoraproductos" value={this.state.FechaHoraProductos} readOnly/>
            <br />
            <label htmlFor="">Usuario (Productos)</label>
            <input id="usuarioproductos" name="usuarioproductos" value={this.state.UsuarioProductos} readOnly/>
          </div>
          <div className="col-md-4">
            <label htmlFor="">Unidades Inventario</label>
            <input id="unidadesinventario" name="unidadesinventario" value={this.state.UnidadesInventario} readOnly/>
            <br />
            <label htmlFor="">Unidades Transito</label>
            <input id="unidadestransito" name="unidadestransito" value={this.state.UnidadesTransito} readOnly/>
            <br />
            <label htmlFor="">Unidades Comprometidas</label>
            <input id="unidadescomprometidas" name="unidadescomprometidas" value={this.state.UnidadesComprometidas} readOnly/>
            <br />
            <label htmlFor="">Costo Compra</label>
            <input id="costocompra" name="costocompra" value={this.state.CostoCompra} readOnly/>
            <br />
            <label htmlFor="">Costo Promedio</label>
            <input id="costopromedio" name="costopromedio" value={this.state.CostoPromedio} readOnly/>
            <br />
            <label htmlFor="">Margen</label>
            <input id="margen" name="margen" value={this.state.Margen} readOnly/>
            <br />
            <label htmlFor="">Margen Real</label>
            <input id="margenreal" name="margenreal" value={this.state.MargenReal} readOnly/>
            <br />
            <label htmlFor="">Precio Venta Sin Impuesto</label>
            <input id="precioventasinimpuesto" name="precioventasinimpuesto" value={this.state.PrecioVentaSinImpuesto} readOnly/>
            <br />
            <label htmlFor="">IVAId (Inventario Perpetuo)</label>
            <input id="ivaidip" name="ivaidip" value={this.state.IVAIdInventario} readOnly/>
            <br />
            <label htmlFor="">IVA</label>
            <input id="ivaip" name="ivaip" value={this.state.IVAInventario} readOnly/>
            <br />
            <label htmlFor="">IVAMonto</label>
            <input id="ivamonetoip" name="ivamontoip" value={this.state.IVAMontoInventario} readOnly/>
            <br />
            <label htmlFor="">IEPSId (Inventario Perpetuo)</label>
            <input id="iepsidip" name="iepsidip" value={this.state.IEPSIdInventario} readOnly/>
            <br />
            <label htmlFor="">IEPS</label>
            <input id="iepsip" name="iepsip" value={this.state.IEPSInventario} readOnly/>
            <br />
            <label htmlFor="">IEPSMonto</label>
            <input id="iepsmonetoip" name="iepsmontoip" value={this.state.IEPSMontoInventario} readOnly/>
            <br />
            <label htmlFor="">Precio Venta Con Impuesto</label>
            <input id="precioventaconimpuesto" name="precioventaconimpuesto" value={this.state.PrecioVentaConImpuesto} readOnly/>
            <br />
            <label htmlFor="">Máximo</label>
            <input id="maximo" name="maximo" value={this.state.Maximo} readOnly/>
            <br />
            <label htmlFor="">Mínimo</label>
            <input id="minimo" name="minimo" value={this.state.Minimo} readOnly/>
            </div>
            <div className="col-md-4">
            <label htmlFor="">Fecha Cambio Precio</label>
            <input id="fechacambioprecio" name="fechacambioprecio" value={this.state.FechaCambioPrecio} readOnly/>
            <br />
            <label htmlFor="">Fecha Última Venta</label>
            <input id="fechaultimaventa" name="fechaultimventa" value={this.FechaUltimaVenta} readOnly/>
            <br />
            <label htmlFor="">Fecha Última Compra</label>
            <input id="fechaultimacompra" name="fechaultimacompra" value={this.state.FechaUltimaCompra} readOnly/>
            <br />
            <label htmlFor="">Fecha Último Traspaso Salida</label>
            <input id="fechaultimotraspasosalida" name="fechaultimotraspasosalida" value={this.state.FechaUltimoTraspasoSalida} readOnly/>
            <br />
            <label htmlFor="">Fecha Último Traspaso Entrada</label>
            <input id="fechaultimotraspasoentrada" name="fechaultimotraspasoentrada" value={this.state.FechaUltimoTraspasoEntrada} readOnly/>
            <br />
            <label htmlFor="">Fecha Último Ajuste</label>
            <input id="fechaultimoajuste" name="fechaultimoajuste" value={this.state.FechaUltimoAjuste} readOnly/>
            <br />
            <label htmlFor="">Status (IP)</label>
            <input id="statusip" name="statusip" value={this.state.StatusInventario} readOnly/>
            <br />
            <label htmlFor="">FechaHora (IP)</label>
            <input id="fechahoraip" name="fechahoraip" value={this.state.FechaHoraInventario} readOnly/>
            <br />
            <label htmlFor="">Usuario (IP)</label>
            <input id="usuarioip" name="usuarioip" value={this.state.UsuarioInventario} readOnly/>
            <div className="containerTable1">
              <table id="table1" className="table1className">
                  <thead>
                      <tr>
                          <th style={{width:"10rem",textAlign:"center"}}>Sucursal</th>
                          <th style={{textAlign:"center"}}>Unidades Disponibles</th>
                      </tr>
                  </thead>
                  <tbody>
                    {this.state.detallesInventarios.map((element,i) =>(
                      <tr>
                        <td>{element.Sucursal}</td>
                        <td style={{textAlign:"right"}}>{element.UnidadesDisponibles}</td>
                      </tr>
                    ))}
                  </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <div className="container">
          <this.handleRender />
        </div>
      </React.Fragment>
    );
  }
}

export default ConsultaArticulo;
