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
import School from '@material-ui/icons/School';

import Requester from "../../communication/Requester";
import RequesterHoras from "../../communication/RequesterHoras";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabHorasCargadas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fechaActual: new Date(),
            fechaPivote: new Date(),
            horasCargadasSemana: []
        }

        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);
        this.requesterHoras = new RequesterHoras();

        this.cambiarASemanaAnterior = this.cambiarASemanaAnterior.bind(this);
        this.cambiarASemanaPosterior = this.cambiarASemanaPosterior.bind(this);

        this.obtenerNombreTarea = this.obtenerNombreTarea.bind(this);
    }

    async componentDidMount() {
        const horasCargadas = await this.requesterHoras.obtenerHorasCargadasEnCantDias(
            this.props.match.params.legajo, 
            this.state.fechaActual,
            28,
            this.props.mostrarAlerta
        );
        console.log("Horas cargadas ", horasCargadas);
        let aux = await Promise.all(horasCargadas.map(async (hora) => {
            let nombreTarea = '';
            if (hora.actividad === "TAREA") {
                let tarea = await this.obtenerNombreTarea(hora.proyectoId, hora.tareaId);
                if (tarea) {
                    nombreTarea = tarea.nombre
                }
            }
            hora.nombreTarea = nombreTarea;
            return hora;
        }));

        this.setState({
            horasCargadasSemana: aux
        })        
    }

    async obtenerNombreTarea(codigoProyecto, codigoTarea) {
        let tarea = await this.requesterProyectos.get(`/proyectos/${codigoProyecto}/tareas/${codigoTarea}`)
                        .then(response => {
                            if (response.ok){
                                return response.json();
                            } else {
                                this.props.mostrarAlerta(
                                    `Error al consultar tarea ${codigoTarea}`,
                                    "error"
                                );
                            }
                        }).then(response => {
                            if (response) {
                                return response;
                            }
                        });
        return tarea;
    }

    cambiarASemanaAnterior() {
        let diferenciaDeTiempo = this.state.fechaActual.getTime() - this.state.fechaPivote.getTime(); 
        let diferenciaDeDias = diferenciaDeTiempo / (1000 * 3600 * 24);
        
        if (diferenciaDeDias <= 21){
            let fechaPivoteAnterior = this.state.fechaPivote;
            const nuevoDia = this.state.fechaPivote.getDate() - 7;
            fechaPivoteAnterior.setDate(nuevoDia);

            this.setState({
                fechaPivote: fechaPivoteAnterior
            })
        }
    }

    cambiarASemanaPosterior() {
        if (this.state.fechaPivote < this.state.fechaActual){
            let fechaPivotePosterior = this.state.fechaPivote;
            const nuevoDia = this.state.fechaPivote.getDate() + 7;
            fechaPivotePosterior.setDate(nuevoDia);

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
                        horasCargadasSemana={ this.state.horasCargadasSemana }
                    ></Semana>
                </Grid>
                { this.props.alerta }
            </div>
        )
    }
    
}

export default withRouter(TabHorasCargadas);

class Semana extends Component {
    procesarFecha(fecha) {
        let mes = fecha[1];
        if (mes <= 9) {
            mes = `0${mes}`;
        }
        let dia = fecha[2];
        if (dia <= 9) {
            dia = `0${dia}`;
        }
        return `${fecha[0]}-${mes}-${dia}`;
    }

    obtenerHorasCargadasDia(dia) {
        return this.props.horasCargadasSemana.filter(hora => this.procesarFecha(hora.fecha) === dia);
    }

