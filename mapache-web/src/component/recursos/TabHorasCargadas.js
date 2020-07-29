import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabHorasCargadas.css";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

    render() {
        let gridSemana = <Grid container justify="center" spacing={2}>
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <Dia value={ value }></Dia>
            ))}
        </Grid>

        return (
            <div className="semana-div">
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
        const fechasSemana = new Date().obtenerFechasSemana();
        console.log("Fechas Semana: ", fechasSemana);

        return (
            <Grid key={this.props.value} item>
                <Paper square>
                    <Typography 
                        variant="subtitle2"
                    >
                        Fecha: { "0" }
                    </Typography>
                </Paper>
            </Grid>
        )
    }

}

class Fecha {
    constructor(fecha) {
        const fechaProcesada = fecha;
    }

    procesarFecha(fecha) {
        return `${fecha.getFullYear()}/${fecha.getMonth()}/${fecha.getDate()}`;
    }

}