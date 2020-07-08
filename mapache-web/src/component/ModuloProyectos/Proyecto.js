import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button, Card, Col, Form} from "react-bootstrap";
import axios from "axios";
import "../../assets/css/controller/ProyectosScreen.css";
import "../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
const URL = 'https://mapache-proyectos.herokuapp.com/';

class Proyecto extends Component {
    constructor(props) {
        super(props);
        this.state = this.estadoInicial;
        this.crearProyecto = this.crearProyecto.bind(this);
        this.cambioProyecto = this.cambioProyecto.bind(this);
    }

    estadoInicial = {id:'', nombre:'', tipo:"Implementación", descripcion: '', fechaDeInicio: '',
        fechaDeFinalizacion: '', estado: 'No iniciado'};

    crearProyecto = event => {
        event.preventDefault();
        const proyecto = {
            nombre: this.state.nombre,
            tipoDeProyecto: this.state.tipo,
            descripcion: this.state.descripcion,
            fechaDeInicio: this.state.fechaDeInicio,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion,
            estado: this.state.estado
        };
        axios.post(URL+"proyectos", proyecto)
            .then(respuesta=> {
                if(respuesta.data != null){
                    this.setState(this.estadoInicial);
                    alert("El proyecto se creo exitosamente");
                } else {
                    alert("El proyecto no pudo ser creado");
                }
            })
    }

    cambioProyecto = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        if(proyectoId){
            axios.get(URL+"proyectos/"+proyectoId)
                .then(respuesta => {
                    if(respuesta.data != null){
                        this.setState({
                            id: respuesta.data.id,
                            nombre: respuesta.data.nombre,
                            tipo: respuesta.data.tipoDeProyecto,
                            descripcion: respuesta.data.descripcion,
                            fechaDeInicio: respuesta.data.fechaDeInicio,
                            fechaDeFinalizacion: respuesta.data.fechaDeFinalizacion,
                            estado: respuesta.data.estado
                        });
                    }
                }).catch((error) => {
                    console.error("Error - "+error);
            });
        }
    }

    actualizarProyecto = event => {
        event.preventDefault();
        const proyecto = {
            id: this.state.id,
            nombre: this.state.nombre,
            tipoDeProyecto: this.state.tipo,
            descripcion: this.state.descripcion,
            fechaDeInicio: this.state.fechaDeInicio,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion,
            estado: this.state.estado
        };
        axios.put(URL+"proyectos/"+proyecto.id, proyecto)
            .then(respuesta=> {
                if(respuesta.data != null){
                    this.setState(this.estadoInicial);
                    alert("El proyecto: " + proyecto.id+ " se actualizo exitosamente");
                } else {
                    alert("El proyecto no pudo ser actualizado");
                }
            })
    };

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

    render() {
        const {nombre, tipo, descripcion, fechaDeInicio, fechaDeFinalizacion, estado} = this.state;
        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Form id="formularioProyecto" onSubmit={this.state.id ? this.actualizarProyecto : this.crearProyecto}>
                        <Card.Header>{this.state.id ? "Editar Proyecto": "Crear Proyecto"}</Card.Header>
                        <Card.Body>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Nombre</Form.Label>
                                    <Form.Control
                                        required autoComplete="off"
                                        type="text" name="nombre"
                                        value={nombre}
                                        onChange={this.cambioProyecto}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Tipo de proyecto</Form.Label>
                                    <Form.Control as="select" custom
                                                  value={tipo}
                                                  onChange={this.cambioProyecto}
                                                  required autoComplete="off"
                                                  type="text" name="tipo"
                                    >
                                        <option value="Implementación">Implementación</option>
                                        <option value="Desarrollo">Desarrollo</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Form.Group>
                                <Form.Label>Descripcion</Form.Label>
                                <Form.Control
                                    autoComplete="off"
                                    type="text" name="descripcion"
                                    value={descripcion}
                                    onChange={this.cambioProyecto}
                                    as="textarea" rows="5"
                                />
                            </Form.Group>
                            <Form.Row>
                                <Form.Group as={Col}>
                                    <Form.Label>Fecha de Inicio</Form.Label>
                                    <Form.Control
                                        autoComplete="off"
                                        type="date" name="fechaDeInicio"
                                        value={fechaDeInicio ? fechaDeInicio.split('T')[0] : '0000-00-00'}
                                        onChange={this.cambioProyecto}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Fecha de Finalizacion</Form.Label>
                                    <Form.Control
                                        autoComplete="off"
                                        type="date" name="fechaDeFinalizacion"
                                        value={fechaDeFinalizacion ? fechaDeFinalizacion.split('T')[0] : '0000-00-00'}
                                        onChange={this.cambioProyecto}
                                    />
                                </Form.Group>
                                <Form.Group as={Col}>
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control as="select" custom
                                                  value={estado}
                                                  onChange={this.cambioProyecto}
                                                  required autoComplete="off"
                                                  type="text" name="estado"
                                                  style={{color: this.definirColor(estado)}}>
                                        >
                                        <option value="No iniciado">No Iniciado</option>
                                        <option  value="Activo">Activo</option>
                                        <option value="Suspendido">Suspendido</option>
                                        <option value="Cancelado">Cancelado</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="success" type="submit">
                                {this.state.id ? "Actualizar" : "Crear Proyecto"}
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </div>
        );
    }
}

export default withRouter(Proyecto);