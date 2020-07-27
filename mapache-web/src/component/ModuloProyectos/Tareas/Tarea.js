import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button,ButtonGroup, Card, Col, Form, Modal} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Tarea extends Component {
    constructor(props) {
        super(props);
        this.state = this.estadoInicial;
    }

    estadoInicial = {id:'', nombre:'', descripcion: '', fechaDeInicio: '',
        fechaDeFinalizacion: '', estado: 'No iniciado', redirect: false};

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        const tareaId = +this.props.match.params.id_tarea;
        if(!proyectoId || !tareaId){
            return;
        }
        (async() => {
            try {
                axios.get(URL+proyectoId+"/tareas/"+tareaId)
                    .then(respuesta => {
                        if(respuesta.data != null){
                            this.setState({
                                id: respuesta.data.id,
                                nombre: respuesta.data.nombre,
                                descripcion: respuesta.data.descripcion,
                                fechaDeInicio: respuesta.data.fechaDeInicio,
                                fechaDeFinalizacion: respuesta.data.fechaDeFinalizacion,
                                estado: respuesta.data.estado
                            });
                        }
                    })
            } catch (err) {
                let mensaje = "Error: " + err.response.status;
                if(err.response.message){
                    mensaje += ': ' + err.response.message;
                }
                alert(mensaje);
            }
        })();
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
            estado: this.state.estado
        };
        if(!tarea.fechaDeInicio || tarea.fechaDeInicio < '0000-00-00'){
            tarea.fechaDeInicio = '0000-00-00';
        }
        if(!tarea.fechaDeFinalizacion || tarea.fechaDeFinalizacion < '0000-00-00'){
            tarea.fechaDeFinalizacion = '0000-00-00';
        }
        (async() => {
            try {
                await axios.post(URL+proyectoId+"/tareas", tarea)
                    .then(respuesta => {
                        if(respuesta.data){
                            this.setState(this.estadoInicial);
                            alert("La tarea se creo exitosamente");
                            this.setState({redirect: true});
                        }
                    })
            } catch (err) {
                let mensaje = "Error: " + err.status;
                if(err.error){
                    mensaje += ': ' + err.response.error;
                }
                alert(mensaje);
            }
        })();
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
            estado: this.state.estado
        };
        if(!tarea.fechaDeInicio || tarea.fechaDeInicio < '0000-00-00'){
            tarea.fechaDeInicio = '0000-00-00';
        }
        if(!tarea.fechaDeFinalizacion || tarea.fechaDeFinalizacion < '0000-00-00'){
            tarea.fechaDeFinalizacion = '0000-00-00';
        }
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                axios.put(URL+proyectoId+"/tareas/"+tarea.id, tarea)
                    .then(respuesta=> {
                        if(respuesta.data != null){
                            alert("La tarea: " + tarea.nombre+ " se actualizo exitosamente");
                            this.setState({redirect : true});
                        }
                    })
            } catch (err) {
                let mensaje = "Error: " + err.response.status;
                if(err.response.message){
                    mensaje += ': ' + err.response.message;
                }
                alert(mensaje);
            }
        })();
    };

    eliminarTarea = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                axios.delete(URL+proyectoId+'/tareas/'+this.state.id)
                    .then(respuesta => {
                        if(respuesta.data != null){
                            alert("La tarea fue eliminada correctamente");
                            this.setState({confirm : false, redirect:true});
                        }
                    });
            } catch (err) {
                let mensaje = "Error: " + err.response.status;
                if(err.response.message){
                    mensaje += ': ' + err.response.message;
                }
                alert(mensaje);
            }
        })();
    }

    abrirConfirm = event => {
        event.preventDefault();
        this.setState({confirm : true})
    }

    cerrarConfirm = () => {
        this.setState({confirm : false});
    }

    render() {
        const proyectoId = +this.props.match.params.id;
        const {nombre, descripcion, fechaDeInicio, fechaDeFinalizacion, estado} = this.state;
        if (this.state.redirect) {
            return <Redirect to={"/proyectos/" +proyectoId+"/tareas"} />
        }
        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Form id="formularioProyecto" onSubmit={this.state.id ? this.actualizarTarea : this.crearTarea}>
                        <Card.Header>{this.state.id ? "Editar Tarea": "Crear Tarea"}</Card.Header>
                        <Card.Body>
                            <Form.Group as={Col}>
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    required autoComplete="off"
                                    type="text" name="nombre"
                                    value={nombre}
                                    onChange={this.cambioTarea}
                                />
                            </Form.Group>
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
                        </Card.Body>
                        <Card.Footer>
                            <ButtonGroup>
                                <Button variant="success" type="submit">
                                    {this.state.id ? "Actualizar" : "Crear Tarea"}
                                </Button>
                                {this.state.id ?
                                    <Button size="sm" variant="outline-danger" onClick={this.abrirConfirm}>
                                        Delete
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