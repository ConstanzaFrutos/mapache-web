import React, { Component } from 'react';
import { withRouter } from 'react-router';

import LinearProgress from '@material-ui/core/LinearProgress';

import AccessTime from '@material-ui/icons/AccessTime';

import { TablaAdministracion } from "../general/TablaAdministracion";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class TabTareas extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            proyectos: {},
            tareas: {}
        }

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

    handleCargaHoras(tarea) {
        console.log("Tarea a la cual cargar horas: ", tarea);
    }

    render() {
        return (
            <div className="tab-tareas-div">
                <TablaAdministracion
                    title={ title }
                    columns={ columns }
                    data={ data }
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
        )
    }

}

export default withRouter(TabTareas);

const title = `Tareas del empleado`;

//{ title: 'Avatar', field: 'imageUrl', 
//render: rowData => <img src={rowData.imageUrl} style={{width: 40, borderRadius: '50%'}}/> }
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

const data = [
    {
        nombre: "Tarea 1",
        proyecto: "Proyecto 1",
        progreso: 20,
        estado: "En curso"
    }
]