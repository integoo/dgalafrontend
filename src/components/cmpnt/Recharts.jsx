import React, {Component } from 'react';

import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    ResponsiveContainer } from 'recharts';


class Recharts extends Component {
    constructor(props){
        super(props)
        this.state = {
            titulo: this.props.titulo,
            data: this.props.data

        }
    }

    render(){
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

        const data = this.state.data
        return(
            <React.Fragment>
                <h3>{this.state.titulo}</h3>

                {/* <div style={{width:"90%", margin:"auto", height:"200px"}}> */}
                <div style={{width:"95%", height:"200px"}}>
                    {/* <ResponsiveContainer width={700} height="80%"> */}
                    <ResponsiveContainer width="100%" height="100%">

                        <BarChart data={data}>
                        {/* <BarChart width={600} height={200} data={data}> */}
                            <XAxis dataKey="name" stroke="#8884d8" />
                            {/* <YAxis tickFormatter={(value) => new Intl.NumberFormat('en', { notation: "compact", compactDisplay: "short" }).format(value)} /> */}
                            <YAxis tickFormatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            <Tooltip formatter={(value) => new Intl.NumberFormat('en').format(value)} />
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <Bar dataKey="value" fill="#8884d8" barSize={30} />
                        </BarChart>

                    </ResponsiveContainer>

                </div>
            </React.Fragment>
        )
    }
}

export default Recharts