import React, { Component } from "react";

class Ingresos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      fecha: '01/01/2020',
      sucursales: [],
      unidadesdenegocio: [],
      cuentascontables: [],
      subcuentascontables: [],
      selectedValueSucursal: "1",
      selectedValueUnidadDeNegocio: "1",
      selectedValueCuentaContable: "10000",
      selectedValueSubcuentaContable: "001"
    };

    this.onHandleFecha = this.onHandleFecha.bind(this);
    this.onHandleSucursales = this.onHandleSucursales.bind(this);
    this.onHandleUnidadesDeNegocio = this.onHandleUnidadesDeNegocio.bind(this);
    this.onHandleCuentasContables = this.onHandleCuentasContables.bind(this);
    this.onHandleSubcuentasContables = this.onHandleSubcuentasContables.bind(this);

    this.ingresoInput = React.createRef();
  }
  
  async componentDidMount() {
    const d = new Date();
    const vfecha =
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + d.getDate()).slice(-2) +
      "/" +
      d.getFullYear();

    //   this.setState({
    //       fecha: vfecha
    //   }, () =>{document.getElementById("fecha").value = this.state.fecha})



      const dataSucursales = await this.getSucursales()
      const dataUnidadesNegocio = await this.getUnidadesNegocio(dataSucursales[1].SucursalId)
      const dataCuentasContables = await this.getCuentasContables(dataSucursales[1].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId)
      const dataSubcuentasContables = await this.getSubcuentasContables(dataSucursales[1].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId,dataCuentasContables[0].CuentaContableId)

      this.setState({
        // fecha: vfecha, 
        fecha:d,
        sucursales: dataSucursales,
        unidadesdenegocio:dataUnidadesNegocio,
        cuentascontables: dataCuentasContables,
        subcuentascontables: dataSubcuentasContables,
        selectedValueSucursal: dataSucursales[1].SucursalId,
        selectedValueUnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocioId,
        selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
        selectedValueSubcuentaContable: dataSubcuentasContables[0].SubcuentaContableId
      })
      this.ingresoInput.current.focus()
  }

  async getSucursales(){
       const url = `http://decorafiestas.com:3001/ingresos/sucursales`
       try{
            const response = await fetch(url,{
                headers:{
                    'Authorization': `Bearer ${this.props.accessToken}`
                }
            })
            const data = await response.json()
            return data
       }catch(error){
           console.log(error.message)
           alert(error.message)
       }
       
  }

  async getUnidadesNegocio(vsucursal){
      const url = `http://decorafiestas.com:3001/ingresos/unidadesdenegocio/${vsucursal}`
      try{
            const response = await fetch(url,{
                headers:{
                    'Authorization': `Bearer ${this.props.accessToken}`
                }
            })
            const data = await response.json()
            return data
      }catch(error){
          console.log(error.message)
          alert(error.message)
      }
  }


async getCuentasContables(vsucursal, vunidadnegocio){
    const url = `http://decorafiestas.com:3001/ingresos/cuentascontables/${vsucursal}/${vunidadnegocio}`
    try{
        const response = await fetch(url,{
            headers:{
                'Authorization': `Bearer ${this.props.accessToken}`
            }
        })
        const data = await response.json()
        return data
    }catch(error){
        console.log(error.message)
        alert(error.message)
    }
}

async getSubcuentasContables(vsucursal,vunidadnegocio,vcuentacontable){
    const url = `http://decorafiestas.com:3001/ingresos/subcuentascontables/${vsucursal}/${vunidadnegocio}/${vcuentacontable}`
    try{
        const response = await fetch(url,{
            headers:{
                'Authorization': `Bearer ${this.props.accessToken}`
            }
        })
        const data = await response.json()
        return data
    }catch(error){
        console.log(error.message)
        alert(error.message)
    }
}

onHandleFecha(event){
    let x = 0
}

