import React, { Component }  from 'react';
import axios from 'axios';
import {ButtonGroup, Table, Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import "../../../assets/css/ModuloProyectos/TablasProyectos.css";
import "../../../assets/css/controller/ProyectosScreen.css";
const URL = 'https://mapache-proyectos.herokuapp.com/';

export default class ListadoProyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proyectos : []
        };
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

    render() {
        return (
            <div className="proyectos-screen-div">
                <div className="tablaProyectos">
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Tipo de Proyecto</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.proyectos.length === 0 ?
                                <tr align="center">
                                    <td colSpan="4">No existe ningun proyecto</td>
                                </tr> :
                                this.state.proyectos.sort((a,b) => this.ordenarProyectos(a,b)).map((proyecto) => (
                                    <tr key={proyecto.id}>
                                        <td>{proyecto.id}</td>
                                        <td>{proyecto.nombre}</td>
                                        <td
                                            style={{color: this.definirColor(proyecto.estado)}}>
                                            {proyecto.estado}
                                        </td>
                                        <td>{proyecto.tipoDeProyecto}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={"/proyectos/"+proyecto.id}>
                                                    <Button size="sm" variant="outline-primary">
                                                        Abrir
                                                    </Button>
                                                </Link>
                                                <Link to={"/proyectos/"+proyecto.id+"/tareas"}>
                                                    <Button size="sm" variant="outline-primary">
                                                        Backlog
                                                    </Button>
                                                </Link>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                        <Card>
                            <Link to={"/proyectos/:id"}>
                                <Button>
                                    Crear Proyecto
                                </Button>
                            </Link>
                        </Card>
                    </TableContainer>
                </div>
            </div>
        );
    }
}
