export function NumberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  export function NumeroAMes(x) {
    let nombreMes = ""
    if (x===1){
      nombreMes = "Ene"
    }
    if (x===2){
      nombreMes = "Feb"
    }
    if (x===3){
      nombreMes = "Mar"
    }
    if (x===4){
      nombreMes = "Abr"
    }
    if (x===5){
      nombreMes = "May"
    }
    if (x===6){
      nombreMes = "Jun"
    }
    if (x===7){
      nombreMes = "Jul"
    }
    if (x===8){
      nombreMes = "Ago"
    }
    if (x===9){
      nombreMes = "Sep"
    }
    if (x===10){
      nombreMes = "Oct"
    }
    if (x===11){
      nombreMes = "Nov"
    }
    if (x===12){
      nombreMes = "Dic"
    }
    if (x===13){
      nombreMes = "Total"
    }

    return nombreMes;
  }