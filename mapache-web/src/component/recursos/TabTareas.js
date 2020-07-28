import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabTareas.css";

import LinearProgress from '@material-ui/core/LinearProgress';

import AccessTime from '@material-ui/icons/AccessTime';

import { TablaAdministracion } from "../general/TablaAdministracion";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabTareas extends Component {

    constructor(props) {
        super(props);

        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            empleado: {},
            proyectos: {},
            tareas: []
        }

        this.handleCargaHoras = this.handleCargaHoras.bind(this);
        
        this.requestTareas = this.requestTareas.bind(this);
        this.obtenerProyecto = this.obtenerProyecto.bind(this);
        this.obtenerTareasDeProyecto = this.obtenerTareasDeProyecto.bind(this);
    }

    componentDidMount() {
        let legajo = this.props.match.params.legajo;
        
        this.requesterRecursos.get(`/empleados/${legajo}/proyectos/`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar asignaciones del empleado ${this.state.empleadoSeleccionado.legajo}`,
                        "error"
                    );
                    console.log("Error al consultar asignaciones del empleado");
                }
            })
            .then(response => {
                if (response) {
                    return response;
                }
            }).then(async (asignacionProyectos) => {
                let tareas = await this.requestTareas(asignacionProyectos);
                if (tareas) {
                    console.log("Setting tareas state")
                    this.setState({
                        tareas: tareas
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
                    this.props.mostrarAlerta(
                        `Error al consultar tareas del proyecto ${codigoProyecto}`,
                        "error"
                    )
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
                    this.props.mostrarAlerta(
                        `Error al consultar tareas del proyecto ${codigoProyecto}`,
                        "error"
                    )
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
                if (tareas){
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

    handleCargaHoras(tarea) {
        console.log("Tarea a la cual cargar horas: ", tarea);

        this.props.history.push({
            pathname: `/empleados/${this.props.match.params.legajo}`,
            state: {
                tab: "cargar-horas",
                tarea: tarea
            }
        });
    }

    render() {
        console.log("tareas state ", this.state.tareas);
        return (
            <div className="tab-tareas-div">
                <div className="tab-tareas-body">
                    <TablaAdministracion
                        title={ title }
                        columns={ columns }
                        data={ this.state.tareas }
                        handleAdd={ this.handleAdd }
                        handleEdit={ this.handleEdit }
                        handleDelete={ this.handleDelete } 
                        editIcon={ AccessTime }
                        editable ={ null }
                        actions={[
                            {
                                icon: AccessTime,
                                tooltip: "Cargar horas",
                                onClick: (event, rowData) => {
                                    this.handleCargaHoras(rowData)  
                                }
                            }
                        ]}
                    >
                    </TablaAdministracion>
                </div>
                { this.props.alerta }
            </div>
        )
    }

}

export default withRouter(TabTareas);

const title = `Tareas del empleado`;

const columns = [
    {
        title: "Nombre", 
        field: "nombre"
    },
    {
        title: "Proyecto", 
        field: "proyecto"
    },
    {
        title: "Progreso", 
        field: "progreso",
        render: rowData => <LinearProgress variant="buffer" value={rowData.progreso}/> 
    },
    {
        title: "Estado", 
        field: "estado"
    }
]
