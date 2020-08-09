import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabTareas.css";

import LinearProgress from '@material-ui/core/LinearProgress';

import AccessTime from '@material-ui/icons/AccessTime';

import { TablaAdministracion } from "../general/TablaAdministracion";

import RequesterHoras from "../../communication/RequesterHoras";
import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabTareas extends Component {

    constructor(props) {
        super(props);

        this.requesterHoras = new RequesterHoras();
        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            empleado: {},
            proyectos: {},
            tareas: []
        }

        this.handleCargaHoras = this.handleCargaHoras.bind(this);

        this.obtenerTareasDeEmpleado = this.obtenerTareasDeEmpleado.bind(this);
        this.obtenerProgresoDelEmpleado = this.obtenerProgresoDelEmpleado.bind(this);
    }

    async componentDidMount() {
        let legajo = this.props.match.params.legajo;
        
        let tareas = await this.obtenerTareasDeEmpleado(legajo);
        if (tareas) {
            let tareasConProgreso = await this.obtenerProgresoDelEmpleado(legajo, tareas);
            this.setState({
                tareas: tareasConProgreso
            });
        }
    }

    obtenerTareasDeEmpleado(legajo) {
        return this.requesterProyectos.get(`/responsables/${legajo}/tareas`)
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
    }

    async obtenerProgresoDelEmpleado(legajo, tareas) {
        let progreso = await Promise.all(tareas.map(async (tarea) => {
            
            let horas = await this.requesterHoras.obtenerHorasCargadasEnTarea(
                legajo, 1, tarea.id, this.props.mostrarAlerta
            );
            
            let totalHoras = 0;
            if (horas.length > 0) {
                totalHoras = horas.reduce(function(valorAnterior, valorActual, indice, vector){
                    return valorAnterior.horas + valorActual.horas;
                })
            }
            
            tarea.progreso = 0;
            if (tarea.duracionEstimada > 0) {
                tarea.progreso = (totalHoras * 100) / tarea.duracionEstimada;
            } else if (tarea.estado === "Finalizada") {
                tarea.progreso = 100;
            }
            
            return tarea;
        }));

        return progreso;
    }

    handleCargaHoras(tarea) {
        if (tarea.estado === "Finalizada") {
            this.props.mostrarAlerta(
                `No se le pueden cargar horas a una tarea finalizada`,
                "error"
            )
        } else {
            this.props.history.push({
                pathname: `/empleados/${this.props.match.params.legajo}`,
                state: {
                    tab: "cargar-horas",
                    tarea: tarea
                }
            });
        }
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
        field: "nombreTarea",
        cellStyle: {
            minWidth: '27em'
        }
    },
    {
        title: "Proyecto", 
        field: "nombreProyecto",
        cellStyle: {
            minWidth: '20em'
        }
    },
    {
        title: "Progreso", 
        field: "progreso",
        render: rowData => <LinearProgress variant="buffer" value={rowData.progreso}/> 
    },
    {
        title: "Estado", 
        field: "estado",
        cellStyle: {
            minWidth: '13em'
        }
    }
]
