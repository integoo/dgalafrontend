import React from 'react';

class InputFecha extends React.Component{
    constructor(props){
        super(props)
        this.state={
            Fecha: this.fechaActual(),
        }
    }
    componentDidMount(){
        this.props.onhandleFecha(this.state.Fecha)
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
        this.props.onhandleFecha(Fecha)
      }

    handleRender=()=>{
        return(
            <React.Fragment className="mainInputFecha">
                <input onChange={this.handleFecha} type="date" id="fecha" name="fecha" value={this.state.Fecha} />
            </React.Fragment>
        )
    }

    render(){
        return(
            <React.Fragment>
                    <this.handleRender />
            </React.Fragment>
        )
    }
}
export default InputFecha;