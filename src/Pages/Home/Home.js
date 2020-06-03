import React, {Component, Fragment} from 'react'
import 'materialize-css/dist/css/materialize.min.css'
import {withRouter} from "react-router-dom";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    RadialBar,
    RadialBarChart,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import './Home.css'
import Header from '../../Components/Header/Header'
import PopUp from '../../utils/PopUp'
import ApiService from '../../Services/ApiService'
import Formulario from "../../Components/Formulario/Formulario";
import moment from "moment";
import {CustomTooltip} from "../../Components/CustomTooltip/CustomTooltip";

const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
};

class Home extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fullList: null,
            json: {
                label: null,
                measurements: []
            },
            media: null,
            recente: null,
            dentroFaixa: null,
            faixa: null,
            radialChart: null,
            totalTime: {
                days: null,
                hours: null,
                minutes: null
            },
        }
    }

    getTemperatures = event => {
        let json = this.state.json;
        json.measurements = event;
        this.setState({json: json});
    }

    loadData(sensor) {

        let list = sensor.measurements;
        let media = 0;
        let min = sensor.temperature_min;
        let max = sensor.temperature_max;
        let ultimaTemperatura = sensor.measurements[0].temperature;
        let tempoAcima = moment.duration(0);
        let tempoAbaixo = moment.duration(0);
        let tempoTotal = moment.duration(0);

        sensor.measurements.forEach((data, index) => {
            media += Number(data.temperature);
            if (data.date_hour.length > 20)
                data.date_hour = new Date(data.date_hour).toLocaleDateString("pt-BR", options);

            let diff = moment.duration(this.createDate(this.getSafe(() => data.date_hour))
                .diff(this.createDate(
                    new Date(this.getSafe(() => sensor.measurements[index + 1].date_hour)).toLocaleDateString("pt-BR", options)))
            );
            if (data.temperature < min) {
                tempoAbaixo.add(diff);
            } else if (data.temperature > max) {
                tempoAcima.add(diff);
            }
            tempoTotal.add(diff);
        });


        let radialChart = [
            {
                name: 'Tempo Total ',
                value: 100,
                fill: 'green'
            }, {
                name: 'Tempo Fora',
                value: (((tempoAcima.valueOf() + tempoAbaixo.valueOf()) * 100) / tempoTotal.valueOf()).toFixed(2),
                fill: 'orange'
            }, {
                name: 'Tempo Acima',
                value: ((tempoAcima.valueOf() * 100) / tempoTotal.valueOf()).toFixed(2),
                fill: 'red'
            }, {
                name: 'Tempo Abaixo',
                value: ((tempoAbaixo.valueOf() * 100) / tempoTotal.valueOf()).toFixed(2),
                fill: 'blue'
            }];

        let totalTime = {
            days: tempoTotal.days(),
            hours: tempoTotal.hours(),
            minutes: tempoTotal.minutes()
        }

        this.setState({
            fullList: sensor.measurements,
            json: sensor,
            media: (media / list.length).toFixed(2) + 'ºC',
            recente: sensor.measurements[0].date_hour + ' ' + ultimaTemperatura + 'ºC',
            faixa: 'Max: ' + max + 'ºC / ' + 'Min: ' + min + 'ºC',
            dentroFaixa: (ultimaTemperatura > min && ultimaTemperatura < max) ? 'Dentro' : 'Fora',
            radialChart: radialChart,
            totalTime: totalTime
        });

    }

    async componentDidMount() {
        let sensor = await ApiService.getMeasurement();
        if(!sensor) {
            PopUp.exibeMensagem(
                'error',
                'Erro na comunicação com a API. Carregando dados locais.'
            )
            sensor = ApiService.loadTemperatures();
        }

        if (sensor) {
            this.loadData(sensor)
        }
    }

    createDate(date) {
        return moment(date, "DD/MM/YYYY hh:mm");
    }


    getSafe(fn) {
        try {
            return fn();
        } catch (e) {
            return undefined;
        }
    }


    render() {
        const state = this.state;
        return (
            <Fragment>
                <Header/>
                <div className='container mb-10'>
                    <h1>PackID</h1>
                    <div className=''>
                        <ul>
                            <li>Nome do sensor: {state.json.label}</li>
                            <li>Faixa de temperatura: {state.faixa}</li>
                            <li>Média da temperatura geral: {state.media}</li>
                            <li>Temperatura mais recente: {state.recente}</li>
                            <li>Informação se a temperatura mais recente está dentro da faixa: {state.dentroFaixa}</li>
                        </ul>
                        {state.json.measurements.length > 0 ?
                            <Formulario props={state} temperatures={this.getTemperatures}></Formulario> : null}
                    </div>
                    <div className='overflowAuto'>
                        <ul>
                            <li>Tempo total das leituras</li>
                            <li>Dias: {state.totalTime.days}</li>
                            <li>Horas: {state.totalTime.hours}</li>
                            <li>Minutos: {state.totalTime.minutes}</li>
                        </ul>

                        <BarChart
                            width={550}
                            height={300}
                            data={state.radialChart}
                            margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis/>
                            <Tooltip content={<CustomTooltip/>}/>
                            <Bar dataKey="value" fill="#8884d8"/>
                        </BarChart>

                    </div>
                    <div className='overflowAuto'>
                        <LineChart width={6000} height={300} data={state.json.measurements}
                                   margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                            <Line type="monotone" dataKey="temperature" stroke="#8884d8"/>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5"/>
                            <XAxis dataKey="date_hour"/>
                            <YAxis/>
                            <Tooltip/>
                        </LineChart>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withRouter(Home)

