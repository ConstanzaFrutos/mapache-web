import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabCargarHoras.css";

import Paper from '@material-ui/core/Paper';
import Save from '@material-ui/icons/Save'

import { Dropdown } from "../general/Dropdown";
import { DatePicker } from "../general/DatePicker";

import { Fecha } from "./TabHorasCargadas";

import Requester from "../../communication/Requester";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabCargarHoras extends Component {

    constructor(props) {
        super(props);

        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            legajoEmpleado: {},
            contratoEmpleado: '',
            proyectos: {},
            tareas: [],
            tareasDropdown: [],
            actividadSeleccionada: actividades[0].value,
            mostrarDropdownTareas: true,
            tareaSeleccionada: 0,
            fechaSeleccionada: '',
            horaSeleccionada: horasDropdown[0].value,
            semanaSeleccionada: semanasDropdown[0].value,
            mostrarDropdownHoras: true,
            mostrarDropdownSemanas: false
        }

        this.seleccionarActividad = this.seleccionarActividad.bind(this);
        this.seleccionarTarea = this.seleccionarTarea.bind(this);
        this.seleccionarHora = this.seleccionarHora.bind(this);
        this.seleccionarSemanas = this.seleccionarSemanas.bind(this);

        this.handleDateInput = this.handleDateInput.bind(this);

        this.handleCargaHoras = this.handleCargaHoras.bind(this);
        this.handleCargaHorasTarea = this.handleCargaHorasTarea.bind(this);
        this.handleCargaHorasVacaciones = this.handleCargaHorasVacaciones.bind(this);
        this.handleCargaHorasOtras = this.handleCargaHorasOtras.bind(this);

        this.obtenerTareasDeEmpleado = this.obtenerTareasDeEmpleado.bind(this);
        this.obtenerProyectos = this.obtenerProyectos.bind(this);
    }

    async componentDidMount() {
        let legajo = this.props.match.params.legajo;
        let contrato = this.props.match.params.contrato;

        let tareas = await this.obtenerTareasDeEmpleado(legajo);
        let proyectos = await this.obtenerProyectos();

        let tareasDropdown = [{
            name: "No tiene tareas asignadas",
            value: -1
        }]
        
        if (tareas.length > 0) {
            tareas.map((tarea) => {
                let proyecto = proyectos.find(proyecto => proyecto.nombre === tarea.nombreProyecto);
                tarea.codigoProyecto = proyecto.id;
                return tarea;
            })
    
            tareasDropdown = tareas.map((tarea) => {
                return {
                    name: tarea.nombreTarea,
                    value: tarea.id
                }
            })
        }

        if (this.props.tarea){
            this.setState({
                tareasDropdown: tareasDropdown,
                tareaSeleccionada: this.props.tarea.id,
                legajoEmpleado: legajo,
                contratoEmpleado: contrato,
                tareas: tareas
            });
        } else {
            this.setState({
                tareasDropdown: tareasDropdown,
                tareaSeleccionada: tareasDropdown[0].value,
                legajoEmpleado: legajo,
                contratoEmpleado: contrato,
                tareas: tareas
            });
        }
    }

    async obtenerTareasDeEmpleado(legajo) {
        let tareas = await this.requesterProyectos.get(`/responsables/${legajo}/tareas`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar tareas del empleado ${legajo}`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
        return tareas;
    }

    async obtenerProyectos() {
        let proyectos = this.requesterProyectos.get(`/proyectos`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar proyectos`,
                        "error"
                    )
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
        return proyectos;
    }

    seleccionarActividad(event) {
        let mostrarDropdownTareas = event.target.value === "TAREA" ? true : false;
        
        let mostrarDropdownSemanas = event.target.value === "VACACIONES" ? true : false;
        
        console.log("Seleccionando actividad ", event.target.value);
        this.setState({
            actividadSeleccionada: event.target.value,
            mostrarDropdownTareas: mostrarDropdownTareas,
            mostrarDropdownSemanas: mostrarDropdownSemanas,
            mostrarDropdownHoras: !mostrarDropdownSemanas
        }); 
    }

    seleccionarTarea(event) {
        this.setState({
            tareaSeleccionada: event.target.value
        });
    }

    seleccionarHora(event) {
        this.setState({
            horaSeleccionada: event.target.value
        });
    }

    seleccionarSemanas(event) {
        const horasPorSemana = this.state.contratoEmpleado === "FULL_TIME" ?
                        5 * horasFullTime : 5 * horasPartTime;
        let horas = event.target.value * horasPorSemana;              
        console.log("Horas vacaciones ", horas);
        this.setState({
            semanaSeleccionada: event.target.value,
            horaSeleccionada: horas
        });
    }

    handleDateInput(event) {
        this.setState({
            fechaSeleccionada: event.target.value
        });
    }

    handleCargaHorasTarea() {
        let tareaId = this.state.tareaSeleccionada;
        let proyectoId = this.state.tareas.find(tarea => tarea.id === tareaId).codigoProyecto;

        const uri = `/empleados/${this.state.legajoEmpleado}/horas`;
        const payload = {
            "actividad": this.state.actividadSeleccionada,
            "cantidadHoras": this.state.horaSeleccionada,
            "fecha": this.state.fechaSeleccionada,
            "proyectoId": proyectoId,
            "tareaId": this.state.tareaSeleccionada
        }

        this.requesterRecursos.post(uri, payload)
            .then(response => {
                if (response.ok){
                    this.props.mostrarAlerta(
                        `Carga de horas exitosa`,
                        "success"
                    );
                } else {
                    this.props.mostrarAlerta(
                        `Error al cargar horas al empleado con legajo ${this.state.legajoEmpleado}`,
                        "error"
                    );
                }
            });
    }


    handleCargaHorasVacaciones() {
        let cantidadHoras = this.state.contrato === 'PART_TIME' ? 4 : 9;
        let fechasSemana = new Date(this.state.fechaSeleccionada).obtenerFechasSemana();
        console.log("fechas semana", fechasSemana)
        for (let i=1; i<this.state.semanaSeleccionada; ++i){
            let fechaSemanaSiguiente = new Date(fechasSemana[fechasSemana.length-1]);
            fechaSemanaSiguiente.setDate(fechaSemanaSiguiente.getDate() + 1);
            let fechasSemanaSiguiente = new Date(fechaSemanaSiguiente).obtenerFechasSemana();
            fechasSemana = fechasSemana.concat(fechasSemanaSiguiente);
        }
        
        const fechas = fechasSemana.map((fecha) => {
            return new Fecha(fecha);
        });
        fechasSemana = fechas.map((fecha) => fecha.fechaProcesadaGuion)

        const uri = `/empleados/${this.state.legajoEmpleado}/horas`;
        fechasSemana.forEach((fecha) => {
            let payload = {
                "actividad": this.state.actividadSeleccionada,
                "cantidadHoras": cantidadHoras,
                "fecha": fecha,
                "proyectoid": null,
                "tareaId": null
            }

            this.requesterRecursos.post(uri, payload)
                .then(response => {
                    if (response.ok){
                        this.props.mostrarAlerta(
                            `Carga de horas exitosa`,
                            "success"
                        );
                    } else {
                        this.props.mostrarAlerta(
                            `Error al cargar horas al empleado con legajo ${this.state.legajoEmpleado}`,
                            "error"
                        );
                    }
                });
        })

    }

    handleCargaHorasOtras() {
        const uri = `/empleados/${this.state.legajoEmpleado}/horas`;
        let payload = {
            "actividad": this.state.actividadSeleccionada,
            "cantidadHoras": this.state.horaSeleccionada,
            "fecha": this.state.fechaSeleccionada,
            "proyectoid": null,
            "tareaId": null
        }
        
        this.requesterRecursos.post(uri, payload)
            .then(response => {
                if (response.ok){
                    this.props.mostrarAlerta(
                        `Carga de horas exitosa`,
                        "success"
                    );
                } else {
                    this.props.mostrarAlerta(
                        `Error al cargar horas al empleado con legajo ${this.state.legajoEmpleado}`,
                        "error"
                    );
                }
            });
    }

    handleCargaHoras() {
        if (this.state.actividadSeleccionada === "TAREA") {
            this.handleCargaHorasTarea();
        } else if (this.state.actividadSeleccionada === "VACACIONES") {
            this.handleCargaHorasVacaciones();
        } else {
            this.handleCargaHorasOtras();
        }
    }

    render() {
        let actividad = this.state.actividadSeleccionada ? this.state.actividadSeleccionada : actividades[0].value;
        let tarea = this.state.tareaSeleccionada;
        
        let hora = this.state.horaSeleccionada ? this.state.horaSeleccionada : horasDropdown[0].value;
        let cantidadSemanas = this.state.semanaSeleccionada ? this.state.semanaSeleccionada : semanasDropdown[0].value;

        return(
            <div className="tab-cargar-horas-div">
                
                <div className={ "tab-cargar-horas-body" }>
                    <Paper square className="paper-cargar-horas">
                        <div className="seleccion-tarea-div">
                            <Dropdown
                                renderDropdown={ true }
                                label="Actividad"
                                value={ actividad }
                                values={ actividades }
                                handleChange={ this.seleccionarActividad }
                            >
                            </Dropdown> 
                            
                            <Dropdown
                                renderDropdown={ this.state.mostrarDropdownTareas }
                                label="Tarea"
                                value={ tarea }
                                values={ this.state.tareasDropdown }
                                handleChange={ this.seleccionarTarea }
                            >
                            </Dropdown> 
                        </div>    
                        <div className="seleccion-fecha-carga-horas-div">
                            <DatePicker 
                                label="Fecha"
                                handleDateInput={ this.handleDateInput }
                            ></DatePicker>
                        </div>
                        <div className="seleccion-tiempo-div">
                            <Dropdown
                                renderDropdown={ this.state.mostrarDropdownHoras }
                                label="Horas trabajadas"
                                value={ hora }
                                values={ horasDropdown }
                                handleChange={ this.seleccionarHora }
                            >
                            </Dropdown> 

                            <Dropdown
                                renderDropdown={ this.state.mostrarDropdownSemanas }
                                label="Semanas"
                                value={ cantidadSemanas }
                                values={ semanasDropdown }
                                handleChange={ this.seleccionarSemanas }
                            >
                            </Dropdown> 
                        </div>
                        <div className="icono-guardar-carga-hora">
                            <Save 
                                onClick={ this.handleCargaHoras }
                            ></Save>
                        </div>
                        <br></br>
                    </Paper>
                </div>
                { this.props.alerta }
            </div>
        )
    }

}

export default withRouter(TabCargarHoras);

const actividades = [
    {
        name: "Tarea",
        value: "TAREA"
    },
    {
        name: "Enfermedad",
        value: "ENFERMEDAD"
    },
    {
        name: "Vacaciones",
        value: "VACACIONES"
    },
    {
        name: "Día de estudio",
        value: "DIA_DE_ESTUDIO"
    }
]

let horas = [];
for (let i=0; i<10; i++) {
    horas[i] = {
        name: `${i} horas `,
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
        name: `${60*(i/4)} minutos`,
        value: i/4
    }
}

let horasDropdown = [];

horas.forEach((hora) => {
    minutos.forEach((minuto) => {
        let aux = {};
        aux.name = hora.value > 0 ? hora.name + minuto.name : minuto.name;
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

const horasFullTime = 9;
const horasPartTime = 4;

let semanasDropdown = [];
for (let i=0; i<4; i++) {
    semanasDropdown[i] = {
        name: `${i+1} semanas`,
        value: i+1
    }
}