import React from "react";

import "./InputCodigoBarras.css";

class InputCodigoBarras extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      CodigoBarras: "",
      Descripcion: "",
      detalles: [],
    };
    this.refCodigoBarras = React.createRef()
    this.refDescripcion = React.createRef()
  }

  onhandleDescripcionKeyPress = (e) =>{
      if(e.key === 'Enter'){
          if(this.state.Descripcion === ""){
            document.querySelector("#tableInputCodigoBarras").style.display = "none"
            this.refCodigoBarras.current.focus()
          }
      }
  }

  //handleCodigoBarrasKeyPress =(e) =>{
  handleConsultaVerde =(e) =>{
      e.preventDefault()
      //if(e.key === 'Enter'){
          //if(!this.state.CodigoBarras){
              if(document.querySelector("#tableInputCodigoBarras").style.display === "block"){
                  document.querySelector("#tableInputCodigoBarras").style.display = "none"
              }
            else{
                document.querySelector("#tableInputCodigoBarras").style.display = "block"
                this.setState({
                    CodigoBarras:"",
                    Descripcion: "",
                    detalles:[]
                })
                this.refDescripcion.current.focus()
            }

          //}
      //}
  }

  handleCodigoBarras = (e) => {
    e.preventDefault();
    const CodigoBarras = e.target.value.toUpperCase();
    this.setState({
      CodigoBarras: CodigoBarras,
      detalles:[]
    });
    this.props.handleCodigoBarrasProp(CodigoBarras)
  };

  getProductosDescripcion = async (Descripcion) => {
    const url = this.props.url + `/api/productosdescripcion/${Descripcion}`;
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      const data = await response.json();
      // if(data.error){
      //     this.setState({
      //         CodigoBarras: "",
      //         detalles: []
      //     })
      // }
      // this.setState({
      //     detalles: data,
      // })
      return data;
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  addRowHandlers = ()=> {
    const table = document.getElementById("table1");
    const rows = table.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
     let currentRow = table.rows[i];
     let createClickHandler =  (row) =>{
         return () => {
             let cell = row.getElementsByTagName("td")[1];
             let vcodigobarras = cell.innerHTML;
             cell = row.getElementsByTagName("td")[2];
             let vdescripcion = cell.innerHTML;
             this.setState({
                 CodigoBarras: vcodigobarras,
                 Descripcion: vdescripcion,
             })
            this.props.handleCodigoBarrasProp(vcodigobarras,vdescripcion)
            //  document.querySelector(".ventanaproductos").style.display = "none"
             document.querySelector("#tableInputCodigoBarras").style.display = "none"
             this.refCodigoBarras.current.focus()
         };
     };
     currentRow.onclick = createClickHandler(currentRow);
 }
}

  onhandleDescripcion = async (e) => {
    e.preventDefault();
    const Descripcion = e.target.value.toUpperCase();
    this.setState({
      Descripcion: Descripcion,
    });
    let arreglo = [];
    if (Descripcion.length >= 3) {
      arreglo = await this.getProductosDescripcion(Descripcion);
    }
    if (arreglo.error) {
      console.log(arreglo.error);
      alert(arreglo.error);
      return;
    }
    this.setState({
        detalles:arreglo
    })
    this.addRowHandlers()
  };

  handleRender = () => {
    return (
      <div className="mainInputCodigoBarras">
        {/* <form> */}
          <label htmlFor="codigobarras">Código Barras</label>
          <input
            onChange={this.handleCodigoBarras}
            onKeyPress={this.handleCodigoBarrasKeyPress}
            id="codigobarras"
            name="codigobarras"
            value={this.state.CodigoBarras}
            size="15"
            maxLength="13"
            style={{ textTransform: "capitalize" }}
            ref={this.refCodigoBarras}
            autoComplete="off"
          />
          <button className="btn btn-success btn-sm ml-1" onClick={this.handleConsultaVerde}>Consulta</button>
          <div id="tableInputCodigoBarras">
            <label htmlFor="descripcion">Descripcion</label>
            <input
              onChange={this.onhandleDescripcion}
              onKeyPress={this.onhandleDescripcionKeyPress}
              id="descripcion"
              name="descripcion"
              value={this.state.Descripcion}
              ref={this.refDescripcion}
              autoComplete="off"
            />
            <table id="table1" onClick={this.handlerRowClicked}>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Código Barras</th>
                  <th>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {this.state.detalles.map((element, i) => (
                  <tr key={i}>
                    <td>{element.CodigoId}</td>
                    <td>{element.CodigoBarras}</td>
                    <td>{element.Descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* </form> */}
      </div>
    );
  };

  render() {
    return (
      <React.Fragment>
        <this.handleRender />
      </React.Fragment>
    );
  }
}
export default InputCodigoBarras;
