import React from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList, Legend,ComposedChart, Line,  Area, Cell } from 'recharts';


    export function RechartsBarChart01({data, titulo, color1, color2}){
    //     const data = [{name: 'Ene', Ventas: 24400},
    //     {name: 'Feb', Ventas: 33300},
    //     {name: 'Mar', Ventas: 33200},
    //     {name: 'Abr', Ventas: 34400},
    // ];

    //Extrae los nombres de los primeros 2 campos del Objeto json adentro del arreglo "data"
    let json = data[0]
    let [first, second] = Object.keys(json)
    first = ""

    //Acceder a la segunda posicion de un JSON file dentro de un array
    //alert(data[0][second])

    if (color1 === undefined) {color1 = "green"}
    if (color2 === undefined) {color2 = "red"}

        return (
          <React.Fragment>
            <h3>{titulo + first}</h3>

            <div style={{ width: "95%", height: "300px" }}>
              {/* <ResponsiveContainer width={700} height="80%"> */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  {/* <BarChart width={600} height={200} data={data}> */}
                  <XAxis dataKey="name" stroke="#8884d8" />
                  {/* <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} /> */}
                  <YAxis
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("en").format(value)
                    }
                  />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("en").format(value)
                    }
                  />
                  <Legend />
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  {/* <Bar dataKey="value" fill="#8884d8" barSize={50}> */}
                  <Bar dataKey={second} fill={color1} barSize={50}>
                    {data.map((entry, index) => (
                      // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                      <Cell key={index} fill={data[index][second] >= 0 ? color1 : color2} />
                    ))}

                    {/* <LabelList dataKey="value" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                    <LabelList
                      dataKey={second}
                      position="top"
                      formatter={(value) =>
                        new Intl.NumberFormat("en").format(value)
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </React.Fragment>
        );
    }

        export function RechartsBarChart02({data, titulo,color1,color2}){
            //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
            let json = data[0]
            let [first, second, third] = Object.keys(json)
            first = ""

            if (color1 === undefined) {color1 = "#8884d8"}
            if (color2 === undefined) {color2 = "#82ca9d"}
            return (
              <>
                <h3>{titulo+first}</h3>
                <div style={{ width: "95%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  {/* <BarChart width={730} height={250} data={data}> */}
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Legend />
                    {/* <Bar dataKey="value01" fill="#8884d8" barSize={30} > */}
                    {/* <Bar dataKey={second} fill="#8884d8" barSize={30} > */}
                    <Bar dataKey={second} fill={color1} barSize={30} >

                      {data.map((entry, index) => (
                        // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                        <Cell key={index} fill={data[index][second] >= 0 ? color1 : 'red'} />
                      ))}



                        {/* <LabelList dataKey="value01" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>
                    {/* <Bar dataKey="value02" fill="#82ca9d" barSize={30}> */}
                    {/* <Bar dataKey={third} fill="#82ca9d" barSize={30}> */}
                    <Bar dataKey={third} fill={color2} barSize={30}>

                    {data.map((entry, index) => (
                      // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                      <Cell key={index} fill={data[index][third] >= 0 ? color2 : 'red'} />
                    ))}


                        {/* <LabelList dataKey="value02" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={third} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>
                  </BarChart>
                  </ResponsiveContainer >
                </div>
              </>
            );
        }

        export function RechartsBarChart03({data, titulo}){
            //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
            let json = data[0]
            let [first, second, third, fourth] = Object.keys(json)
            first = ""
            return (
              <>
                <h3>{titulo+first}</h3>
                <div style={{ width: "95%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  {/* <BarChart width={730} height={250} data={data}> */}
                  <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    <Legend />
                    {/* <Bar dataKey="value01" fill="#8884d8" barSize={30} > */}
                    {/* <Bar dataKey={second} fill="#8884d8" barSize={23} > */}
                    <Bar dataKey={second} fill="dodgerblue" barSize={23} >
                        {/* <LabelList dataKey="value01" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>
                    {/* <Bar dataKey="value02" fill="#82ca9d" barSize={30}> */}
                    {/* <Bar dataKey={third} fill="#82ca9d" barSize={23}> */}
                    <Bar dataKey={third} fill="red" barSize={23}>
                        {/* <LabelList dataKey="value02" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={third} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>
                    {/* <Bar dataKey={fourth} fill="#82ca9d" barSize={23}> */}
                    <Bar dataKey={fourth} fill="green" barSize={23}>
                        {/* <LabelList dataKey="value02" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={fourth} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>

                  </BarChart>
                  </ResponsiveContainer >
                </div>
              </>
            );
        }

        export function RechartsComposedChart03Original({data, titulo}){
          //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
          let json = data[0]
          let [first, second, third] = Object.keys(json)
          first = ""
          
          return (
            <>
              <h3>{titulo+first}</h3>
              <div style={{ width: "95%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Area
                    type="monotone"
                    // dataKey="amt"
                    dataKey={second}
                    fill="#8884d8"
                    stroke="#8884d8"
                  />
                  {/* <Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
                  <Bar dataKey={second} barSize={50} fill="#413ea0">
                  <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>
                  {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
                  <Line type="monotone" dataKey={third} stroke="#ff7300" />
                </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          );
        }

        export function RechartsComposedChart02({data, titulo, color1, color2}){
          //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
          let json = data[0]
          let [first, second, third] = Object.keys(json)
          first = ""

          if (color1 === undefined) {color1 = "green"}
          if (color2 === undefined) {color2 = "red"}
          
          return (
            <>
              <h3>{titulo+first}</h3>
              <div style={{ width: "95%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  {/* <Area
                    type="monotone"
                    // dataKey="amt"
                    dataKey={second}
                    fill="#8884d8"
                    stroke="#8884d8"
                  /> */}
                  {/* <Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
                  {/* <Bar dataKey={second} barSize={50} fill="#413ea0"> */}
                  <Bar dataKey={second} barSize={50} fill={color1}>

                    {data.map((entry, index) => (
                          // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                          <Cell key={index} fill={data[index][second] >= 0 ? color1 : 'red'} />
                    ))}

                    <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>
                  {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
                  {/* <Line type="monotone" dataKey={third} stroke="#ff7300" /> */}
                  <Line type="monotone" dataKey={third} stroke={color2} >

                      {data.map((entry, index) => (
                              // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                              <Cell key={index} fill={data[index][third] >= 0 ? color2 : 'red'} />
                        ))}

                  </Line>
                </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          );
        }




        export function RechartsComposedChart03({data, titulo, color1, color2, color3}){
          //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
          let json = data[0]
          let [first, second, third, fourth] = Object.keys(json)
          first = ""

          if (color1 === undefined) {color1 = "#005599"}
          if (color2 === undefined) {color2 = "red"}
          if (color3 === undefined) {color3 = "red"}
          
          return (
            <>
              <h3>{titulo+first}</h3>
              <div style={{ width: "95%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  {/* <Area
                    type="monotone"
                    // dataKey="amt"
                    dataKey={second}
                    fill="#8884d8"
                    stroke="#8884d8"
                  /> */}
                  {/* <Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
                  {/* <Bar dataKey={second} barSize={50} fill="#413ea0"> */}
                  <Bar dataKey={second} barSize={50} fill={color1}>

                      {data.map((entry, index) => (
                        // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                        <Cell key={index} fill={data[index][second] >= 0 ? color1 : 'red'} />
                      ))}

                    <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>

                  {/* <Bar dataKey={third} barSize={50} fill="#413ea0"> */}
                  <Bar dataKey={third} barSize={50} fill={color2}>

                  {data.map((entry, index) => (
                        // <Cell fill={ data[index][second] <= 0 ? 'red' : '#005599' }/>
                        <Cell key={index} fill={data[index][third] >= 0 ? color2 : 'red'} />
                      ))}

                    <LabelList dataKey={third} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>

                  {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
                  {/* <Line type="monotone" dataKey={third} stroke="#ff7300" /> */}
                  <Line type="monotone" dataKey={fourth} stroke={color3} />
                </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          );
                                      
        }






        export function RechartsComposedChart04({data, titulo, color1, color2, color3, color4}){
          //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
          let json = data[0]
          let [first, second, third, fourth, fifth] = Object.keys(json)
          first = ""

          if (color1 === undefined) {color1 = "#005599"}
          if (color2 === undefined) {color2 = "red"}
          if (color3 === undefined) {color2 = "dodgerblue"}
          if (color4 === undefined) {color4 = "#ff5349"}
          
          return (
            <>
              <h3>{titulo+first}</h3>
              <div style={{ width: "95%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)}/>
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  {/* <Area
                    type="monotone"
                    // dataKey="amt"
                    dataKey={second}
                    fill="#8884d8"
                    stroke="#8884d8"
                  /> */}
                  {/* <Bar dataKey="pv" barSize={20} fill="#413ea0" /> */}
                  {/* <Bar dataKey={second} barSize={50} fill="#413ea0"> */}
                  <Bar dataKey={second} barSize={50} fill={color1}>
                    <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>
                  {/* <Bar dataKey={third} barSize={50} fill="#413ea0"> */}
                  <Bar dataKey={third} barSize={50} fill={color2}>
                    <LabelList dataKey={third} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                  </Bar>

                  {/* <Line type="monotone" dataKey="uv" stroke="#ff7300" /> */}
                  {/* <Line type="monotone" dataKey={fourth} stroke="#ff7300" /> */}
                  <Line type="monotone" dataKey={fourth} stroke={color3} />
                  <Line type="monotone" dataKey={fifth} stroke={color4} />
                </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          );
                                      
        }