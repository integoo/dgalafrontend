import React from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer, LabelList, Legend } from 'recharts';


    export function RechartsBarChart01({data, titulo}){
    //     const data = [{name: 'Ene', value: 24400},
    //     {name: 'Feb', value: 33300},
    //     {name: 'Mar', value: 33200},
    //     {name: 'Abr', value: 34400},
    //     {name: 'May', value: 34500},
    //     {name: 'Jun', value: 35550},
    //     {name: 'Jul', value: 36500},
    //     {name: 'Ago', value: 36600},
    //     {name: 'Sep', value: 37670},
    //     {name: 'Oct', value: 38700},
    //     {name: 'Nov', value: 43800},
    //     {name: 'Dic', value: 48200},
    // ];

    //Extrae los nombres de los primeros 2 campos del Objeto json adentro del arreglo "data"
    let json = data[0]
    let [first, second] = Object.keys(json)
    first = ""



        return(
            <React.Fragment>
                <h3>{titulo+first}</h3>

                <div style={{width:"95%", height:"300px"}}>
                    {/* <ResponsiveContainer width={700} height="80%"> */}
                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} >
                        {/* <BarChart width={600} height={200} data={data}> */}
                            <XAxis dataKey="name" stroke="#8884d8" />
                            {/* <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} /> */}
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            <Legend />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            {/* <Bar dataKey="value" fill="#8884d8" barSize={50}> */}
                            <Bar dataKey={second} fill="#8884d8" barSize={50}>
                                {/* <LabelList dataKey="value" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                                <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            </Bar> 
                        </BarChart>

                    </ResponsiveContainer>

                </div>
            </React.Fragment>
        )
    }

        export function RechartsBarChart02({data, titulo}){
            //Extrae los nombres de los primeros 3 campos del Objeto json adentro del arreglo "data"
            let json = data[0]
            let [first, second, third] = Object.keys(json)
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
                    <Bar dataKey={second} fill="#8884d8" barSize={30} >
                        {/* <LabelList dataKey="value01" position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} /> */}
                        <LabelList dataKey={second} position="top" formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                    </Bar>
                    {/* <Bar dataKey="value02" fill="#82ca9d" barSize={30}> */}
                    <Bar dataKey={third} fill="#82ca9d" barSize={30}>
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

        