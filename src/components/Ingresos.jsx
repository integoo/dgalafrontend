import React, { Component } from "react";

class Ingresos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      fecha: "",
      ingresoInput:"",
      sucursales: [],
      unidadesdenegocio: [],
      cuentascontables: [],
      subcuentascontables: [],
      selectedValueSucursal: "1",
      selectedValueUnidadDeNegocio: "1",
      selectedValueCuentaContable: "10000",
      selectedValueSubcuentaContable: "001",
      comentarios:""
    };

    this.handleFecha = this.handleFecha.bind(this);
    this.onHandleSucursales = this.onHandleSucursales.bind(this);
    this.onHandleUnidadesDeNegocio = this.onHandleUnidadesDeNegocio.bind(this);
    this.onHandleCuentasContables = this.onHandleCuentasContables.bind(this);
    this.onHandleSubcuentasContables = this.onHandleSubcuentasContables.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)

    // this.ingresoInput = React.createRef();
}

//  formatDate(date) {
//     var d = new Date(date),
//         month = '' + (d.getMonth() + 1),
//         day = '' + d.getDate(),
//         year = d.getFullYear();

//     if (month.length < 2) 
//         month = '0' + month;
//     if (day.length < 2) 
//         day = '0' + day;

//     return [year, month, day].join('-');
// }

fechaActual(){
    const d = new Date();
    let vfecha = d.getFullYear()+"-"+
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2);

      return vfecha
}

async componentDidMount() {
    this.ingresoInput = React.createRef();

        const dataSucursales = await this.getSucursales()
        if(dataSucursales.error){
            alert(dataSucursales.error)
            return
        }
        const dataUnidadesNegocio = await this.getUnidadesNegocio(dataSucursales[1].SucursalId)
        if(dataUnidadesNegocio.error){
            alert(dataUnidadesNegocio.error)
            return
        }
        const dataCuentasContables = await this.getCuentasContables(dataSucursales[1].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId)
        if(dataCuentasContables.error){
            alert(dataCuentasContables.error)
            return
        }
        const dataSubcuentasContables = await this.getSubcuentasContables(dataSucursales[1].SucursalId,dataUnidadesNegocio[0].UnidadDeNegocioId,dataCuentasContables[0].CuentaContableId)
        if(dataSubcuentasContables.error){
            alert(dataSubcuentasContables.error)
            return
        }
        this.setState({
          //fecha: vfecha, 
          //fecha:d,
          //fecha: new Date(vfecha),
          fecha: this.fechaActual(),
          sucursales: dataSucursales,
          unidadesdenegocio:dataUnidadesNegocio,
          cuentascontables: dataCuentasContables,
          subcuentascontables: dataSubcuentasContables,
          selectedValueSucursal: dataSucursales[1].SucursalId,
          selectedValueUnidadDeNegocio: dataUnidadesNegocio[0].UnidadDeNegocioId,
          selectedValueCuentaContable: dataCuentasContables[0].CuentaContableId,
          selectedValueSubcuentaContable: dataSubcuentasContables[0].SubcuentaContableId
        })
        try{
            this.ingresoInput.current.focus()
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }

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

handleFecha(event){
    const vfecha = event.target.value
    this.setState({
        fecha: vfecha
    })
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

  handleChange = (event) =>{
    let {value, min, max, step} = event.target
    this.setState({ingresoInput: value})
  }

  handleComentarios = (event) =>{
      let { value } = event.target
      this.setState({comentarios: value})
  }

  handleKeyPress = (event) =>{

  }

  async handleSubmit(event) {
      event.preventDefault();
      
      //#################################### VALIDA INPUT FLOAT #################################
      let value = event.target.ingresoInput.value
      let bandera = true

        //Valida que no haya más de un punto (.)
      let count=0
      for(let i =0; i<value.toString().length; i++){
          if(value.charAt(i) === "."){
              count++
          }
      }
      if(count>1){
          bandera=false
      }
        //Valida que si tiene un solo caracter que no sea punto (.)
      if (count === 1){
       if(value.length === 1){
         bandera=false
        }

      }

        //Valida que el último caracter no sea un punto (.)
      if(value.charAt(value.length-1) === "."){
            bandera = false
      }

        //Valida que solo haya números y punto
      const arreglo = ['0','1','2','3','4','5','6','7','8','9','.']
      for(let i=0;i<value.toString().length; i++){
          let arregloFiltro = arreglo.filter(element => element === value.charAt(i).toString())
          if (!arregloFiltro.length){
              bandera=false
          }
      }
      if(!bandera){
          alert("Error en Monto Pesos")
          this.setState({ingresoInput:""})
          this.ingresoInput.current.focus()
          return
      }
      //#######################################################################################

      let json = {
        "SucursalId": this.state.selectedValueSucursal,
        "UnidadDeNegocioId": this.state.selectedValueUnidadDeNegocio,
        "CuentaContableId": this.state.selectedValueCuentaContable,
        "SubcuentaContableId": this.state.selectedValueSubcuentaContable,
        "Fecha": this.state.fecha,
        "Monto": this.state.ingresoInput,
        "Comentarios": this.state.comentarios
      }

      try{
          const url = `http://decorafiestas.com:3001/ingresos/grabaingresos`
          const response = await fetch(url, {
              method: 'POST',
              body: JSON.stringify(json), //JSON.stringify(data)
              headers:{
                  'Authorization': `Bearer ${this.props.accessToken}`,
                  'Content-Type': 'application/json'
              },
          })
          //const data = await response.json()
          const data = await response.text()
          alert(data)

      }catch(error){
          console.log(error.message)
          alert(error.message)
      }

  }

  deleteItem(event){
      alert(event.target.value)
      alert(event.target.name)
      alert("Si borra")
    //alert(event.target.value)
    console.log(event)
  }
  

  render() {

    const styleMain = {
        display:"flex"
    };

    const styleForm = {
      backgroundColor: "lightgray",
      border: "5px solid gray",
      height: 500,
      width: "40vw",
      minWidth: "430px",
      padding: 10,
      margin: 10,
    };

    const styleDisplayIngresos = {
        backgroundColor: "lightblue",
        border: "5px solid gray",
        height: 500,
        width: "40vw",
        minWidth: "430px",
        padding: 10,
        margin: 10,
    }

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

    const styleSelect = {
        display: "inlineBlock",
        width: 215
    }

    return (
      <React.Fragment>
        <div className="container" style={styleMain}>
          <form style={styleForm} onSubmit={this.handleSubmit}>
            <h2>
              <span className="badge badge-success mb-1">Ingresos</span>
            </h2>
            <label forhtml="fecha" style={styleLabel}>
              Fecha :
            </label>
            <input onChange={this.handleFecha} type="date" name="fecha" id="fecha" value={this.state.fecha} />
            <br />

            <label forhtml="sucursales" style={styleLabel}>
              Sucursal:
            </label>
            <select
              style={styleSelect}
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
              style={styleSelect}
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
              style={styleSelect}
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
              style={styleSelect}
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
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.ingresoInput}
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
              id="comentariosTextarea"
              name="comentariosTextarea"
              cols="30"
              row="2"
              maxLength="75"
              placeholder="Comentarios..."
              onChange={this.handleComentarios}
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
          <div style={styleDisplayIngresos}>
              <p>Hola Ingresos</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Ingresos;
