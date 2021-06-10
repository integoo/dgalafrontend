import React from 'react'

class VentasConsultaSucursalesHoy extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            detalles: [],
            GranTotalVenta:0,
        }
    }

    async componentDidMount(){
        try{
            const url = this.props.url + `/api/ventassucursaleshoy`
            const response = await fetch(url, {
                headers:{
                    Authorization: `Bearer ${this.props.accessToken}`,
                },
            });
            const data = await response.json()
            if(data.error){
                alert(data.error)
                return
            }
            let GranTotalVenta=0
            data.forEach(element => {
                GranTotalVenta+= parseFloat(element.ExtVentaConImp)
            });
            this.setState({
                detalles: data,
                GranTotalVenta: GranTotalVenta,
            })
        }catch(error){
            alert(error.message)
            return
        }
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }

    handleRender = () =>{
        return(
            <div className="row">
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-header">
                            <span className="badge badge-primary">Consulta Ventas Por Sucursal</span>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Sucursal</th>
                                        <th>ExtVentaConImp</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.detalles.map((element,i) =>(
                                        <tr key={i}>
                                            <td>{element.Sucursal}</td>
                                            <td  style={{textAlign:"right"}}>$ {this.numberWithCommas(element.ExtVentaConImp)}</td>
                                        </tr>
                                        ))}
                                </tbody>
                            </table>
                            <div className="GranTotalVenta text-right">
                                <label htmlFor="" style={{fontSize:"0.7rem"}}><strong>Gran Total Venta</strong></label>
                                <input value={"$ "+this.numberWithCommas(this.state.GranTotalVenta.toFixed(2))} id="grantotalventa" name="grantotalventa" style={{width:"7rem", textAlign:"right"}} readOnly />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


    render(){
        return(
            <React.Fragment>
                <div className="container">
                    {this.state.detalles ? <this.handleRender /> : <h1>Loading ...</h1>}
                </div>
            </React.Fragment>
        )
    }
}

export default VentasConsultaSucursalesHoy;