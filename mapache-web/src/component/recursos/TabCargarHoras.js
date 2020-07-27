import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabCargarHoras.css";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Save from '@material-ui/icons/Save'

import { Dropdown } from "../general/Dropdown";
import { DatePicker } from "../general/DatePicker";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class TabCargarHoras extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            proyectos: {},
            tareas: {},
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
    }

    componentDidMount() {
        let legajo = this.props.match.params.legajo;
        this.requester.get('/empleados/' + legajo)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar empleado con legajo: ");
                }
            })
            .then(response => {
                console.log("Empleado: ", response);
                let iniciales = response.nombre.charAt(0) + response.apellido.charAt(0);
                iniciales = iniciales.toUpperCase();                

                if (response) {
                    this.setState({
                        empleado: response,
                        iniciales: iniciales
                    });
                }
            });
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
        console.log("Seleccionando tarea ", event.target.value);
        
        this.setState({
            empleado: empleado,
            tareaSeleccionada: event.target.value
        });
    }

    seleccionarHora(event) {
        let empleado = (Object.is(this.state.empleado, {})) ? 
            {} : Object.assign({}, this.state.empleado);

        console.log("Seleccionando hora ", event.target.value);
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
        let proyectoId = 1;
        let tareaId = 1;
        this.requester.post(
            `/empleados/${this.state.empleado.legajo}/proyectos/${proyectoId}/tareas/${tareaId}/horas/fecha?="`
        ).then(response => {
            if (response.ok){
                console.log("ok");
            } else {
                console.log("Error al consultar empleado con legajo: ");
            }
        });
    }

    render() {
        
        let nombreYApellido = this.state.empleado.apellido + ", " + this.state.empleado.nombre;
        let avatar = <div className={"foto-y-nombre"}>
                    <Avatar className="avatar">
                        {this.state.iniciales}
                    </Avatar>
                    <p className={"nombre"}>
                        {nombreYApellido}
                    </p>
                </div>

        let actividad = this.state.actividadSeleccionada ? this.state.actividadSeleccionada : actividades[0].value;
        let tarea = this.state.tareaSeleccionada ? this.state.tareaSeleccionada : tareas[0].value;
        let hora = this.state.horaSeleccionada ? this.state.horaSeleccionada : horasDropdown[0].value;
        let cantidadSemanas = this.state.semanaSeleccionada ? this.state.semanaSeleccionada : semanasDropdown[0].value;

        console.log("minutos ", minutos);

        console.log("horasDropdown ", horasDropdown);

        return(
            <div className="tab-cargar-horas-div">
                { avatar }
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
                                values={ tareas }
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

const tareas = [
    {
        name: "Consultar tickets resueltos",
        value: "Consultar tickets resueltos"
    },
    {
        name: "Ingresar datos de facturación",
        value: "Ingresar datos de facturación"
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