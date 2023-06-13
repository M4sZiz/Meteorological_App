import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import {Chart, registerables} from 'chart.js';
import 'chartjs-adapter-moment';
import { Line } from "react-chartjs-2";
import imagesPath from "../imagePath.json"

Chart.register(...registerables);

const ChartComponent = ({ type, label, weathers, parameter, borderColor, withIcon, iconParameter }) => {
    const [chartTempData, setChartTempData] = useState([]);
    const [chartPointStyle, setChartPointStyle] = useState([]);

    useEffect(() => {
        const weather = weathers.find(element => element.parameter === parameter);
        if (weather) {
            const coordinate = weather.coordinates[0];
            console.log(coordinate);

            const data = [];
            coordinate.dates.forEach(element => {
                data.push({
                    x: element.date,
                    y: element.value
                })
            });

            if(withIcon) {
                const weatherS = weathers.find(element => element.parameter === iconParameter);
                const coordinateS = weatherS.coordinates[0];
                const pointStyle = [];
                coordinateS.dates.forEach(element => {
                    let image = new Image();
                    let width = 24;
                    let height = 24;
                    if(iconParameter === 'weather_symbol_1h:idx') {
                        image.src =  require(`../images/weather/${imagesPath[element.value]}`);
                        width = 40;
                        height = 40;
                    } else {
                        let arrowSvg = `<svg style="transform: translate(-0%, 0%) rotate(${element.value}deg); color:#4BC0C0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0" y="0" width="16" height="16" viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M11.53 3l-.941 12.857L7 15l5.001 6L17 15l-3.587.857L12.471 3h-.941z" clip-rule="evenodd"></path></svg>`
                        image.src =  "data:image/svg+xml;base64,"+btoa(arrowSvg)
                    }
                    image.width = width;
                    image.height = height;
                    pointStyle.push(image);
                });
                setChartPointStyle(pointStyle);
            }

            setChartTempData(data);
        }
    }, [weathers]);

    const chartData = {
        datasets: [
            {
                type,
                data: chartTempData,
                label: label,
                borderColor,
                backgroundColor: 'rgba(75,192,192,1)',
                pointStyle: withIcon ? chartPointStyle : 'circle',
                
            },
        ],
    }
        const options = {
        scales: {
            xAxis: {
                type: 'time',
                time: {
                    unit: 'hour',
                }
            },
            y: {
                ticks: {

                    maxRotation: 0,
                    callback: function (value, index, values) {
                        if(parameter === 't_2m:C') {
                            return value + '°C';
                        }
                        return value;
                    }
                }
            },

        },
    }

    return chartTempData && (<Line data={chartData} options={options} />)
}

export default ChartComponent;