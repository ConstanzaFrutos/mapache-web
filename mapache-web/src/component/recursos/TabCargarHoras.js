import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabCargarHoras.css";

import Paper from '@material-ui/core/Paper';
import Save from '@material-ui/icons/Save'

import { Dropdown } from "../general/Dropdown";
import { DatePicker } from "../general/DatePicker";

import { OperacionesHoras } from "../../communication/OperacionesHoras";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabCargarHoras extends Component {

    constructor(props) {
        super(props);

        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            legajoEmpleado: {},
            proyectos: {},
            tareas: [],
            tareasDropdown: [],
            actividadSeleccionada: null,
            mostrarDropdownTareas: true,
            tareaSeleccionada: null,
            fechaSeleccionada: null,
            horaSeleccionada: null,
            semanaSeleccionada: null,
            mostrarDropdownHoras: true,
            mostrarDropdownSemanas: false
        }

        this.seleccionarActividad = this.seleccionarActividad.bind(this);
        this.seleccionarTarea = this.seleccionarTarea.bind(this);
        this.seleccionarHora = this.seleccionarHora.bind(this);

        this.handleDateInput = this.handleDateInput.bind(this);

        this.handleCargaHoras = this.handleCargaHoras.bind(this);

        this.obtenerTareasDropdown = this.obtenerTareasDropdown.bind(this);
        this.requestTareas = this.requestTareas.bind(this);
        this.obtenerTareasDeProyecto = this.obtenerTareasDeProyecto.bind(this);
        this.obtenerProyecto = this.obtenerProyecto.bind(this);
    }

    componentDidMount() {
        let legajo = this.props.match.params.legajo;

        console.log("This props tarea", this.props.tarea);
        if (this.props.tarea){
            console.log("Tarea seleccionada ", this.props.tarea);
            this.setState({
                tareaSeleccionada: this.props.tarea.codigoTarea,
                legajoEmpleado: legajo
            });
        } else {
            this.obtenerTareasDropdown(legajo);
        }
    }

    obtenerTareasDropdown(legajo) {
        this.requesterRecursos.get(`/empleados/${legajo}/proyectos/`)
                .then(response => {
                    if (response.ok){
                        return response.json();
                    } else {
                        console.log("Error al consultar asignaciones del empleado");
                    }
                })
                .then(response => {
                    if (response) {
                        return response;
                    }
                }).then(async (asignacionProyectos) => {
                    if(asignacionProyectos) {
                        let tareas = await this.requestTareas(asignacionProyectos);
                        console.log("Tareas", tareas);
                        let tareasDropdown = tareas.map((tarea) => {
                            return {
                                name: tarea.nombre,
                                value: tarea.codigoTarea
                            }
                        })

                        this.setState({
                            tareas: tareas,
                            tareaSeleccionada: tareasDropdown[0].value,
                            tareasDropdown: tareasDropdown,
                            legajoEmpleado: legajo
                        });
                    }
                });
    }

    obtenerTareasDeProyecto(codigoProyecto) {
        return this.requesterProyectos.get(`/proyectos/${codigoProyecto}/tareas`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log(`Error al consultar tareas del proyecto ${codigoProyecto}`);
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
    }

    obtenerProyecto(codigoProyecto) {
        return this.requesterProyectos.get(`/proyectos/${codigoProyecto}`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log(`Error al consultar tareas del proyecto ${codigoProyecto}`);
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
    }

    async requestTareas(asignacionProyectos) {
        let array = await Promise.all(
            asignacionProyectos.map(async (asignacion) => {
                console.log("Asignacion proyecto", asignacion);
                const tareas = await this.obtenerTareasDeProyecto(asignacion.codigo); 
                const proyecto = await this.obtenerProyecto(asignacion.codigo);

                if (tareas) {
                    return tareas.map( (tarea) => {                    
                        return {
                            codigoTarea: tarea.id,
                            codigoProyecto: proyecto.id,
                            nombre: tarea.nombre,
                            proyecto: proyecto.nombre,
                            progreso: 10,
                            estado: tarea.estado
                        }
                    })
                } else {
                    return [];
                }
            })
        );    
        console.log("Array", array.flatMap(aux => aux));
        return array.flatMap(aux => aux);;
    }
    
    seleccionarActividad(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);

        let mostrarDropdownTareas = event.target.value === "TAREA" ? true : false;
        
        let mostrarDropdownSemanas = event.target.value === "VACACIONES" ? true : false;
        
        console.log("Seleccionando actividad ", event.target.value);
        this.setState({
            empleado: empleado,
            actividadSeleccionada: event.target.value,
            mostrarDropdownTareas: mostrarDropdownTareas,
            mostrarDropdownSemanas: mostrarDropdownSemanas,
            mostrarDropdownHoras: !mostrarDropdownSemanas
        }); 
    }

    seleccionarTarea(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);
        
        this.setState({
            empleado: empleado,
            tareaSeleccionada: event.target.value
        });
    }

    seleccionarHora(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);

        this.setState({
            empleado: empleado,
            horaSeleccionada: event.target.value
        });
    }

    seleccionarSemanas(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);

        const horasPorSemana = empleado.contrato === "FULL_TIME" ?
                        5 * horasFullTime : 5 * horasPartTime;
        let horas = event.target.value * horasPorSemana;              
        console.log("Seleccionando semanas ", event.target.value);
        this.setState({
            empleado: empleado,
            semanaSeleccionada: event.target.value,
            horaSeleccionada: horas
        });
    }

    handleDateInput(event) {
        this.setState({
            fechaSeleccionada: event.target.value
        });
    }

    handleCargaHoras() {
        let tareaId = this.state.tareaSeleccionada;
        let proyectoId = this.state.tareas.find(tarea => tarea.codigoTarea === tareaId).codigoProyecto;
        
        this.requesterRecursos.post(
            `/empleados/${this.state.legajoEmpleado}/proyectos/${proyectoId}/tareas/${tareaId}/horas?fecha=${this.state.fechaSeleccionada}&horas=${this.state.horaSeleccionada}`
        ).then(response => {
            if (response.ok){
                console.log("ok");
            } else {
                console.log(`Error al cargar horas al empleado con legajo ${this.state.empleado.legajo}`);
            }
        });
    }

    render() {
        let actividad = this.state.actividadSeleccionada ? this.state.actividadSeleccionada : actividades[0].value;
        //let tarea = this.state.tareaSeleccionada ? this.state.tareaSeleccionada : this.state.tareas[0].value;
        let tarea = null;
        if (this.state.tareaSeleccionada) {
            console.log("Seleccionaste tarea ", this.state.tareaSeleccionada)
            tarea = this.state.tareaSeleccionada;
        } else if (this.state.tareasDropdown[0]) {
            tarea = this.state.tareasDropdown[0].value;
        } else {
            tarea = "tarea"
        }
        let hora = this.state.horaSeleccionada ? this.state.horaSeleccionada : horasDropdown[0].value;
        let cantidadSemanas = this.state.semanaSeleccionada ? this.state.semanaSeleccionada : semanasDropdown[0].value;

        //console.log("minutos ", minutos);

        //console.log("horasDropdown ", horasDropdown);

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
for (let i=0; i<2; i++) {
    minutos[i+1] = {
        name: `${60/(4-2*i)} minutos`,
        value: 1/(4-2*i)
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

const horasFullTime = 40;
const horasPartTime = 20;

let semanasDropdown = [];
for (let i=0; i<4; i++) {
    semanasDropdown[i] = {
        name: `${i+1} semanas`,
        value: i+1
    }
}