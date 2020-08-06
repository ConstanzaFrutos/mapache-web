import React, { Component }  from 'react';
import axios from 'axios';

import { TablaAdministracion } from "../../general/TablaAdministracion";
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Add from '@material-ui/icons/Add';

import { withRouter } from 'react-router';
import "../../../assets/css/ModuloProyectos/TablasProyectos.css";
import "../../../assets/css/controller/ProyectosScreen.css";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';


class Backlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tareas: [],
            proyectoId: 0
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }

    obtenerTareas(){
        const proyectoId = +this.props.match.params.id;

        axios.get(URL+proyectoId+'/tareas')
            .then(respuesta => respuesta.data)
            .then((data) => {
                this.setState({
                    tareas : data,
                    proyectoId: proyectoId
                })
            }).catch(function(err){
            if(err.response){
                let mensaje = "Error: " + err.response.data.status;
                if(err.response.data.error){
                    mensaje += '\n' + err.response.data.error;
                }
                alert(mensaje);
            } else {
                alert("Ocurrio un error desconocido");
            }
        });
    }

    componentDidMount() {
        this.obtenerTareas();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.tareas.length !== this.state.tareas.length){
            this.obtenerTareas();
        }
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/proyectos/${this.state.proyectoId}/tareas/:id`
        });    
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de las tareas 
        // se usa para redirigir a la información de
        // la tarea seleccionada
        
        this.props.history.push({
            pathname: `/proyectos/${this.state.proyectoId}/tareas/${oldData.id}`
        });
    }

    render() {
        
        return (
            <div className="proyectos-screen-div">
                 <TablaAdministracion
                    title={ title }
                    columns={ columns }
                    data={ this.state.tareas }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    editable = { null }
                    actions={[
                        {
                            icon: Add,
                            tooltip: "Agregar tarea",
                            position: "toolbar",
                            onClick: () => {
                                this.handleAdd()
                            }
                        },
                        {
                            icon: editIcon,
                            tooltip: "Abrir tarea",
                            onClick: (event, rowData) => {
                                this.handleEdit(rowData)  
                            }
                        }
                    ]}
                >
                </TablaAdministracion>
            </div>
        )
    }
}

export default withRouter(Backlog);

const coloresEstado = [
    {
        estado: "No iniciada",
        color: '#000000'
    },
    {
        estado: "En curso",
        color: '#0033FF'
    },
    {
        estado: "Bloqueada",
        color: '#ff0000'
    },
    {
        estado: "Finalizada",
        color: '#00ff00'
    },
    {
        estado: "Default",
        color: '#000000'
    }
]

function ordenarTareas(tarea1, tarea2) {
    if(tarea1.estado === tarea2.estado){
        return tarea2.id - tarea1.id;
    } else if(tarea1.estado === "En curso"){
        return -1;
    } else if(tarea2.estado === "En curso"){
        return 1;
    } else if(tarea1.estado === "No iniciada"){
        return -1;
    } else if(tarea2.estado === "No iniciada"){
        return 1;
    } else if(tarea1.estado === "Bloqueada"){
        return -1;
    } else if(tarea2.estado === "Bloqueada"){
        return 1;
    } else if(tarea1.estado === "Finalizada"){
        return -1;
    } else if(tarea2.estado === "Finalizada"){
        return 1;
    }
}

function ordenarPrioridades(tarea1, tarea2) {
    if(tarea1.prioridad === tarea2.prioridad){
        return tarea2.id - tarea1.id;
    } else if(tarea1.prioridad === "Alta"){
        return -1;
    } else if(tarea2.prioridad === "Alta"){
        return 1;
    } else if(tarea1.prioridad === "Media"){
        return -1;
    } else if(tarea2.prioridad === "Media"){
        return 1;
    } else if(tarea1.prioridad === "Baja"){
        return -1;
    } else if(tarea2.prioridad === "Baja"){
        return 1;
    }
}

const title = "Backlog";

const columns = [
    {
        title: "Código", 
        field: "id",
        editable: "never",
        defaultSort: "asc"
    },
    {
        title: "Nombre", 
        field: "nombre",
        editable: "never"
    },
    {
        title: "Estado", 
        field: "estado",
        render: rowData => <p 
                    style={{
                        color:`${coloresEstado.find((estado) => estado.estado === rowData.estado).color}`,
                        paddingTop: '1em'
                    }}
                >{ rowData.estado }</p>,
        customSort: (a,b) => ordenarTareas(a,b)
    },
    {
        title: "Fecha de finalización", 
        field: "fechaDeFinalizacion",
        editable: "never",
        render: rowData => <p>
                                { rowData.fechaDeFinalizacion ?
                                    rowData.fechaDeFinalizacion.split('T')[0] :
                                    "" }
                            </p>
    },
    {
        title: "Prioridad",
        field: "prioridad",
        editable: "never",
        customSort: (a,b) => ordenarPrioridades(a,b)
    }
];

const editIcon = InfoOutlined;