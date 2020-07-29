import React, { Component }  from 'react';
import axios from 'axios';
import {Card, Form, Col, Button, Table, ButtonGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import { withRouter } from 'react-router';
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import {Dropdown} from "../../general/Dropdown";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Iteraciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iteraciones: [],
            iteracionActual: null,
            iteracionActualDropdown: '',
            tareas: []
        }
    }

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.get(URL+proyectoId+'/fases/'+faseId+'/iteraciones')
            .then(respuesta => {
                let aux = respuesta.data.map((iteracion) => {
                    return {
                        name: iteracion.nombre,
                        value: iteracion.id
                    }
                });
                this.setState({
                    iteraciones: aux,
                    iteracionActualDropdown: aux[0]
                });
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

    obtenerTareas() {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        const url = URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id+'/tareas';
        axios.get(url)
            .then(respuesta => {
                if(respuesta.data != null){
                    this.setState({
                        tareas: respuesta.data
                    });
                }
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

    seleccionarIteracion = event => {
        event.preventDefault();
        const iterId = event.target.value;
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.get(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+iterId)
            .then(respuesta => {
                if(respuesta.data != null){
                    this.setState({
                        iteracionActual: respuesta.data
                    });
                    this.obtenerTareas();
                }
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
        this.setState({iteracionActualDropdown: event.target.value});
    }

    cambioIteracion = event => {
        let aux = {...this.state.iteracionActual}
        if(event.target.name === 'fechaDeInicio'){
            aux.fechaDeInicio = event.target.value;
        } else {
            aux.fechaDeFinalizacion = event.target.value;
        }
        this.setState({
            iteracionActual: aux
        });
    }

    actualizarIteracion = event => {
        event.preventDefault();
        const aux = {
            nombre : this.state.iteracionActual.nombre,
            fechaDeInicio: this.state.iteracionActual.fechaDeInicio,
            fechaDeFinalizacion: this.state.iteracionActual.fechaDeFinalizacion,
            estado: this.state.iteracionActual.estado,
            idsTareas: this.state.iteracionActual.idsTareas
        };
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.put(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id, aux)
            .then(respuesta=> {
                if(respuesta.data != null){
                    alert("La iteracion fue actualizada correctamente");
                }
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

    /*Crear iteracion y asignar tarea a una iteracion, eliminar tarea de la iteracion*/

    render() {
        const proyectoId = +this.props.match.params.id;
        const {iteraciones, iteracionActual, iteracionActualDropdown} = this.state;
        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Dropdown
                        renderDropdown={ true }
                        label="Iteraciones"
                        value={ iteracionActualDropdown }
                        values={ iteraciones }
                        handleChange={ this.seleccionarIteracion }
                    >
                    </Dropdown>
                    {this.state.iteracionActual ?
                        <Form id="formularioFaseEditar" onSubmit={this.actualizarIteracion}>
                            <Card.Body>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Fecha de Inicio</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="date" name="fechaDeInicio"
                                            value={iteracionActual.fechaDeInicio ? iteracionActual.fechaDeInicio.split('T')[0] : '0000-00-00'}
                                            onChange={this.cambioIteracion}
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col}>
                                        <Form.Label>Fecha de Finalizacion</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="date" name="fechaDeFinalizacion"
                                            value={iteracionActual.fechaDeFinalizacion ? iteracionActual.fechaDeFinalizacion.split('T')[0] : '0000-00-00'}
                                            onChange={this.cambioIteracion}
                                        />
                                    </Form.Group>
                                </Form.Row>
                            </Card.Body>
                            <Button variant="success" type="submit">
                                Actualizar
                            </Button>
                            <Table>
                                <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Nombre</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.state.tareas.length === 0 ?
                                        <tr align="center">
                                            <td>La iteracion no contiene tareas</td>
                                        </tr> :
                                        this.state.tareas.map((tarea) => (
                                            <tr key={tarea.id}>
                                                <td>{tarea.id}</td>
                                                <td>{tarea.nombre}</td>
                                                <td
                                                    style={{color: this.definirColor(tarea.estado)}}>
                                                    {tarea.estado}
                                                </td>
                                                <td>
                                                    <ButtonGroup>
                                                        <Link to={"/proyectos/"+proyectoId+'/tareas/'+tarea.id}>
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
                        </Form> : null
                    }
                </Card>
            </div>
        );
    }
}

export default withRouter(Iteraciones);