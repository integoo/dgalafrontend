Descripcion = Descripcion.replace(/[^a-zA-Z0-9]/g,"")

//#### VALIDA QUE SEAN SOLO NUMEROS
let numbers = /^[0-9]+$/;
    if (CodigoBarras.match(numbers)){

    }

import React, { Component } from 'react'

class AAEjemplos extends React.Component{

//select CASE WHEN (exists(select 1 where 1=2))='f' THEN '0' ELSE '1'end;


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

//select "SucursalId","CodigoId", CAST((("CostoPromedio" /(1-("MargenReal"/100)))* "IVA"/100)- "IVAMonto" AS DEC(4,2) from inventario_perpetuo order by "SucursalId","CodigoId" ;

    deleteItem(event){
        alert(event.target.value)
        alert(event.target.name)
        alert("Si borra")
      //alert(event.target.value)
      console.log(event)
    }
    render(){
        return(
            <React.Fragment>
                <button name="deleteButton" id="deleteButton" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteItem(e) } }>Delete</button>
                {/* <button className="btn btn-danger btn-lg" onClick={() => { if (window.confirm('Are you sure you wish to delete this item?')) this.onCancel(item) } } >Borrar</button>  */}
                <button name="deleteButton" id="deleteButton" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteItem(e) } }>Delete</button>
        <button onClick={() => { if(window.confirm('Are you sure?')) alert("OK")}}>Hey</button>

        <form>
            <input type="numeric" 
                    pattern="[0-9]{3}" placeholder="Monto $$$" />
            <button onclick="go(event)">Ejecuta</button>
            <button type="submit">Submit</button>
        </form>

            </React.Fragment>
        )
    }
    
}

export default AAEjemplos 