import React, { Component } from 'react'

class AAEjemplos extends React.Component{

    deleteItem(event){
        alert(event.target.value)
        alert("Si borra")
      //alert(event.target.value)
      console.log(event)
    }
    render(){
        return(
            <React.Fragment>
                <button name="deleteButton" id="deleteButton" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this item?')) this.deleteItem(e) } }>Delete</button>
        
            </React.Fragment>
        )
    }
    
}

export default AAEjemplos 