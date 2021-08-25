import React from 'react';
import { Line } from 'react-chartjs-2';

// https://www.tabnine.com/blog/top-11-react-chart-libraries/
// https://github.com/reactchartjs/react-chartjs-2
// https://github.com/reactchartjs/react-chartjs-2/blob/master/example/src/charts/Line.js
// https://www.chartjs.org/docs/latest/samples/line/line.html



//ESTA ES LA ESTRUCTURA DEL ARRGLO QUE SE LE ENVÍA POR PARÁMETRO A LA FUNCIÓN
// const data = {
//   labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
//   datasets: [
//     {
//       label: '$ Pesos',
//       data: [72000,63000,65000,64000,77500,79000,86300],
//       fill: false,
//       backgroundColor: 'rgb(255, 99, 132)',
//       borderColor: 'rgba(255, 99, 132, 0.2)',
//     },
//   ],
// };

// ESTAS options NO LAS UTILICÉ PORQUE USÉ options={{ maintainAspectRatio: false }} PARA PODER
// MODIFICAR ENVIANDO COMO PARAMETRO EL WIDTH Y HEIGHT
// const options = {
//   scales: {
//     yAxes: [
//       {
//         ticks: {
//           beginAtZero: true,
//         },
//       },
//     ],
//   },
// };

const LineChart = (data) => (
  <>
    <div className='LineChartheader' style={{width:"100%",marginLeft:"-40px"}}>
    {/* <Line data={data} options={options}/> */}
    <Line data={data.data} width={90} height={250}  options={{ maintainAspectRatio: false }}  />
    </div>
  </>
);

export default LineChart;