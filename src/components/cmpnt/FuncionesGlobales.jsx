export function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }


  export function RechartsFormat(arregloDeObjetos){
    //[{Mes:1, Monto:1230.25},
    // {Mes:2, Monto:3456.57}
    //]
    let data=[]
    let json={}
      arregloDeObjetos.forEach((element,i) =>{
        if(element.Mes === 1){
          json = {name:'Ene',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 2){
          json = {name:'Feb',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 3){
          json = {name:'Mar',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 4){
          json = {name:'Abr',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 5){
          json = {name:'May',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 6){
          json = {name:'Jun',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 7){
          json = {name:'Jul',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 8){
          json = {name:'Ago',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 9){
          json = {name:'Sep',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 10){
          json = {name:'Oct',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 11){
          json = {name:'Nov',value:parseFloat(element.Monto) || 0}
        }
        if(element.Mes === 12){
          json = {name:'Dic',value:parseFloat(element.Monto) || 0}
        }

        if(element.Mes <=12){
          data.push(json)
        }
      })
      return data
  }
