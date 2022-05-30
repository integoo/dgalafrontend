import React, { Component } from 'react';

import './InventarioFaltantes.css'


class InventarioFaltantes extends Component {
    constructor(props){
        super(props)

        this.state = { 
            detalles:[],
            SucursalId:parseInt(sessionStorage.getItem('SucursalId')),
            sucursales: [],
         } 
    }

    async componentDidMount(){
        const SucursalId = this.state.SucursalId
        const arregloSucursales = await this.getSucursales()
        const arregloInventarioFaltantes = await this.getInventarioFaltantes(SucursalId)
        this.setState({
            detalles: arregloInventarioFaltantes,
            sucursales: arregloSucursales,
        })
    }

    async getInventarioFaltantes(SucursalId){
        let data = []
        const url = this.props.url+`/api/inventariofaltantes/${SucursalId}`
        try{
            const response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            data = await response.json()
        }catch(error){
            data = []
            console.log(error.message)
            alert(error.message)
        }
        return data
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

    handleSucursales = async(e) =>{
        const SucursalId = e.target.value
        const arregloInventarioFaltantes = await this.getInventarioFaltantes(SucursalId)
        this.setState({
            SucursalId: SucursalId,
            detalles: arregloInventarioFaltantes
        })
    }

    handleRender = () =>{
        return (
            <React.Fragment>
              <div className="maincontainer">
                  <div className="mainheader">Faltantes Inventario</div>
                  <div className="main">
                      <select 
                          style={{marginTop: "10px"}}
                          onChange={this.handleSucursales}
                          id="Sucursales"
                          name="Sucursales"
                          value={this.state.SucursalId} >
                              {
                                  this.state.sucursales.map((element,i) =>(
                                      <option key={i} value={element.SucursalId}>{element.Sucursal}</option>
                                  ))
                              }
                      </select>
                      <table>
                          <thead>
                              <tr>
                                  <th>Sucursal</th>
                                  <th>Codigo</th>
                                  <th>Descripcion</th>
                                  <th>Máximo</th>
                                  <th>Mínimo</th>
                                  <th>Unidades Inventario</th>
                                  <th>Unidades Desplazadas</th>
                                  <th>Unidades Inventario CEDIS</th>
                              </tr>
                          </thead>
                          <tbody>
                              {this.state.detalles.map((element,i) =>(
                                  <tr key={i}>
                                      <td>{element.SucursalId}</td>
                                      <td>{element.CodigoId}</td>
                                      <td style={{textAlign:"left"}}>{element.Descripcion}</td>
                                      <td>{element.Maximo}</td>
                                      <td>{element.Minimo}</td>
                                      <td>{element.UniInv}</td>
                                      <td>{element.UnidadesDesplazadas}</td>
                                      <td>{element.UniInvCedis}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                      <br />
                  </div>
                  <div className="mainfooter"></div>
              </div>
            </React.Fragment>
          );
    }


    render() { 
        return(
            this.state.sucursales.length > 0 ? <this.handleRender /> : <h3>Loading ...</h3>
        )
    }
}
 
export default InventarioFaltantes;
