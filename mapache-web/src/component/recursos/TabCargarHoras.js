import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabCargarHoras.css";

import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';

import { Dropdown } from "../general/Dropdown";

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
            horaSeleccionada: null
        }

        this.seleccionarActividad = this.seleccionarActividad.bind(this);
        this.seleccionarTarea = this.seleccionarTarea.bind(this);
        this.seleccionarHora = this.seleccionarHora.bind(this);
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
                console.log(response);
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
        let mostrarDropdownTareas = event.target.value === "TAREA" ? true : false;
        
        console.log("Seleccionando actividad ", event.target.value);
        this.setState({
            actividadSeleccionada: event.target.value,
            mostrarDropdownTareas: mostrarDropdownTareas
        });
    }

    seleccionarTarea(event) {
        console.log("Seleccionando tarea ", event.target.value);
        
        this.setState({
            tareaSeleccionada: event.target.value
        });
    }

    seleccionarHora(event) {
        console.log("Seleccionando hora ", event.target.value);
        this.setState({
            horaSeleccionada: event.target.value
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
                        <div className="seleccion-horas">
                            <Dropdown
                                renderDropdown={ true }
                                label="Horas trabajadas"
                                value={ hora }
                                values={ horasDropdown }
                                handleChange={ this.seleccionarHora }
                            >
                            </Dropdown> 
                        </div>
                            
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
        name: "cargar horas",
        value: "cargar horas"
    },
    {
        name: "cargar proyectos",
        value: "cargar proyectos"
    },
    {
        name: "enfermedad",
        value: "enfermad"
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
for (let i=0; i<2; i++) {
    minutos[i] = {
        name: `${60/(4-2*i)} minutos`,
        value: 1/(4-2*i)
    }
}

let horasDropdown = horas.map((hora) => {
    let aux = {};
    aux.name = hora.value > 0 ? hora.name + minutos[0].name : minutos[0].name;
    aux.value = hora.value + minutos[0].value;
    return aux;
});