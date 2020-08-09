import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabProyectos.css";

import LinearProgress from '@material-ui/core/LinearProgress';

import { TablaAdministracion } from "../general/TablaAdministracion";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabProyectos extends Component {

    constructor(props) {
        super(props);

        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            asignacionProyectos: [],
            proyectos: [],
            data: []
        }

        this.requestDataProyecto = this.requestDataProyecto.bind(this);
        this.requestHorasProyecto = this.requestHorasProyecto.bind(this);
        this.createData = this.createData.bind(this);
    }

    /*
    1 - Le pido al empleado todas sus asignaciones
    2 - Para cada asignación proyecto obtengo el nombre del proyecto
    3 - Para cada asignacion proyecto obtengo la cantidad de horas que trabajo
    */

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
                }
            })
            .then(response => {
                if (response) {
                    return response;
                }
            }).then(async (asignacionProyectos) => {
                if (asignacionProyectos) {
                    let data = await this.createData(asignacionProyectos);
                    
                    this.setState({
                        asignacionProyectos: asignacionProyectos,
                        data: data
                    });
                }
            });
    }

    requestDataProyecto(codigoProyecto) {
        return this.requesterProyectos.get(`/proyectos/${codigoProyecto}`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar el proyecto ${codigoProyecto}`,
                        "error"
                    );
                }
            })
            .then(response => {
                if (response) {
                    return response;
                }
            });
    }

    requestHorasProyecto(legajo, codigoProyecto) {
        return this.requesterRecursos.get(`/empleados/${legajo}/proyectos/${codigoProyecto}/horas`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar horas del proyecto ${codigoProyecto}`,
                        "error"
                    );
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
    }

    procesarFecha(fecha) {
        return `${fecha[0]}/${fecha[1]}/${fecha[2]}`;
    }

    async createData(asignacionProyectos) {
        let array = await Promise.all(
            asignacionProyectos.map(async (asignacion) => {
                const proyecto = await this.requestDataProyecto(asignacion.codigoProyecto);
                const horas = await this.requestHorasProyecto(
                    this.props.legajo, 
                    asignacion.codigoProyecto
                );

                if (proyecto && horas) {
                    let aux = {
                        nombre: proyecto.nombre,
                        titulo: asignacion.rolEmpleado,
                        progreso: `${horas.horasTrabajadas} hs`,
                        fechaInicio: asignacion.fechaInicio ? this.procesarFecha(asignacion.fechaInicio) : '-',
                        fechaFin: asignacion.fechaFin ? this.procesarFecha(asignacion.fechaFin) : '-'
                    }
                    return aux;
                } else {
                    return null;
                }
            }
        ));
        
        return array.filter((element) => element);
    }

    render() {
        return (
            <div className="tab-proyectos-div">
                <div className="tab-proyectos-body">
                    <TablaAdministracion
                        title={ title }
                        columns={ columns }
                        data={ this.state.data }
                        editable ={ null }
                        actions={ null }
                    >
                    </TablaAdministracion>
                </div>
                { this.props.alerta }
            </div>
        )
    }

}

export default withRouter(TabProyectos);

const title = "Proyectos";

const columns = [
    {
        title: "Nombre", 
        field: "nombre",
        cellStyle: {
            minWidth: '27em'
        }
    },
    {
        title: "Título", 
        field: "titulo",
        cellStyle: {
            minWidth: '10em'
        }
    },
    {
        title: "Desde", 
        field: "fechaInicio",
        cellStyle: {
            minWidth: '9em'
        }
    },
    {
        title: "Hasta", 
        field: "fechaFin",
        cellStyle: {
            minWidth: '9em'
        }
    },
    {
        title: "Horas trabajadas", 
        field: "progreso",
        cellStyle: {
            minWidth: '12em'
        }
    }
]
