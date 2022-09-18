import React, { Component } from 'react';

import "./EgresosLimpiaduriaBI.css";
import { FormatoMatrizMeses1,FormatoMatrizMeses2,NumberWithCommas } from './cmpnt/FuncionesGlobales'


class IngresosEgresosLimpiaduriaBI extends Component {
    constructor(props){
        super(props)
        this.state = {
            arreglo:[],
            arreglodetalle:[],
            years:[],
            year: 0,
            radiobox: "cuenta",
            radioboxSort: "porconcepto",
            total: 0,
            totaldetalle: 0,
        }
    }

    async componentDidMount(){
        const years = await this.getConsultaAnios()
        const year = years[0].Year
        
        this.setState({
            years: years,
            year:year,
        },()=>{
            this.handleEgresosLimpiaduriaCuentaContable(this.state.year)        
        })
    }


    getConsultaAnios = async () => {
        const url = this.props.url + `/api/consultaaniosactivos`;
        let data = []
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${this.props.accessToken}`,
            },
          });
    
            data = await response.json();
    
        } catch (error) {
          console.log(error.message);
          alert(error.message);
        }
        return data
      };
    

      handleYear = (e) =>{
        const year = e.target.value
        this.setState({
            year:year,
            radiobox: "cuenta",
            radioboxSort: "porconcepto",
        },()=>{
            this.handleEgresosLimpiaduriaCuentaContable(this.state.year)  
        })
      }

    handleEgresosLimpiaduriaCuentaContable = async(year) =>{
        const consulta = this.state.radiobox
        const url = this.props.url + `/api/egresoslimpiaduriacuentacontable/${year}/${consulta}`
        try{
            const response = await fetch(url,{
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`
                },
            });
            const data = await response.json()
            let arreglo = []
            if(consulta === "cuenta"){
                arreglo = FormatoMatrizMeses1(data)
            }
            if(consulta === "subcuenta"){
                arreglo = FormatoMatrizMeses2(data)
            }
            let total = 0
            arreglo.forEach((element ) =>{
                total += element.Total
            })

            arreglo.forEach(element =>{
                element.Porcentaje = (element.Total/total*100).toFixed(2)
            })
            this.setState({
                arreglo: arreglo,
                total: total,
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    handleEgresosLimpiaduriaCSMes = async(year,mes,CuentaContableId,SubcuentaContableId,TipoConsulta) =>{
        const url = this.props.url + `/api/egresoslimpiaduriacuentacontablesubcuentacontablemes/${year}/${mes}/${CuentaContableId}/${SubcuentaContableId}/${TipoConsulta}`
        try{
            const response = await fetch(url,{
                headers: {
                    Authorization: `Bearer ${this.props.accessToken}`
                },
            });
            const data = await response.json()
            let total = 0
            data.forEach((element) =>{
                total+= parseFloat(element.Monto)
            })
            this.setState({
                arreglodetalle: data,
                totaldetalle: Math.round(total),
            })
        }catch(error){
            console.log(error.message)
            alert(error.message)
        }
    }

    
    handleCuentaSubcuentaContable = (e)=>{
        const option = e.target.value
        const year = this.state.year
        this.setState({
            radiobox: option,
            radioboxSort: "porconcepto",
        },()=>{
            this.handleEgresosLimpiaduriaCuentaContable(year)
        })
    }

    handleSortArray =(e)=>{
        const option = e.target.value
        const arregloTemp = this.state.arreglo
        let arregloSort = []
        if (option === "portotal"){
            //Para no modificar el state brincándose el setState hay que hacer un shallow Copy del arreglo [...array]
            arregloSort = [...arregloTemp].sort((a,b) => a.Total - b.Total) //Este es un ordenamiento numérico
            // arregloSort = arreglo.sort((a,b) => (a.Total > b.Total) ? 1 : -1)
            // alert(JSON.stringify(arregloSort))
        }
        
        if (option === "porconcepto"){
            //Para no modificar el state brincándose el setState hay que hacer un shallow Copy del arreglo [...array]
            arregloSort = [...arregloTemp].sort((a,b) => a.id - b.id) //Este es un ordenamiento numérico
        }
        this.setState({
            radioboxSort:option,
            arreglo: arregloSort,
        })
    }

    render(){
        return (
          <>
            {this.state.arreglo.length === 0 ? (
              <h1>Loading ....</h1>
            ) : (
              <React.Fragment>
                <br />
                <div className="principal">
                  <h3>
                    Egresos Limpiaduría (No Incluye Pagos Melate)
                  </h3>
                  <form action="">
                    <div className="formparent">
                            <select onChange={this.handleYear} value={this.state.year}>
                                {this.state.years.map((element,i) =>(
                                    <option key={i} value={element.Year}>{element.Year}</option>
                                ))}
                            </select>
                            <div className="radiogroup">
                                <p>Agrupar Por:</p>
                                <input type="radio" value="cuenta" checked={this.state.radiobox === "cuenta"} id="cuenta" onChange={this.handleCuentaSubcuentaContable} name="opcionescuentas" />
                                <label>Cuenta Contable</label>
                                <br />
                                <input type="radio" value="subcuenta" checked={this.state.radiobox === "subcuenta"} id="subcuenta" onChange={this.handleCuentaSubcuentaContable} name="opcionescuentas" />
                                <label>Subcuenta Contable</label>
                            </div>
                            <div className="radiogroup">
                                <p>Ordenar Por:</p>
                                <input type="radio" value="porconcepto" checked={this.state.radioboxSort === "porconcepto"} id="porconcepto" onChange={this.handleSortArray} name="opcionesordenar" />
                                <label>Concepto</label>
                                <br />
                                <input type="radio" value="portotal" checked={this.state.radioboxSort === "portotal"} id="portotal" onChange={this.handleSortArray} name="opcionesordenar" />
                                <label>Monto</label>
                            </div>
                    </div>

                  </form>
                  <table className="t1">
                    <thead>
                        <tr>
                            {this.state.radiobox === "cuenta" 
                                ? (<th>Concepto</th>)
                                : (<><th>Concepto1</th><th>Concepto2</th></>)
                            }
                            <th>Ene</th>
                            <th>Feb</th>
                            <th>Mar</th>
                            <th>Abr</th>
                            <th>Mayo</th>
                            <th>Jun</th>
                            <th>Jul</th>
                            <th>Ago</th>
                            <th>Sep</th>
                            <th>Oct</th>
                            <th>Nov</th>
                            <th>Dic</th>
                            <th>Total</th>
                            <th>%</th>

                        </tr>
                    </thead>
                    <tbody>
                      {this.state.arreglo.map((element, i) => (
                        <tr key={i}>
                            {this.state.radiobox === "cuenta"
                            
                            ?    <td style={{ textAlign: "left" }}>
                                    {element.Concepto}
                                </td>
                            :
                                <>
                                    <td style={{ textAlign: "left" }}>
                                        {element.Concepto1}
                                    </td>
                                    <td style={{ textAlign: "left" }}>
                                        {element.Concepto2}
                                    </td>
                                </>
                            }
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Ene.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Ene.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Feb.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Feb.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Mar.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Mar.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Abr.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Abr.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.May.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.May.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Jun.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Jun.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Jul.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Jul.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Ago.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Ago.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Sep.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Sep.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Oct.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Oct.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Nov.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Nov.Monto)}</button></td>
                          <td><button style={{border:"none", borderBottom:"2px solid red"}} onClick={()=>(this.handleEgresosLimpiaduriaCSMes(this.state.year,element.Dic.Mes,element.key1,element.key2,this.state.radiobox))}>{NumberWithCommas(element.Dic.Monto)}</button></td>
                          <td>{NumberWithCommas(element.Total)}</td>
                          <td><b>{element.Porcentaje}</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="sumatoria">
                    <span style={{margin:"10px"}}>Gran Total</span>
                    <input type="text" size="12" value={NumberWithCommas(this.state.total)} readOnly/>
                  </div>


                    {this.state.arreglodetalle.length > 0 
                    ?
                        <>
                        <span style={{marginRight:"10px"}}>Cuenta Contable</span>
                        <input type="text" size="70" value={this.state.arreglodetalle[0].CuentaContable} style={{marginRight:"10px"}} />
                        <input type="text" size="20" value={NumberWithCommas(this.state.totaldetalle)} style={{textAlign:"right"}} />
                        <table className="t2">
                            <thead>
                                <tr>
                                    <th>SubcuentaContable</th>
                                    <th>Monto</th>
                                    <th>Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.arreglodetalle.map((element,i)=>(
                                    <tr key={i}>
                                        <td style={{textAlign:"left"}}>{element.SubcuentaContable}</td>
                                        <td>{NumberWithCommas(element.Monto)}</td>
                                        <td style={{textAlign:"left"}}>{element.Comentarios}</td>
                                    </tr>
                                ))}
                                <tr>
                                    
                                </tr>

                            </tbody>
                        </table>
                        <br />
                                </>
                        : null
                                }



                </div>
              </React.Fragment>
            )}
          </>
        );
    }

}

export default IngresosEgresosLimpiaduriaBI