    render() {
        const fechasSemana = new Date(this.props.fechaPivote).obtenerFechasSemana();
        const fechas = fechasSemana.map((fecha) => {
            return new Fecha(fecha);
        });

        let gridSemana = <Grid container justify="center" spacing={2}>
            {[1, 2, 3, 4, 5].map((value) => (
                <Dia 
                    key = { value }
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

    procesarHoras(horasCargadas) {
        let horasProcesadas = new Map();

        horasCargadas.forEach((hora) => {
            if (horasProcesadas.has(hora.actividad) && hora.actividad !== "TAREA") {
                let aux = horasProcesadas.get(hora.actividad);
                aux.cantidadHoras += hora.cantidadHoras;
                horasProcesadas.set(hora.actividad, aux);
            } else if (hora.actividad === "TAREA"){
                if (horasProcesadas.has(hora.nombreTarea)) {
                    let aux = horasProcesadas.get(hora.nombreTarea);
                    aux.cantidadHoras += hora.cantidadHoras;
                    horasProcesadas.set(hora.nombreTarea, aux);
                } else {
                    horasProcesadas.set(hora.nombreTarea, hora);
                }
            } else {
                horasProcesadas.set(hora.actividad, hora);
            }
        });

        return Array.from(horasProcesadas.values());
    }

    render() {
        const horasProcesadas = this.procesarHoras(this.props.horasCargadasDia);

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
                        { horasProcesadas.map((horas) => {
                            let actividad = actividades.find(
                                actividad => actividad.nombre === horas.actividad
                            );

                            let color = actividad.color;
                            let icono = actividad.icono;
                            return <HoraCargada
                                        color={ color }
                                        cantidadHoras={ horas.cantidadHoras }
                                        icono={ icono }
                                        nombreTarea={ horas.nombreTarea }
                                    ></HoraCargada>
                        })}
                    </div>
                </Paper>
            </Grid>
        )
    }

}

export class Fecha {
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
        let nombreTarea = this.props.nombreTarea;

        let altura = (this.props.cantidadHoras > 1) ? this.props.cantidadHoras * alturaPorHora : alturaPorHora;
        let texto = horasDropdown.find((hora) => hora.value === this.props.cantidadHoras).name;

        return (
            <div 
                className="hora-cargada-div"
                style={{
                    "backgroundColor": this.props.color, 
                    "height": `${ altura }em`
                }}
            >
                <div className="icono-y-cantidad-horas">
                    { this.props.icono }
                    <Typography variant="subtitle1" wrap="wrap">
                        { texto }
                    </Typography>
                </div>
                
                <Typography variant="body2" wrap="wrap" align="center">
                    { nombreTarea } 
                </Typography>
            
            </div>
        )
    }

}

const actividades = [
    {
        nombre: "TAREA",
        color: "#FFCCCC",
        icono: <Work style={{ paddingRight: '5%'}}/>
    },
    {
        nombre: "VACACIONES",
        color: "#FFFF99",
        icono: <BeachAccess style={{ paddingRight: '5%'}}/>
    },
    {
        nombre: "ENFERMEDAD",
        color: "#CCFFFF",
        icono: <SentimentDissatisfied style={{ paddingRight: '5%'}}/>
    },
    {
        nombre: "DIA_DE_ESTUDIO",
        color: "#FFE4B5",
        icono: <School style={{ paddingRight: '5%'}}/>
    }
]


let horas = [];
for (let i=0; i<10; i++) {
    horas[i] = {
        name: i > 1 ? `${i} hs ` : `${i} hora`,
        value: i
    }
}

let minutos = [];
minutos[0] = {
    name: "",
    value: 0
}
for (let i=1; i<4; i++) {
    minutos[i+1] = {
        name: `${60*(i/4)} min`,
        value: i/4
    }
}

let horasDropdown = [];

horas.forEach((hora) => {
    minutos.forEach((minuto) => {
        let aux = {};
        aux.name = hora.value > 0 ? hora.name + ' ' + minuto.name : minuto.name;
        aux.value = hora.value + minuto.value;
        horasDropdown.push(aux);
        if (
            (hora.value === 0 && minuto.value === 0) ||
            (hora.value === 9 && minuto.value > 0)
        ) {
            horasDropdown.pop();
        }
    })
});