import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button,ButtonGroup, Card, Col, Form, Modal, ListGroup} from "react-bootstrap";
import axios from "axios";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import {Dropdown} from "../../general/Dropdown";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Tarea extends Component {
    constructor(props) {
        super(props);
        this.state = this.estadoInicial;
    }

    estadoInicial = {id:'', nombre:'', descripcion: '', fechaDeInicio: '',
        fechaDeFinalizacion: '', estado: 'No iniciado', responsable: -1, recursos: [], duracionEstimada: 0, idsTickets: []};

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        const tareaId = +this.props.match.params.id_tarea;
        if(proyectoId && tareaId){
            this.obtenerTarea();
        }
        this.obtenerRecursos();
    }

    obtenerTarea() {
        const proyectoId = +this.props.match.params.id;
        const tareaId = +this.props.match.params.id_tarea;
        axios.get(URL+proyectoId+"/tareas/"+tareaId)
            .then(respuesta => {
                if(respuesta.data != null){
                    this.setState({
                        id: respuesta.data.id,
                        nombre: respuesta.data.nombre,
                        descripcion: respuesta.data.descripcion,
                        fechaDeInicio: respuesta.data.fechaDeInicio,
                        fechaDeFinalizacion: respuesta.data.fechaDeFinalizacion,
                        estado: respuesta.data.estado,
                        responsable: respuesta.data.responsable,
                        duracionEstimada: respuesta.data.duracionEstimada,
                        idsTickets: respuesta.data.idsTickets
                    });
                }
            }).catch(function(err){
            if(err.response){
                let mensaje = "Error: " + err.response.data.status;
                if(err.response.data.error){
                    mensaje += ': ' + err.response.data.error;
                }
                alert(mensaje);
            } else {
                alert("Ocurrio un error desconocido");
            }
        });
    }

    obtenerRecursos(){
        axios.get("https://mapache-recursos.herokuapp.com/empleados/")
            .then(respuesta => {
                if(respuesta.data != null){
                    let recursosDropdown = respuesta.data.map((recurso) => {
                        return {
                            name: recurso.apellido + ', ' + recurso.nombre,
                            value: recurso.legajo
                        }
                    });
                    recursosDropdown.push({name: "Sin responsable", value: -1});
                    this.setState({
                        recursos: [...recursosDropdown, "Sin responsable"]
                    });
                }
            }).catch(function(err){
            if(err.response){
                let mensaje = "Error: " + err.response.data.status;
                if(err.response.data.error){
                    mensaje += ': ' + err.response.data.error;
                }
                alert(mensaje);
            } else {
                alert("Ocurrio un error desconocido");
            }
        });
    }

    seleccionarRecurso = event => {
        event.preventDefault();
        this.setState({responsable: event.target.value});
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

    crearTarea = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        const tarea = {
            nombre: this.state.nombre,
            descripcion: this.state.descripcion,
            fechaDeInicio: this.state.fechaDeInicio,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion,
            estado: this.state.estado,
            responsable: this.state.responsable,
            duracionEstimada: this.state.duracionEstimada
        };
        axios.post(URL+proyectoId+"/tareas", tarea)
            .then(respuesta => {
                if(respuesta.data){
                    alert("La tarea se creo exitosamente");
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

    cambioTarea = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    actualizarTarea = event => {
        event.preventDefault();
        const tarea = {
            id: this.state.id,
            nombre: this.state.nombre,
            descripcion: this.state.descripcion,
            fechaDeInicio: this.state.fechaDeInicio,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion,
            estado: this.state.estado,
            responsable: this.state.responsable,
            duracionEstimada: this.state.duracionEstimada,
            idsTickets: this.state.idsTickets
        };
        const proyectoId = +this.props.match.params.id;
        axios.put(URL+proyectoId+"/tareas/"+tarea.id, tarea)
            .then(respuesta=> {
                if(respuesta.data != null){
                    alert("La tarea: " + tarea.nombre+ " se actualizo exitosamente");
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

    eliminarTarea = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        axios.delete(URL+proyectoId+'/tareas/'+this.state.id)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("La tarea fue eliminada correctamente");
                    this.setState({confirm : false});
                    this.props.history.goBack();
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

    abrirConfirm = event => {
        event.preventDefault();
        this.setState({confirm : true})
    }

    cerrarConfirm = () => {
        this.setState({confirm : false});
    }

    render() {
        const {nombre, descripcion, fechaDeInicio, fechaDeFinalizacion, estado, duracionEstimada, idsTickets} = this.state;

        let responsable = this.state.responsable;

        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Form id="formularioProyecto" onSubmit={this.state.id ? this.actualizarTarea : this.crearTarea}>
                        <Card.Header>{this.state.id ? "Editar Tarea": "Crear Tarea"}</Card.Header>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required autoComplete="off"
                                        type="text" name="nombre"
                                        value={nombre}
                                        onChange={this.cambioTarea}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Duracion Estimada</Form.Label>
                                    <Form.Control
                                        autoComplete="off"
                                        min = "0"
                                        type="number" name="duracionEstimada"
                                        value={duracionEstimada}
                                        onChange={this.cambioTarea}
                                    />
                                </Form.Group>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label>Descripcion (Max 250 caracteres)</Form.Label>
                                <Form.Control
                                    autoComplete="off"
                                    type="text" name="descripcion"
                                    value={descripcion}
                                    onChange={this.cambioTarea}
                                    as="textarea" rows="5"
                                    maxLength = {250}
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Fecha de Inicio</Form.Label>
                                    <Form.Control
                                        autoComplete="off"
                                        type="date" name="fechaDeInicio"
                                        value={fechaDeInicio ? fechaDeInicio.split('T')[0] : '0000-00-00'}
                                        onChange={this.cambioTarea}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Fecha de Finalizacion</Form.Label>
                                    <Form.Control
                                        autoComplete="off"
                                        type="date" name="fechaDeFinalizacion"
                                        value={fechaDeFinalizacion ? fechaDeFinalizacion.split('T')[0] : '0000-00-00'}
                                        onChange={this.cambioTarea}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" custom
                                                  value={estado}
                                                  onChange={this.cambioTarea}
                                                  required autoComplete="off"
                                                  type="text" name="estado"
                                                  style={{color: this.definirColor(estado)}}>
                                        <option value="No iniciada">No Iniciada</option>
                                        <option  value="En curso">En curso</option>
                                        <option value="Bloqueada">Bloqueada</option>
                                        <option value="Finalizada">Finalizada</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Dropdown
                                renderDropdown={ true }
                                label="Responsable"
                                value={ responsable }
                                values={ this.state.recursos }
                                handleChange={ this.seleccionarRecurso }
                            >
                            </Dropdown>
                            {idsTickets.length > 0 ?
                                <div>
                                    Tickets asociados
                                    <ListGroup horizontal>
                                        {this.state.idsTickets.map((id) => (
                                            <ListGroup.Item> {id} </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </div>
                                : null}
                        </Card.Body>
                        <Card.Footer>
                            <ButtonGroup>
                                <Button variant="outline-success" type="submit" onClick={this.props.history.goBack}>
                                    {this.state.id ? "Actualizar" : "Crear Tarea"}
                                </Button>
                                {this.state.id ?
                                    <Button size="sm" variant="danger" onClick={this.abrirConfirm}>
                                        Eliminar
                                    </Button> : null
                                }
                                <Modal show={this.state.confirm} onHide={this.cerrarConfirm}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Eliminar Tarea</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Desea eliminar la tarea: {this.state.nombre} ? Una vez eliminada no se puede volver atras</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.cerrarConfirm}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={this.eliminarTarea.bind(this)}>
                                            Eliminar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </ButtonGroup>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default withRouter(Tarea);