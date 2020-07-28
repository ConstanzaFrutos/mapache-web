import React, { Component }  from 'react';
import axios from 'axios';
import {ButtonGroup, Table, Button, Card} from "react-bootstrap";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import { withRouter } from 'react-router';
import "../../../assets/css/ModuloProyectos/TablasProyectos.css";
import "../../../assets/css/controller/ProyectosScreen.css";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';


class Backlog extends Component {
    constructor(props) {
        super(props);
        this.state = {tareas:[]};
    }

    obtenerTareas(){
        const proyectoId = +this.props.match.params.id;
        axios.get(URL+proyectoId+'/tareas')
            .then(respuesta => respuesta.data)
            .then((data) => {
                this.setState({tareas : data})
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

    definirColor(estado){
        if(estado === "No iniciada"){
            //negro
            return '#000000';
        } else if(estado === "En curso"){
            //azul
            return '#0033FF';
        } else if(estado === "Bloqueada"){
            //rojo
            return '#ff0000';
        } else if(estado === "Finalizada"){
            //verde
            return '#00ff00';
        }
        //negro
        return '#000000';
    }

    ordenarTareas(tarea1, tarea2) {
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

    render() {
        const proyectoId = +this.props.match.params.id;
        return(
            <div className="proyectos-screen-div">
                <div className="tablaProyectos">
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Estado</th>
                                <th>Fecha de Finalizacion</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.tareas.length === 0 ?
                                <tr align="center">
                                    <td colSpan="4">Este proyecto no contiene tareas</td>
                                </tr> :
                                this.state.tareas.sort((a, b) => this.ordenarTareas(a,b)).map((tarea) => (
                                    <tr key={tarea.id}>
                                        <td>{tarea.id}</td>
                                        <td>{tarea.nombre}</td>
                                        <td
                                            style={{color: this.definirColor(tarea.estado)}}>
                                            {tarea.estado}
                                        </td>
                                        <td>{tarea.fechaDeFinalizacion ?
                                            tarea.fechaDeFinalizacion.split('T')[0] :
                                            "No contiene"}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={"/proyectos/"+proyectoId+"/tareas/"+tarea.id}>
                                                    <Button size="sm" variant="outline-primary">
                                                        Abrir
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
                            <Link to={"/proyectos/"+proyectoId+"/tareas/:id"}>
                                <Button>
                                    Crear Tarea
                                </Button>
                            </Link>
                        </Card>
                    </TableContainer>
                </div>
            </div>
        );
    }
}

export default withRouter(Backlog);