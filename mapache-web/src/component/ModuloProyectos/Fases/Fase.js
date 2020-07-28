import React, {Component} from "react";
import {Button, Card, Col, Form, Modal} from "react-bootstrap";
import { withRouter } from 'react-router';
import axios from 'axios';
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Fase extends Component {
    constructor(props) {
        super(props);
        this.state = props.fase;
    }

    cambioFase = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    actualizarFase = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        const aux = {
            nombre : this.state.nombre,
            fechaDeInicio: this.state.fechaDeInicio,
            descripcion: this.state.descripcion,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion
        };
        axios.put(URL+proyectoId+'/fases/'+this.state.id, aux)
            .then(respuesta=> {
                if(respuesta.data != null){
                    alert("La fase fue actualizada correctamente");
                    this.props.obtenerFases();
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

    eliminarFase = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        axios.delete(URL+proyectoId+'/fases/'+this.state.id)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("La fase fue eliminada correctamente");
                    this.props.obtenerFases();
                    this.setState({confirm : false});
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
        const {nombre, fechaDeInicio, fechaDeFinalizacion, descripcion} = this.state;
        return(
            <Form id="formularioFaseEditar" onSubmit={this.actualizarFase}>
                <Card.Header>
                    <Form.Group as={Col}>
                        <Form.Label>Nombre </Form.Label>
                        <Form.Control
                            autoComplete="off"
                            type="text" name="nombre"
                            value={nombre}
                            onChange={this.cambioFase}
                        />
                    </Form.Group>
                </Card.Header>
                <Card.Body>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Fecha de Inicio</Form.Label>
                            <Form.Control
                                autoComplete="off"
                                type="date" name="fechaDeInicio"
                                value={fechaDeInicio ? fechaDeInicio.split('T')[0] : '0000-00-00'}
                                onChange={this.cambioFase}
                            />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Fecha de Finalizacion</Form.Label>
                            <Form.Control
                                autoComplete="off"
                                type="date" name="fechaDeFinalizacion"
                                value={fechaDeFinalizacion ? fechaDeFinalizacion.split('T')[0] : '0000-00-00'}
                                onChange={this.cambioFase}
                            />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Descripcion (Max 100 caracteres)</Form.Label>
                        <Form.Control
                            autoComplete="off"
                            type="text" name="descripcion"
                            value={descripcion}
                            onChange={this.cambioFase}
                            as="textarea" rows="2"
                            maxLength = {100}
                        />
                    </Form.Group>
                </Card.Body>
                <Card.Footer>
                    <Button variant="success" type="submit">
                        Actualizar
                    </Button>
                    <Button onClick={this.abrirConfirm}>
                        Delete
                    </Button>
                    <Modal show={this.state.confirm} onHide={this.cerrarConfirm}>
                        <Modal.Header closeButton>
                            <Modal.Title>Eliminar Fase</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Desea eliminar la fase : {this.state.nombre} ? Una vez eliminada no se puede volver atras</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.cerrarConfirm}>
                                Cancelar
                            </Button>
                            <Button variant="danger" onClick={this.eliminarFase.bind(this)}>
                                Eliminar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Footer>
            </Form>
        );
    }
}

export default withRouter(Fase);