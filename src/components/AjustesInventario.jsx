import React from 'react';

import SelectSucursales from './cmpnt/SelectSucursales';
import InputCodigoBarras from './cmpnt/InputCodigoBarras';

class AjustesInventario extends React.Component{
    constructor(props){
        super(props)

        this.state={
            detalles:[],
            CodigoBarras: "",
            Descripcion: "",
            UnidadesInventario:"",
        }
    }


    handleSucursal = (SucursalId) =>{
        this.setState({
            SucursalId: SucursalId,
        })
    }

    onhandleCodigoBarras = (CodigoBarras,Descripcion) =>{
        this.setState({
            CodigoBarras: CodigoBarras,
            Descripcion: Descripcion,
        })
    }

    onhandleRender = () =>{
        return(
        <div className="mainAjustesInventario">
            <h4>Ajustes Inventario</h4>
            <SelectSucursales accessToken={this.props.accessToken} url={this.props.url} SucursalAsignada={sessionStorage.getItem("SucursalId")} onhandleSucursal={this.handleSucursal} />
            <InputCodigoBarras accessToken={this.props.accessToken} url={this.props.url} handleCodigoBarrasProp = {this.onhandleCodigoBarras} />               
            <input id="descripcion" name="descripcion" size="40" maxLength="38" value={this.state.Descripcion} readOnly/>
            <br />
            <label htmlFor="">Unidades Inventario</label>
            <input id="unidadesinventario" name="unidadesinventario" size="6" value={this.state.UnidadesInventario} readOnly/>
        </div>
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="container">
                    <this.onhandleRender />
                </div>
            </React.Fragment>
        )
    }
}
export default AjustesInventario;