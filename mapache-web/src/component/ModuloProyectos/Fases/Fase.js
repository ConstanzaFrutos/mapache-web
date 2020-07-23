import React, {Component} from "react";
import {Button, Card, Col, Form} from "react-bootstrap";
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
        if(aux.fechaDeInicio < '0000-00-00'){
            aux.fechaDeInicio = '0000-00-00';
        }
        if(aux.fechaDeFinalizacion < '0000-00-00'){
            aux.fechaDeFinalizacion = '0000-00-00';
        }
        (async() => {
            try {
                axios.put(URL+proyectoId+'/fases/'+this.state.id, aux)
                    .then(respuesta=> {
                        if(respuesta.data != null){
                            alert("La fase fue actualizada correctamente");
                            this.props.obtenerFases();
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

    eliminarFase = event => {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                axios.delete(URL+proyectoId+'/fases/'+this.state.id)
                    .then(respuesta => {
                        if(respuesta.data != null){
                            alert("La fase fue eliminada correctamente");
                            this.props.obtenerFases();
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
                        <Form.Label>Descripcion</Form.Label>
                        <Form.Control
                            autoComplete="off"
                            type="text" name="descripcion"
                            value={descripcion}
                            onChange={this.cambioFase}
                        />
                    </Form.Group>
                </Card.Body>
                <Card.Footer>
                    <Button variant="success" type="submit">
                        Actualizar
                    </Button>
                    <Button onClick={this.eliminarFase.bind(this)}>
                        Delete
                    </Button>
                </Card.Footer>
            </Form>
        );
    }
}

export default withRouter(Fase);