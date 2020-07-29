import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabHorasCargadas.css";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowBack from '@material-ui/icons/ArrowBack'

class TabHorasCargadas extends Component {

    render() {
        return (
            <div className="tab-horas-cargadas-div">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Semana></Semana>
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default withRouter(TabHorasCargadas);

class Semana extends Component {

    cambiarASemanaAnterior() {

    }

    render() {
        const fechasSemana = new Date().obtenerFechasSemana();
        const fechas = fechasSemana.map((fecha) => {
            return new Fecha(fecha);
        });

        let gridSemana = <Grid container justify="center" spacing={2}>
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <Dia 
                    value={ value }
                    fecha={ fechas[value].fechaProcesada }
                ></Dia>
            ))}
        </Grid>

        return (
            <div className="semana-div">
                <Grid item >
                    <ArrowBack
                        onClick={ this.cambiarASemanaAnterior }
                    ></ArrowBack>
                </Grid>
                { gridSemana }
            </div>
        )
    }

}

Date.prototype.obtenerFechasSemana = function(){
    return [new Date(this.setDate(this.getDate()-this.getDay()))]
    .concat(
      String(Array(6)).split(',')
         .map ( function(){
                 return new Date(this.setDate(this.getDate()+1));
               }, this )
    );
}

class Dia extends Component {    

    render() {
        return (
            <Grid key={this.props.value} item>
                <Paper square className="dia-paper">
                    <Typography 
                        variant="subtitle1"
                        color="textPrimary"
                    >
                        Fecha: { this.props.fecha }
                    </Typography>
                </Paper>
            </Grid>
        )
    }

}

class Fecha {
    constructor(fecha) {
        this.fechaProcesada = this.procesarFecha(fecha);
    }

    procesarFecha(fecha) {
        return `${fecha.getFullYear()}/${fecha.getMonth()}/${fecha.getDate()}`;
    }

}
