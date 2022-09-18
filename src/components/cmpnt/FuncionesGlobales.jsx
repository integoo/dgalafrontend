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


  export function FormatoMatrizMeses1(data){
    //data
    //[
    // id: (numério)
    // Concepto: (string)
    // "Mes": 1 (numerico)
    // "Monto": 200
    //]

    //Resutaldo
    //[
    //  {"id": 1,"key1": 2000, Concepto":"Valor String","Ene":124,"Feb":123, "Mar": 123... "Total":456},
    //  {"id": 2,"key1": 3000, Concepto":"Valor String","Ene":124,"Feb":123, "Mar": 123... "Total":456},
    //]
    let [first, second] = Object.keys(data[0])
    let keyValue = ""
    let arreglo = []
    let json = {}
    let id = 0

    data.forEach((element)=>{
      if (keyValue !== element[first]){
        
        keyValue = element[first]
        id +=1
        
        json = {
          "id": id,
          "key1": element[first],
          "Concepto": "",
          "Ene": {Monto:0, Mes:0},
          "Feb": {Monto:0, Mes:0},
          "Mar": {Monto:0, Mes:0},
          "Abr": {Monto:0, Mes:0},
          "May": {Monto:0, Mes:0},
          "Jun": {Monto:0, Mes:0},
          "Jul": {Monto:0, Mes:0},
          "Ago": {Monto:0, Mes:0},
          "Sep": {Monto:0, Mes:0},
          "Oct": {Monto:0, Mes:0},
          "Nov": {Monto:0, Mes:0},
          "Dic": {Monto:0, Mes:0},
          "Total": 0,
          "Porcentaje": 0,
      }
        arreglo.push(json)
      }
      
      
      json.Concepto = element[second]
      // json.Concepto = keyValue
      if (element.Mes === 1){
        json.Ene.Monto = element.Monto
        json.Ene.Mes = element.Mes
      }
      if (element.Mes === 2){
        json.Feb.Monto = element.Monto
        json.Feb.Mes = element.Mes
      }
      if (element.Mes === 3){
        json.Mar.Monto = element.Monto
        json.Mar.Mes = element.Mes
      }
      if (element.Mes === 4){
        json.Abr.Monto = element.Monto
        json.Abr.Mes = element.Mes
      }
      if (element.Mes === 5){
        json.May.Monto = element.Monto
        json.May.Mes = element.Mes
      }
      if (element.Mes === 6){
        json.Jun.Monto = element.Monto
        json.Jun.Mes = element.Mes
      }
      if (element.Mes === 7){
        json.Jul.Monto = element.Monto
        json.Jul.Mes = element.Mes
      }
      if (element.Mes === 8){
        json.Ago.Monto = element.Monto
        json.Ago.Mes = element.Mes
      }
      if (element.Mes === 9){
        json.Sep.Monto = element.Monto
        json.Sep.Mes = element.Mes
      }
      if (element.Mes === 10){
        json.Oct.Monto = element.Monto
        json.Oct.Mes = element.Mes
      }
      if (element.Mes === 11){
        json.Nov.Monto = element.Monto
        json.Nov.Mes = element.Mes
      }
      if (element.Mes === 12){
        json.Dic.Monto = element.Monto
        json.Dic.Mes = element.Mes
      }
        json.Total += parseFloat(element.Monto)
        json.Porcentaje = 0

    })
    return arreglo
  }


  export function FormatoMatrizMeses2(data){
    //data
    //[
    // id1: (numério)
    // Concepto1: (string)
    // id2: (numério)
    // Concepto2: (string)
    // "Mes": 1 (numerico)
    // "Monto": 200
    //]

    //Resutaldo
    //[
    //  {"id": 1,"key1":2000,"key2": "001","Concepto1":"Valor String","Concepto2": Valor String","Ene":124,"Feb":123, "Mar": 123... "Total":456},
    //  {"id": 2,"key1":3000,"key2": "001","Concepto1":"Valor String","Concepto2": Valor String","Ene":124,"Feb":123, "Mar": 123... "Total":456},
    //]

    let [first, second, third, fourth] = Object.keys(data[0])
    let keyValue1 = ""
    let keyValue2 = ""
    let arreglo = []
    let json = {}
    let id = 0
    
    
    data.forEach((element)=>{
      if (keyValue1 !== element[first] || keyValue2 !== element[third]){
        
        keyValue1 = element[first]
        keyValue2 = element[third]
        id += 1
        
        json = {
          "id": id,
          "key1":keyValue1,
          "key2":keyValue2,
          "Concepto1": "",
          "Concepto2": "",
          "Ene": {Monto:0, Mes:0},
          "Feb": {Monto:0, Mes:0},
          "Mar": {Monto:0, Mes:0},
          "Abr": {Monto:0, Mes:0},
          "May": {Monto:0, Mes:0},
          "Jun": {Monto:0, Mes:0},
          "Jul": {Monto:0, Mes:0},
          "Ago": {Monto:0, Mes:0},
          "Sep": {Monto:0, Mes:0},
          "Oct": {Monto:0, Mes:0},
          "Nov": {Monto:0, Mes:0},
          "Dic": {Monto:0, Mes:0},
          "Total": 0,
          "Porcentaje": 0,
      }
        arreglo.push(json)
      }
      
      
      json.Concepto1 = element[second]
      json.Concepto2 = element[fourth]
      // json.Concepto = keyValue
      if (element.Mes === 1){
        json.Ene.Monto = element.Monto
        json.Ene.Mes = element.Mes
      }
      if (element.Mes === 2){
        json.Feb.Monto = element.Monto
        json.Feb.Mes = element.Mes
      }
      if (element.Mes === 3){
        json.Mar.Monto = element.Monto
        json.Mar.Mes = element.Mes
      }
      if (element.Mes === 4){
        json.Abr.Monto = element.Monto
        json.Abr.Mes = element.Mes
      }
      if (element.Mes === 5){
        json.May.Monto = element.Monto
        json.May.Mes = element.Mes
      }
      if (element.Mes === 6){
        json.Jun.Monto = element.Monto
        json.Jun.Mes = element.Mes
      }
      if (element.Mes === 7){
        json.Jul.Monto = element.Monto
        json.Jul.Mes = element.Mes
      }
      if (element.Mes === 8){
        json.Ago.Monto = element.Monto
        json.Ago.Mes = element.Mes
      }
      if (element.Mes === 9){
        json.Sep.Monto = element.Monto
        json.Sep.Mes = element.Mes
      }
      if (element.Mes === 10){
        json.Oct.Monto = element.Monto
        json.Oct.Mes = element.Mes
      }
      if (element.Mes === 11){
        json.Nov.Monto = element.Monto
        json.Nov.Mes = element.Mes
      }
      if (element.Mes === 12){
        json.Dic.Monto = element.Monto
        json.Dic.Mes = element.Mes
      }
        json.Total += parseFloat(element.Monto)
        json.Porcentaje = 0

    })
    return arreglo
  }