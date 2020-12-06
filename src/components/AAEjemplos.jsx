import React, { Component } from 'react'

class AAEjemplos extends React.Component{

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

            </React.Fragment>
        )
    }
    
}

export default AAEjemplos 