onHandleSucursales(event) {
    this.setState({ selectedValueSucursal: event.target.value},
        async ()=>{
            const dataUnidadesNegocio = await this.getUnidadesNegocio(this.state.selectedValueSucursal)
            const dataCuentasContables = await this.getCuentasContables(this.state.selectedValueSucursal,dataUnidadesNegocio[0].UnidadDeNegocioId)
            const dataSubcuentasContables = await this.getSubcuentasContables(this.state.selectedValueSucursal,dataUnidadesNegocio[0].UnidadDeNegocioId,dataCuentasContables[0].CuentaContableId)

            this.setState({
                unidadesdenegocio:dataUnidadesNegocio,
                cuentascontables: dataCuentasContables,
                subcuentascontables: dataSubcuentasContables,
                selectedValueUnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocioId,
                selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
                selectedValueSubcuentaContable: dataSubcuentasContables[0].SubcuentaContableId
            })
        }
        );
        this.ingresoInput.current.focus()
  }

  onHandleUnidadesDeNegocio(event) {
    this.setState({
      selectedValueUnidadDeNegocio: event.target.value}, async()=>{

        const dataCuentasContables = await this.getCuentasContables(this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio)
        const dataSubcuentasContables = await this.getSubcuentasContables(this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,dataCuentasContables[0].CuentaContableId)

        this.setState({
            cuentascontables: dataCuentasContables,
            subcuentascontables: dataSubcuentasContables,
            selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
            selectedValueSubcuentaContable: dataSubcuentasContables[0].SubcuentaContableId
        })
      });
      this.ingresoInput.current.focus()
  }

  onHandleCuentasContables(event) {
    this.setState({
      selectedValueCuentaContable: event.target.value}, async ()=>{
        const dataSubcuentasContables = await this.getSubcuentasContables(this.state.selectedValueSucursal,this.state.selectedValueUnidadDeNegocio,this.state.selectedValueCuentaContable)

        this.setState({
            subcuentascontables: dataSubcuentasContables,
            selectedValueSubcuentaContable: dataSubcuentasContables[0].SubcuentaContableId
        })
      });
      this.ingresoInput.current.focus()
  }



  componentDidUpdate(prevProps, prevState){
    if(prevState.selectedValueSucursal !== this.state.selectedValueSucursal) {
        //alert("prevState = "+prevState.selectedValueSucursal+"  this.state.selectedValueSucursal = "+this.state.selectedValueSucursal)
    }
  }



  onHandleSubcuentasContables(event) {
    this.setState({
      selectedValueSubcuentaContable: event.target.value});
      this.ingresoInput.current.focus()
  }


  onHandleSubmit(e) {
    e.preventDefault();
  }

  render() {
    const styleForm = {
      backgroundColor: "lightgray",
      border: "5px solid gray",
      height: 500,
      width: "90vw",
      padding: 10,
      margin: 10,
    };

    const styleLabel = {
      display: "inlineBlock",
      width: 180,
      padding: "0 10px 0 10px",
    };

    const styleIngresoInput = {
      textAlign: "right",
      margin: "0 0 10px 0",
    };

    const styleFecha = {
      display: "inlineBlock",
      width: 115,
    };

    return (
      <React.Fragment>
        <div className="container">
          <form style={styleForm} onSubmit={this.onHandleSubmit}>
            <h2>
              <span className="badge badge-warning mb-1">Ingresos</span>
            </h2>
            <label forhtml="fecha" style={styleLabel}>
              Fecha :
            </label>
    {/* <input onChange={this.onHandleFecha} type="date" style={styleFecha} name="fecha" id="fecha" value={this.state.fecha} /> */}
    <input onChange={this.onHandleFecha} type="date" name="fecha" id="fecha" value={this.state.fecha} />
            <br />

            <label forhtml="sucursales" style={styleLabel}>
              Sucursal:
            </label>
            <select
              onChange={this.onHandleSucursales}
              id="sucursal"
              name="sucursal"
              value={this.state.selectedValueSucursal}
            >
              {this.state.sucursales.map((element, i) => (
                <option key={i} value={element.SucursalId}>
                  {element.Sucursal}
                </option>
              ))}
            </select>

            <br />
            <label forhtml="unidadesdenegocio" style={styleLabel}>
              Unidad de Negocio:
            </label>
            
            <select
              onChange={this.onHandleUnidadesDeNegocio}
              id="unidadesdenegocio"
              name="unidadesdenegocio"
              value={this.state.selectedValueUnidadDeNegocio}
            >
              {this.state.unidadesdenegocio.map((element, i) => (
                <option key={i} value={element.UnidadDeNegocioId}>
                  {element.UnidadDeNegocio}
                </option>
              ))}
            </select>

            <br />
            <label style={styleLabel} forhtml="cuentaContable">
              Cuenta Contable:
            </label>
            
            <select
              onChange={this.onHandleCuentasContables}
              id="cuentaContable"
              name="cuentaContable"
              value={this.state.selectedValueCuentaContable}
            >
              {this.state.cuentascontables.map((element, i) => (
                <option key={i} value={element.CuentaContableId}>
                  {element.CuentaContable}
                </option>
              ))}
            </select>

            <br />
            <label forhtml="subcuentaContable" style={styleLabel}>
              SubCuenta Contable:
            </label>
           
            <select
              onChange={this.onHandleSubcuentasContables}
              id="subcuentaContable"
              name="subcuentaContable"
              value={this.state.selectedValueSubcuentaContable}
            >
              {this.state.subcuentascontables.map((element, i) => (
                <option key={i} value={element.SubcuentaContableId}>
                  {element.SubcuentaContable}
                </option>
              ))}
            </select>
            <br />

            <label forhtml="ingresoInput" style={styleLabel}>
              Monto Pesos
            </label>
            <input
              style={styleIngresoInput}
              type="numeric"
              step="0.01"
              placeholder="Monto $$$"
              id="ingresoInput"
              name="ingresoInput"
              autoComplete="off"
              min="0.01"
              max="99999"
              size="12"
              maxLength="9"
              required
              ref={this.ingresoInput}
            />
            <br />
            <textarea
              id="comentariosTextaera"
              name="comentariosTextarea"
              cols="30"
              row="2"
              maxLength="75"
              placeholder="Comentarios..."
            ></textarea>
            <br />
            <br />

            <button
              className="btn btn-primary btn-lg btn-block mb-3"
              type="submit"
            >
              Save
            </button>
            <button
              className="btn btn-primary btn-lg btn-block mb-3"
              type="reset"
            >
              Clear
            </button>
          </form>
        </div>
      </React.Fragment>
    );
  }
}

export default Ingresos;
