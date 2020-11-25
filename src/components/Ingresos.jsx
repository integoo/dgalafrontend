import React, { Component } from 'react';

class Ingresos extends Component {
    constructor(props){
        super(props)
        
        this.state = { 
            count:0,
            sucursales:["1"]
        }
    }

    async componentDidMount(){
            let d = new Date()
            let vfecha = ("0"+(d.getMonth()+1)).slice(-2)+'/'+("0"+d.getDate()).slice(-2)+'/'+ d.getFullYear()
            document.getElementById("fecha").value = vfecha

            //Sucursales
            try{
                const url = 'http://decorafiestas.com:3001/ingresos'
                const response = await fetch(url)
                const data = await response.json()
                this.setState({
                    sucursales:data
                })
            }catch(error){
                console.log(error.message)
                alert("Error 1: "+error.message)
            }
        }

    

    async onHandleSucursales(){
        alert("onHandleSucursales")
        

    }

    onHandleUnidadesDeNegocio(){
        alert("onHandleUnidadesDeNegocio")
    }

    onHandleCuentasContables(){
        alert("onHandleCuentasContables")
    }

    onHandleSubmit(e){
        e.preventDefault()
    }
     

    render() { 
        const styleForm = {
            backgroundColor: "lightgray",
            border: "5px solid gray",
            height: 450,
            width: "90vw",
            padding: 10,
            margin: 10
            
        }

        const styleLabel={
            display: "inlineBlock",
            width: 180,
            padding:"0 10px 0 10px"
        }

        const styleIngresoInput = {
            textAlign:"right",
            margin: "0 0 10px 0"
        }

        const styleFecha={
            display: "inlineBlock",
            width:115
        }

        
        return ( 
            <React.Fragment>
                {/* <p className="badge badge-warning h1">Ingresos Page</p>  */}
                {/* <h2><span className="badge badge-warning m-4">Ingresos</span></h2> */}
                <div className="container">
                    <form style={styleForm} onSubmit={this.onHandleSubmit}>
                        <h2><span className="badge badge-warning mb-1">Ingresos</span></h2>
                        <label forHtml="fecha" style={styleLabel}>Fecha :</label>
                        <input type="date" style={styleFecha} name="fecha" id="fecha" />
                        <br />

                        {/* <label forHtml="sucursales"  style={styleLabel}>Sucursal:</label>
                        <select onChange={this.onHandleSucursales} id="sucursales" name="sucursales">
                        <option value="1">00 Empresa</option>
                        <option value="1" selected>01 San Pedro</option>
                        <option value="2">02 Limón</option>
                        <option value="3">03 Santa María</option>
                        </select> */}

                        {/* <ul>
                    {this.state.sucursales.map((element)=>{<li>{element[0].Sucursal}</li>})}
                        </ul> */}
                        {this.state.sucursales.map((element,i) =><li key={i}>{element.Sucursal}</li>)}

                        <br />
                        <label forHtml="unidadesdenegocio"  style={styleLabel}>Unidad de Negocio:</label>
                        <select onChange={this.onHandleUnidadesDeNegocio} id="unidadesdenegocio" name="unidadesdenegocio">
                        <option value="1">00 Empresa</option>
                        <option value="1">01 Limpiaduría</option>
                        <option value="2">02 Melate</option>
                        </select>
                        <br />
                        {/* <label style = {styleLabel}forHtml="cuentaContable"  style={{"padding":"0 10px 0 10px"}}>Cuenta Contable:</label> */}
                        <label style = {styleLabel}forHtml="cuentaContable">Cuenta Contable:</label>
                        <select onChange={this.onHandleCuentasContables} id="cuentas" name="cuentas">
                        <option value="1">01 Ventas</option>
                        <option value="2">02 Otros Ingresos</option>
                        </select>
                        <br />
                        <label forHtml="subcuentaContable"  style={styleLabel}>SubCuenta Contable:</label>
                        <select id="subcuentas" name="subcuentas">
                        <option value="1">01 Ventas</option>
                        <option value="2">02 Otros Ingresos</option>
                        </select>
                        <br />

                        <label forHtml="ingresoInput" style={styleLabel}>Monto Pesos</label>
                        <input style={styleIngresoInput} type="numeric" step="0.01" placeholder="Monto $$$" id="ingresoInput" name="ingresoInput" autocomplete="off" min="0.01" max="99999" size="12" maxlength="9"/>
                        <br />
                        {/* <label forHtml="comentariosInput" style={styleLabel}>Comentarios</label> */}
                        {/* <input type="text" id="comentariosInput" name="comentariosInput" size="40" maxlength="40" /> */}
                        <textarea id="comentariosTextaera" name="comentariosTextarea" cols="30" row="2" maxlength="75" placeholder="Comentarios..."></textarea>
                        <br />
                        <br />

                        <button className = "btn btn-primary btn-lg btn-block mb-3" type="submit">Save</button>
                        <button className = "btn btn-primary btn-lg btn-block mb-3" type="reset">Clear</button>

                    </form>
                </div>
            </React.Fragment>
        );
    }
}
 
export default Ingresos;