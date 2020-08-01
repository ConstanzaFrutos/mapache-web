import React, { Component }  from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

import { TablaAdministracion } from "../../general/TablaAdministracion";
import InfoOutlined from '@material-ui/icons/InfoOutlined';
import Add from '@material-ui/icons/Add';
import Reorder from '@material-ui/icons/Reorder';

import "../../../assets/css/ModuloProyectos/TablasProyectos.css";
import "../../../assets/css/controller/ProyectosScreen.css";
const URL = 'https://mapache-proyectos.herokuapp.com/';

class ListadoProyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proyectos : []
        };

        this.handleAdd = this.handleAdd.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    obtenerProyectos(){
        axios.get(URL+'proyectos')
            .then(respuesta => respuesta.data)
            .then((data) => {
                this.setState({proyectos : data})
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
        this.obtenerProyectos();
    }

    definirColor(estado){
        if(estado === "No iniciado"){
            //negro
            return '#000000';
        } else if(estado === "Activo"){
            //azul
            return '#0033FF';
        } else if(estado === "Suspendido"){
            //gris
            return '#808080';
        } else if(estado === "Cancelado"){
            //rojo
            return '#ff0000';
        } else if(estado === "Finalizado"){
            //verde
            return '#00ff00';
        }
        //negro
        return '#000000';
    }

    ordenarProyectos(proyecto1, proyecto2) {
        if(proyecto1.estado === proyecto2.estado){
            return proyecto2.id - proyecto1.id;
        } else if(proyecto1.estado === "Activo"){
            return -1;
        } else if(proyecto2.estado === "Activo"){
            return 1;
        } else if(proyecto1.estado === "No iniciado"){
            return -1;
        } else if(proyecto2.estado === "No iniciado"){
            return 1;
        } else if(proyecto1.estado === "Finalizado"){
            return -1;
        } else if(proyecto2.estado === "Finalizado"){
            return 1;
        } else if(proyecto1.estado === "Suspendido"){
            return -1;
        } else if(proyecto2.estado === "Suspendido"){
            return 1;
        } else if(proyecto1.estado === "Cancelado"){
            return -1;
        } else if(proyecto2.estado === "Cancelado"){
            return 1;
        }
    }

    handleAdd() {
        this.props.history.push({
            pathname: `/proyectos/:id`
        });    
    }

    handleEdit(oldData) {
        // Esta funcion en el caso de los proyectos 
        // se usa para redirigir a la información del
        // proyecto seleccionado
        console.log("Old data", oldData)
        this.props.history.push({
            pathname: `/proyectos/${oldData.id}`
        });
    }

    handleDelete(oldData) {
        this.props.history.push({
            pathname: `/proyectos/${oldData.id}/tareas`
        });
    }

    render() {
        
        return (
            <div className="proyectos-screen-div">
                <TablaAdministracion
                    title={ title }
                    columns={ columns }
                    data={ this.state.proyectos }
                    handleAdd={ this.handleAdd }
                    handleEdit={ this.handleEdit }
                    handleDelete={ this.handleDelete } 
                    editable = { null }
                    actions={[
                        {
                            icon: Add,
                            tooltip: "Agregar proyecto",
                            position: "toolbar",
                            onClick: () => {
                                this.handleAdd()
                            }
                        },
                        {
                            icon: editIcon,
                            tooltip: "Abrir",
                            onClick: (event, rowData) => {
                                this.handleEdit(rowData)  
                                console.log(rowData)
                            }
                        },
                        {
                            icon: Reorder,
                            tooltip: "Backlog",
                            onClick: (event, rowData) => {
                                this.handleDelete(rowData)  
                                console.log(rowData)
                            }
                        }
                    ]}
                >
                </TablaAdministracion>
            </div>
        )
    }
}

export default withRouter(ListadoProyectos);

const coloresEstado = [
    {
        estado: "No iniciado",
        color: '#000000'
    },
    {
        estado: "Activo",
        color: '#0033FF'
    },
    {
        estado: "Suspendido",
        color: '#808080'
    },
    {
        estado: "Cancelado",
        color: '#ff0000'
    },
    {
        estado: "Finalizado",
        color: '#00ff00'
    },
    {
        estado: "Default",
        color: '#000000'
    }
]

const title = "Proyectos";

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
                >{ rowData.estado }</p>
    },
    {
        title: "Tipo de proyecto", 
        field: "tipoDeProyecto",
        editable: "never"
    }
];

const editIcon = InfoOutlined;

