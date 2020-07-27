import React, { Component } from 'react';
import { withRouter } from 'react-router';

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
                    console.log("Error al consultar asignaciones del empleado");
                }
            })
            .then(response => {
                if (response) {
                    console.log("Asignacion proyectos: ", response);
                    return response;
                }
            }).then(async (asignacionProyectos) => {
                let data = await this.createData(asignacionProyectos);
                console.log("data ", data);
                this.setState({
                    asignacionProyectos: asignacionProyectos,
                    data: data
                });
            });
    }

    requestDataProyecto(codigoProyecto) {
        return this.requesterProyectos.get(`/proyectos/${codigoProyecto}`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log(`Error al consultar el proyecto ${codigoProyecto}`);
                }
            })
            .then(response => {
                console.log("Proyectos  : ", response);
                return response;
            });
    }

    requestHorasProyecto(legajo, codigoProyecto) {
        return this.requesterRecursos.get(`/empleados/${legajo}/proyectos/${codigoProyecto}/horas`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log(`Error al consultar horas del proyecto ${codigoProyecto}`);
                }
            }).then(response => {
                console.log("Horas: ", response);
                return response;
            });
    }

    async createData(asignacionProyectos) {
        let array = await Promise.all(
            asignacionProyectos.map(async (asignacion) => {
                console.log(asignacion);
                
                const proyecto = await this.requestDataProyecto(asignacion.codigo);
                const horas = await this.requestHorasProyecto(
                    this.props.legajo, 
                    asignacion.codigo
                );
                console.log("Proyecto: ", proyecto);
                let aux = {
                    nombre: proyecto.nombre,
                    titulo: asignacion.rolEmpleado,
                    progreso: horas.cantidadDeHorasTrabajadas,
                }
                console.log("Aux ", aux);
                return aux;
            }
        ));
        console.log("Array: ", array);
        return array;
    }

    render() {
        return (
            <div className="tab-proyectos-div">
                
                <div className="tab-tareas-body">
                    <TablaAdministracion
                        title={ title }
                        columns={ columns }
                        data={ this.state.data }
                        editable ={ null }
                        actions={ null }
                    >
                    </TablaAdministracion>
                </div>
            </div>
        )
    }

}

export default withRouter(TabProyectos);

const title = "Proyectos";

const columns = [
    {
        title: "Nombre", 
        field: "nombre"
    },
    {
        title: "Título", 
        field: "titulo"
    },
    {
        title: "Progreso", 
        field: "progreso",
        render: rowData => <LinearProgress variant="buffer" value={rowData.progreso}/> 
    }
]

