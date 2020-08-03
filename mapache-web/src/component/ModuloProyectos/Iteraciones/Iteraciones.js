import React, { Component }  from 'react';
import axios from 'axios';
import {Card, Form, Col, Button, Table, ButtonGroup, Modal} from "react-bootstrap";
import {Link} from "react-router-dom";
import { withRouter } from 'react-router';
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import "../../../assets/css/ModuloProyectos/Iteraciones.css";
import {Dropdown} from "../../general/Dropdown";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Iteraciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iteraciones: [],
            iteracionActual: null,
            iteracionActualDropdown: '',
            tareas: [],
            tareasDropdown: [],
            tareaAgregar: ''
        }
    }

    componentDidMount() {
        this.obtenerIteraciones();
        this.obtenerTareasSinIteracion();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevState.iteracionActualDropdown !== this.state.iteracionActualDropdown){
            this.obtenerTareasSinIteracion();
        }
    }

    obtenerIteraciones() {
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

    obtenerTareasSinIteracion() {
        const proyectoId = +this.props.match.params.id;
        axios.get(URL+proyectoId+'/tareas_sin_iteracion')
            .then(respuesta => {
                let aux = respuesta.data.map((tarea) => {
                    return {
                        name: tarea.nombre,
                        value: tarea.id
                    }
                });
                this.setState({
                    tareasDropdown: aux
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

    obtenerIteracion(iterId) {
        if(!iterId || iterId <= 0){
            return;
        }
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
    }

    seleccionarIteracion = event => {
        event.preventDefault();
        const iterId = event.target.value;
        this.obtenerIteracion(iterId);
        this.setState({iteracionActualDropdown: event.target.value});
    }

    seleccionarTarea = event => {
        event.preventDefault();
        this.setState({tareaAgregar: event.target.value});
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

    finalizarIteracion = event => {
        if(!this.state.iteracionActual){
            return;
        }
        const aux = {};
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.put(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id+'/finalizar', aux)
            .then(respuesta=> {
                if(respuesta.data != null){
                    alert("La iteracion fue finalizada");
                    this.cerrarConfirm();
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

    eliminarIteracion = event => {
        event.preventDefault();
        if(!this.state.iteracionActual){
            return;
        }
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.delete(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("La iteracion fue eliminada correctamente");
                    this.obtenerIteraciones();
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

    agregarTarea = event => {
        event.preventDefault();
        if(!this.state.tareaAgregar){
            return;
        }
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.put(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id+'/tareas?id_tarea='+this.state.tareaAgregar)
            .then(respuesta=> {
                if(respuesta.data != null){
                    alert("La Tarea fue agregada correctamente");
                    this.obtenerTareas();
                    this.obtenerTareasSinIteracion();
                    this.obtenerIteracion(this.state.iteracionActual.id);
                    this.setState({tareaAgregar: ''});
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

    eliminarTarea = (tareaId) => {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.delete(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.state.iteracionActual.id+'/tareas/'+tareaId)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("La tarea fue eliminada de la iteracion correctamente");
                    this.obtenerTareas();
                    this.obtenerTareasSinIteracion();
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

    crearIteracion() {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        const iteracion = {};
        axios.post(URL+proyectoId+'/fases/'+faseId+'/iteraciones', iteracion)
            .then(respuesta => {
                if(respuesta.data){
                    this.setState({nuevaFase: this.estadoInicial});
                    alert("La iteracion se creo exitosamente");
                    this.obtenerIteraciones();
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

    abrirConfirm = event => {
        event.preventDefault();
        this.setState({confirm : true})
    }

    cerrarConfirm = () => {
        this.setState({confirm : false});
    }

    render() {
        const proyectoId = +this.props.match.params.id;
        const {iteraciones, iteracionActual, iteracionActualDropdown, tareasDropdown, tareaAgregar} = this.state;
        return (
            <div className="tablaIteraciones">
                <Card className="tablaCrearIteracion">
                    <Dropdown
                        renderDropdown={ true }
                        label="Iteraciones"
                        value={ iteracionActualDropdown }
                        values={ iteraciones }
                        handleChange={ this.seleccionarIteracion }
                    >
                    </Dropdown>
                    <ButtonGroup>
                        <Button variant="outline-primary" onClick={this.crearIteracion.bind(this)}>
                            Nueva Iteracion
                        </Button>
                        <Button variant="outline-danger" onClick={this.eliminarIteracion.bind(this)}>
                            Eliminar Iteracion
                        </Button>
                    </ButtonGroup>
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
                                <ButtonGroup>
                                    <Button variant="outline-success" size="sm" type="submit">
                                        Actualizar
                                    </Button>
                                    {this.state.iteracionActual.estado === "Activa" ?
                                        <Button variant="success" onClick={this.abrirConfirm.bind(this)}>
                                            Finalizar iteracion
                                        </Button> : null
                                    }
                                    <Modal show={this.state.confirm} onHide={this.cerrarConfirm}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Eliminar Tarea</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Desea finalizar la iteracion actual? En caso de hacerlo no se puede volver atras.</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={this.cerrarConfirm}>
                                                Cancelar
                                            </Button>
                                            <Button variant="success" onClick={this.finalizarIteracion.bind(this)}>
                                                Finalizar
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </ButtonGroup>
                            </Card.Body>
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
                                                        <Button size="sm" variant="danger" onClick={this.eliminarTarea.bind(this, tarea.id)}>
                                                            Eliminar
                                                        </Button>
                                                    </ButtonGroup>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
                            <Dropdown
                                renderDropdown={ true }
                                label="Agregar Tarea"
                                value={ tareaAgregar }
                                values={ tareasDropdown }
                                handleChange={ this.seleccionarTarea }
                            >
                            </Dropdown>
                            <ButtonGroup>
                                <Button size={"sm"} onClick={this.agregarTarea.bind(this)}>
                                    Agregar
                                </Button>
                                <Link to={"/proyectos/"+proyectoId+'/tareas/:id'}>
                                    <Button size="sm" variant="outline-primary">
                                        Crear tarea
                                    </Button>
                                </Link>
                            </ButtonGroup>
                        </Form> : null}
                </Card>
            </div>
        );
    }
}

export default withRouter(Iteraciones);