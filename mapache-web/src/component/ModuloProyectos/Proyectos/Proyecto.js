import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button,ButtonGroup, Card, Col, Form, Modal} from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import { Alerta } from "../../general/Alerta";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import {Dropdown} from "../../general/Dropdown";
const URL = 'https://mapache-proyectos.herokuapp.com/';

class Proyecto extends Component {
    constructor(props) {
        super(props);
        this.state = this.estadoInicial;
        
        this.crearProyecto = this.crearProyecto.bind(this);
        this.cambioProyecto = this.cambioProyecto.bind(this);

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
    }

    estadoInicial = {
        id:'', nombre:'', tipo:"Implementación", descripcion: '', fechaDeInicio: '',
        fechaDeFinalizacion: '', estado: 'No iniciado', redirectListado: false, redirectFases: false, fases : [],
        mostrarAlerta: false, tipoAlerta: "", mensajeAlerta: "", recursos: [], liderDeProyecto: -1
    };

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
        if(!proyecto.fechaDeFinalizacion || proyecto.fechaDeFinalizacion < '0000-00-00'){
            proyecto.fechaDeFinalizacion = '0000-00-00';
        }
        if(!proyecto.fechaDeInicio || proyecto.fechaDeInicio < '0000-00-00'){
            proyecto.fechaDeInicio = '0000-00-00';
        }
        axios.post(URL+"proyectos", proyecto)
            .then(respuesta => {
                if(respuesta.data){
                    this.setState(this.estadoInicial);
                    this.mostrarAlerta(
                        "El proyecto se creo exitosamente",
                        "success"
                    )
                    this.setState({redirectListado: true});
                }
            }).catch(function(err){
                if(err.response){
                    let mensaje = "Error: " + err.response.data.status;
                    if(err.response.data.error){
                        mensaje += '\n' + err.response.data.error;
                    }
                    this.mostrarAlerta(
                        mensaje,
                        "error"
                    )
                } else {
                    this.mostrarAlerta(
                        "Ocurrio un error desconocido",
                        "error"
                    )
                }
            });
    }

    cambioProyecto = event => {
        this.setState({
            [event.target.name]:event.target.value
        });
    }

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        if(!proyectoId){
            return;
        }
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
                            estado: respuesta.data.estado,
                            fases: respuesta.data.fases
                        });
                        this.obtenerRecursos();
                    }
                }).catch((error) => {
                    console.error("Error - "+error);
            }).catch(function(err){
            if(err.response){
                let mensaje = "Error: " + err.response.data.status;
                if(err.response.data.error){
                    mensaje += '\n' + err.response.data.error;
                }
                this.mostrarAlerta(
                    mensaje,
                    "error"
                )
            } else {
                this.mostrarAlerta(
                    "Ocurrio un error desconocido",
                    "error"
                )
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

    actualizarProyecto = (event, listado) => {
        event.preventDefault();
        alert(this.state.liderDeProyecto);
        const proyecto = {
            id: this.state.id,
            nombre: this.state.nombre,
            tipoDeProyecto: this.state.tipo,
            descripcion: this.state.descripcion,
            fechaDeInicio: this.state.fechaDeInicio,
            fechaDeFinalizacion: this.state.fechaDeFinalizacion,
            estado: this.state.estado
        };
        axios.patch(URL+"proyectos/"+proyecto.id, proyecto)
            .then(respuesta=> {
                if(respuesta.data != null){
                    if(listado){
                        alert("El proyecto: " + proyecto.nombre+ " se actualizo exitosamente");
                        this.setState({redirectListado : true});
                    } else {
                        this.setState({redirectFases : true});
                    }
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
    };

    seleccionarLider = event => {
        event.preventDefault();
        this.setState({liderDeProyecto: event.target.value});
    }

    eliminarProyecto = event => {
        event.preventDefault();
        axios.delete(URL+'proyectos/'+this.state.id)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("El proyecto fue eliminado correctamente");
                    this.setState({redirectListado: true});
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

    redireccionarListadoActualizar = event => {
        event.preventDefault();
        this.actualizarProyecto(event, true);
    }

    redireccionarFase = event => {
        event.preventDefault();
        this.actualizarProyecto(event, false);
    }

    abrirConfirm = event => {
        event.preventDefault();
        this.setState({confirm : true})
    }

    cerrarConfirm = () => {
        this.setState({confirm : false});
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

    mostrarAlerta(mensaje, tipo) {
        this.setState({
            mostrarAlerta: true,
            tipoAlerta: tipo,
            mensajeAlerta: mensaje
        });
    }

    handleCloseAlerta() {
        this.setState({
            mostrarAlerta: false
        });
    }

    render() {
        if (this.state.redirectListado) {
            return <Redirect to="/proyectos" />
        } else if(this.state.redirectFases){
            return <Redirect to={"/proyectos/" + this.state.id + "/fases"}/>
        }
        const {nombre, tipo, descripcion, fechaDeInicio, fechaDeFinalizacion, estado, recursos, liderDeProyecto} = this.state;

        let alerta = null;
        if (this.state.mostrarAlerta) {
            alerta = <Alerta
                        open={ true }
                        mensaje={ this.state.mensajeAlerta }
                        tipo={ this.state.tipoAlerta }
                        handleClose={ this.handleCloseAlerta }
                     >
                     </Alerta>
        }

        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Form id="formularioProyecto" onSubmit={this.state.id ? this.redireccionarListadoActualizar : this.crearProyecto}>
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
                                <Form.Label>Descripcion (Max 250 caracteres)</Form.Label>
                                <Form.Control
                                    autoComplete="off"
                                    type="text" name="descripcion"
                                    value={descripcion}
                                    onChange={this.cambioProyecto}
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
                                        <option value="No iniciado">No Iniciado</option>
                                        <option  value="Activo">Activo</option>
                                        <option value="Suspendido">Suspendido</option>
                                        <option value="Cancelado">Cancelado</option>
                                        <option value="Finalizado">Finalizado</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form.Row>
                            <Dropdown
                                renderDropdown={ true }
                                label="Lider de proyecto"
                                value={ liderDeProyecto }
                                values={ recursos }
                                handleChange={ this.seleccionarLider }
                            >
                            </Dropdown>
                        </Card.Body>
                        <Card.Footer>
                            <ButtonGroup>
                                <Button variant="outline-success" type="submit">
                                    {this.state.id ? "Actualizar" : "Crear Proyecto"}
                                </Button>
                                {this.state.id && this.state.estado !== "No iniciado" ?
                                    <Button variant="outline-primary" onClick={this.redireccionarFase.bind(this)}>
                                        Fases
                                    </Button> : null
                                }
                                {this.state.id && this.state.estado === 'No iniciado' ?
                                    <Button size="sm" variant="danger" onClick={this.abrirConfirm}>
                                        Eliminar
                                    </Button> : null
                                }
                                <Modal show={this.state.confirm} onHide={this.cerrarConfirm}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Eliminar Proyecto</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>Desea eliminar el proyecto: {this.state.nombre} ? Una vez eliminado no se puede volver atras</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={this.cerrarConfirm}>
                                            Cancelar
                                        </Button>
                                        <Button variant="danger" onClick={this.eliminarProyecto.bind(this)}>
                                            Eliminar
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            </ButtonGroup>
                        </Card.Footer>
                    </Form>
                </Card>
                { alerta }
            </div>
        );
    }
}

export default withRouter(Proyecto);