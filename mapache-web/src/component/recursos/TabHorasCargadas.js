import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabHorasCargadas.css";

import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import ArrowBack from '@material-ui/icons/ArrowBack';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Work from '@material-ui/icons/Work';
import BeachAccess from '@material-ui/icons/BeachAccess';
import SentimentDissatisfied from '@material-ui/icons/SentimentDissatisfied';

import RequestsHoras from "../../communication/RequesterHoras";

class TabHorasCargadas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fechaActual: new Date(),
            fechaPivote: new Date(),
            horasCargadasSemana: []
        }

        this.requesterHoras = new RequestsHoras();

        this.cambiarASemanaAnterior = this.cambiarASemanaAnterior.bind(this);
        this.cambiarASemanaPosterior = this.cambiarASemanaPosterior.bind(this);
    }

    async componentDidMount() {
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasSemana(
            this.props.match.params.legajo, 
            this.state.fechaActual
        );
        /*console.log("Horas cargadas ", horasCargadas);
        this.setState({
            horasCargadasSemana: horasCargadas
        })*/
    }

    cambiarASemanaAnterior() {
        console.log("Diferencia entre fechas ", this.state.fechaActual.getDate() - this.state.fechaPivote.getDate());
        if (this.state.fechaActual.getDate() - this.state.fechaPivote.getDate() <= 21){
            let fechaPivoteAnterior = new Date();
            const nuevoDia = this.state.fechaPivote.getDate() - 7;
            fechaPivoteAnterior.setDate(nuevoDia);
            console.log("Fecha Pivote anteiror", fechaPivoteAnterior);

            this.setState({
                fechaPivote: fechaPivoteAnterior
            })
        }
    }

    cambiarASemanaPosterior() {
        if (this.state.fechaPivote.getDate() < this.state.fechaActual.getDate()){
            let fechaPivotePosterior = new Date();
            const nuevoDia = this.state.fechaPivote.getDate() + 7;
            fechaPivotePosterior.setDate(nuevoDia);
            console.log("Fecha Pivote posterior", fechaPivotePosterior);

            this.setState({
                fechaPivote: fechaPivotePosterior
            })
        }
    }

    render() {
        return (
            <div className="tab-horas-cargadas-div">
                <Grid container alignItems="center">
                    <Semana
                        fechaPivote={ this.state.fechaPivote }
                        cambiarASemanaAnterior={ this.cambiarASemanaAnterior }
                        cambiarASemanaPosterior={ this.cambiarASemanaPosterior }
                        horasCargadasSemana={ horasCargadas }
                    ></Semana>
                </Grid>
            </div>
        )
    }
    //horasCargadasSemana={ this.state.horasCargadasSemana }
}

export default withRouter(TabHorasCargadas);

class Semana extends Component {

    obtenerHorasCargadasDia(dia) {
        //console.log("Obteniendo las horas cargadas del dia ", dia);
        //console.log(this.props.horasCargadasSemana.filter(hora => hora.fecha === dia));
        //let horasCargadasDia = this.props.horasCargadasSemana.filter(dia => dia.fecha > 6);
        return this.props.horasCargadasSemana.filter(hora => hora.fecha === dia);
    }

    render() {
        const fechasSemana = new Date(this.props.fechaPivote).obtenerFechasSemana();
        const fechas = fechasSemana.map((fecha) => {
            return new Fecha(fecha);
        });

        let gridSemana = <Grid container justify="center" spacing={2}>
            {[0, 1, 2, 3, 4, 5, 6].map((value) => (
                <Dia 
                    value={ value }
                    diaSemana={ fechas[value].diaSemana }
                    fecha={ fechas[value].fechaProcesadaBarra }
                    horasCargadasDia={ this.obtenerHorasCargadasDia(fechas[value].fechaProcesadaGuion) }
                ></Dia>
            ))}
        </Grid>

        return (
            <div className="semana-div">
                <Grid item>
                    <ArrowBack
                        className="back-arrow"
                        onClick={ this.props.cambiarASemanaAnterior }
                    ></ArrowBack>
                </Grid>
                { gridSemana }
                <Grid item>
                    <ArrowForward
                        className="forward-arrow"
                        onClick={ this.props.cambiarASemanaPosterior }
                    ></ArrowForward>
                </Grid>
            </div>
        )
    }

}

// eslint-disable-next-line no-extend-native
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
        //console.log("Horas cargadas dia ", this.props.horasCargadasDia );

        return (
            <Grid key={this.props.value} item>
                <Paper square className="dia-paper">
                    <Typography 
                        align="center"
                        variant="h6"
                        color="textPrimary"
                    >
                        { this.props.diaSemana }
                    </Typography>
                    <Typography 
                        align="center"
                        variant="subtitle1"
                        color="textPrimary"
                    >
                        { this.props.fecha }
                    </Typography>
                    <div className="horas-cargadas-en-el-dia-div">
                        { this.props.horasCargadasDia.map((horas) => {
                            let actividad = actividades.find(
                                actividad => actividad.nombre === horas.actividad
                            );
                            let color = actividad.color;
                            let icono = actividad.icono;
                            return <HoraCargada
                                        color={ color }
                                        cantidadHoras={ horas.cantidadHoras }
                                        icono={ icono }
                                    ></HoraCargada>
                        })}
                    </div>
                </Paper>
            </Grid>
        )
    }

}

class Fecha {
    constructor(fecha) {
        this.diaSemana = this.obtenerDiaSemana(fecha);
        this.fechaProcesadaBarra = this.procesarFecha(fecha, '/');
        this.fechaProcesadaGuion = this.procesarFecha(fecha, '-');
    }

    procesarFecha(fecha, separador) {
        let mes = fecha.getMonth() + 1;
        if (mes <= 9) {
            mes = `0${mes}`;
        }
        let dia = fecha.getDate();
        if (dia <= 9) {
            dia = `0${dia}`;
        }
        return `${fecha.getFullYear()}${separador}${mes}${separador}${dia}`;
    }

    obtenerDiaSemana(fecha) {
        var dias = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
        return dias[fecha.getDay()];
    }

}

class HoraCargada extends Component {
    
    render() {
        const alturaPorHora = 2;
        return (
            <div 
                className="hora-cargada-div"
                style={{
                    "background-color": this.props.color, 
                    "height": `${this.props.cantidadHoras * alturaPorHora}em`
                }}
            >
                { this.props.icono }
                <Typography variant="subtitle1" align="center">
                    { this.props.cantidadHoras } horas
                </Typography>
            </div>
        )
    }

}

const actividades = [
    {
        nombre: "TAREA",
        color: "#FFCCCC",
        icono: <Work/>
    },
    {
        nombre: "VACACIONES",
        color: "#FFFF99",
        icono: <BeachAccess/>
    },
    {
        nombre: "ENFERMEDAD",
        color: "#CCFFFF",
        icono: <SentimentDissatisfied/>
    }
]

const horasCargadas = [
    {
        fecha: "2020-07-29",
        cantidadHoras: 2,
        actividad: "TAREA"
    },
    {
        fecha: "2020-07-28",
        cantidadHoras: 1,
        actividad: "TAREA"
    },
    {
        fecha: "2020-07-28",
        cantidadHoras: 2,
        actividad: "ENFERMEDAD"
    },
    {
        fecha: "2020-07-26",
        cantidadHoras: 5,
        actividad: "VACACIONES"
    },
    {
        fecha: "2020-07-19",
        cantidadHoras: 4,
        actividad: "ENFERMEDAD"
    },
    {
        fecha: "2020-07-15",
        cantidadHoras: 9,
        actividad: "TAREA"
    }
]