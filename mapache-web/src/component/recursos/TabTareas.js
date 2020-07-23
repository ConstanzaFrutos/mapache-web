import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabTareas.css";

import LinearProgress from '@material-ui/core/LinearProgress';
import Avatar from '@material-ui/core/Avatar';

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

        this.props.history.push({
            pathname: `/empleados/${this.props.match.params.legajo}`,
            state: {
                tab: "cargar-horas"
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


        return (
            <div className="tab-tareas-div">
                { avatar }
                <div className="tab-tareas-body">
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

const data = [
    {
        nombre: "Consultar tickets resueltos",
        proyecto: "ERP Cloud",
        progreso: 20,
        estado: "En curso"
    },
    {
        nombre: "Ingresar datos de facturación",
        proyecto: "ERP Cloud",
        progreso: 80,
        estado: "En curso"
    }
]