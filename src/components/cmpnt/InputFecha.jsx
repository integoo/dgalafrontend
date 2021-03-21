import React from 'react';

class InputFecha extends React.Component{
    constructor(props){
        super(props)
        this.state={
            Fecha: this.fechaActual(),
        }
    }
    fechaActual() {
        const d = new Date();
        let vfecha =
          d.getFullYear() +
          "-" +
          ("0" + (d.getMonth() + 1)).slice(-2) +
          "-" +
          ("0" + d.getDate()).slice(-2);
    
        return vfecha;
      }
      handleFecha =(e) =>{
        const Fecha = e.target.value 
        this.setState({
            Fecha: Fecha
        })
      }

    handleRender=()=>{
        return(
            <div className="mainInputFecha">
                <input onChange={this.handleFecha} type="date" id="fecha" name="fecha" value={this.state.Fecha} />
            </div>
        )
    }

    render(){
        return(
            <React.Fragment>
                <div className="content">
                    <this.handleRender />
                </div>
            </React.Fragment>
        )
    }
}
export default InputFecha;