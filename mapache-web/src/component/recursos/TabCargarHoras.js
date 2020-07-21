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
            tareaSeleccionada: null
        }

        this.seleccionarTarea = this.seleccionarTarea.bind(this);
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
    
    seleccionarTarea(event) {
        console.log("Seleccionando tarea ", event.target.value);
        this.setState({
            tareaSeleccionada: event.target.value
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

        let tarea = this.state.tareaSeleccionada ? this.state.tareaSeleccionada : tareas[0].value;

        return(
            <div className="tab-cargar-horas-div">
                { avatar }
                <div className={ "tab-cargar-horas-body" }>
                    <Paper square className="paper-cargar-horas">
                        <div className="seleccion-tarea-div">
                            <Dropdown
                                renderDropdown={ true }
                                label="Tarea"
                                value={ tarea }
                                values={ tareas }
                                handleChange={ this.seleccionarTarea }
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

const tareas = [
    {
        name: "cargar horas",
        categoria: "tarea",
        value: "cargar horas"
    },
    {
        name: "cargar proyectos",
        categoria: "tarea",
        value: "cargar proyectos"
    },
    {
        name: "enfermedad",
        categoria: "licencia enfermedad",
        value: "enfermad"
    }
]