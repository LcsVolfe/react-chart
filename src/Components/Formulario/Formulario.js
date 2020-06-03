import React, {Component} from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import {withRouter} from "react-router-dom";
import DatePicker, {registerLocale} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import br from 'date-fns/locale/pt-BR';
import moment from 'moment';
import CustomDatePicker from '../CustomDatePicker/CustomDatePicker';


import Toast from '../Toast/Toast';


registerLocale("br", br);

class Formulario extends Component {
    constructor(props) {
        super(props)
        let list = null;
        if (props.props.json.measurements) {
            list = props.props.json.measurements;
        }
        this.stateInicial = {
            mensagem: {
                open: false,
                texto: '',
                tipo: ''
            },
            startDate: null,
            endDate: null,
            firstTime: list ? list[list.length - 1].date_hour : null,
            lastTime: list ? list[0].date_hour : null
        }
        this.state = this.stateInicial
    }

    submitFormulario = () => {
        const state = this.state;
        let list = [];
        this.props.props.fullList.forEach(temp => {
            if (this.createDate(temp.date_hour).isBetween(this.createDate(state.startDate), this.createDate(state.endDate))) {
                list.push(temp);
            }
        });
        this.props.temperatures(list);
        this.setState({
            mensagem: {
                mensagem: 'Sucesso no filtro.',
                tipo: 'success',
                open: true
            }
        })
    }

    createDate(date) {
        return moment(date, "DD/MM/YYYY hh:mm");
    }


    render() {
        const state = this.state;
        let valid = false;
        if (state.startDate && state.endDate) valid = true;

        return (
            <>
                <Toast
                    open={this.state.mensagem.open}
                    handleClose={() =>
                        this.setState({mensagem: {open: false}})
                    }
                    severity={this.state.mensagem.tipo}
                >
                    {this.state.mensagem.mensagem}
                </Toast>
                <form>
                    <Grid container spacing={2} alignItems='center'>
                        <Grid item>
                            <DatePicker
                                selected={state.startDate}
                                onChange={(date) => this.setState({startDate: date})}
                                showTimeInput
                                dateFormat="Pp"
                                locale="br"
                                isClearable
                                timeIntervals={15}
                                placeholderText='Data Inicial'
                                minDate={this.createDate(state.firstTime).toDate()}
                                maxDate={this.createDate(state.lastTime).toDate()}
                                showDisabledMonthNavigation
                                customTimeInput={<CustomDatePicker/>}
                            />
                        </Grid>
                        <Grid item>
                            <DatePicker
                                selected={this.state.endDate}
                                onChange={(date) => this.setState({endDate: date})}
                                showTimeInput
                                dateFormat="Pp"
                                locale="br"
                                isClearable
                                timeIntervals={15}
                                showDisabledMonthNavigation
                                placeholderText='Data Final'
                                minDate={this.createDate(state.firstTime).toDate()}
                                maxDate={this.createDate(state.lastTime).toDate()}
                                customTimeInput={<CustomDatePicker/>}
                            />
                        </Grid>
                        <Grid item>
                            <Button
                                variant='contained'
                                color='primary'
                                onClick={this.submitFormulario}
                                type='button'
                                disabled={!valid}
                            >
                                Filtrar
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </>
        )
    }
}

export default withRouter(Formulario)

