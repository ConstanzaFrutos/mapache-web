import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button, Card, Col, Form, Table} from "react-bootstrap";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import axios from 'axios';
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Fases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fases : [],
            nuevaFase : this.estadoInicial
        };
        this.cambioFase = this.cambioFase.bind(this);
    }

    estadoInicial = {nombre: '',fechaDeInicio: '0000-00-00'};

    obtenerFases(){
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                axios.get(URL+proyectoId+'/fases')
                    .then(respuesta => respuesta.data)
                    .then((data) => {
                        this.setState({fases : data})
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

    actualizarFase(event, fase) {
        event.preventDefault();
        const proyectoId = +this.props.match.params.id;
        const aux = {
            id : fase.id,
            nombre : fase.nombre,
            fechaDeInicio: fase.fechaDeInicio
        };
        (async() => {
            try {
                axios.put(URL+proyectoId+'/fases/'+fase.id, aux)
                    .then(respuesta=> {
                        if(respuesta.data != null){
                            alert("La fase fue actualizada correctamente");
                            this.obtenerFases();
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

    componentDidMount() {
        this.obtenerFases()
    }

    cambioFase = event => {
        let copia = Object.assign({}, this.state.nuevaFase);
        if(event.target.name === "nombre"){
            copia.nombre = event.target.value;
        }
        if(event.target.name === "fechaDeInicio"){
            copia.fechaDeInicio = event.target.value;
        }
        this.setState({
            nuevaFase : copia
        });
    }

    crearFase = event => {
        event.preventDefault();
        const fase = {
            nombre: this.state.nuevaFase.nombre,
            fechaDeInicio : this.state.nuevaFase.fechaDeInicio
        };
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                await axios.post(URL+proyectoId+'/fases', fase)
                    .then(respuesta => {
                        if(respuesta.data){
                            this.setState({nuevaFase: this.estadoInicial});
                            alert("La fase se creo exitosamente");
                            this.obtenerFases();
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

    eliminarFase = (faseId) => {
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                axios.delete(URL+proyectoId+'/fases/'+faseId)
                    .then(respuesta => {
                        if(respuesta.data != null){
                            alert("La fase fue eliminada correctamente");
                            this.obtenerFases();
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

    cambioFaseCreada(event, id) {
        var pos = -1;
        for(var i = 0; i < this.state.fases.length; ++i) {
            if(this.state.fases[i].id === id) {
                pos = i;
            }
        }
        if(pos === -1){return;}
        var copia = this.state.fases.slice();
        if(event.target.name === "nombre"){
            copia[pos].nombre = event.target.value;
        }
        if(event.target.name === "fechaDeInicio"){
            copia[pos].fechaDeInicio = event.target.value;
        }
        this.setState({
            fases : copia
        });
    }

    render() {
        const {nombre, fechaDeInicio} = this.state.nuevaFase;
        return(
            <div className="proyectos-screen-div">
                <div className="tablaProyectos" style={{height:"80%"}}>
                    <TableContainer component={Paper}>
                        <Table  aria-label="simple table" >
                            {this.state.fases.length === 0 ?
                                <tr align="center">
                                    <td>El proyecto no contiene fases</td>
                                </tr> :
                                this.state.fases.map((fase) => (
                                        <Card>
                                            <Form id="formularioFaseEditar" onSubmit={(e) => {this.actualizarFase(e, fase)}}>
                                                <Card.Header>{fase.nombre}</Card.Header>
                                                <Card.Body>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>Fecha de Inicio</Form.Label>
                                                        <Form.Control
                                                            autoComplete="off"
                                                            type="date" name="fechaDeInicio"
                                                            value={fase.fechaDeInicio ? fase.fechaDeInicio.split('T')[0] : '0000-00-00'}
                                                            onChange={(e) => {this.cambioFaseCreada(e, fase.id)}}
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Button variant="success" type="submit">
                                                        Actualizar
                                                    </Button>
                                                    <Button onClick={this.eliminarFase.bind(this,fase.id)}>
                                                        Delete
                                                    </Button>
                                                </Card.Footer>
                                            </Form>
                                        </Card>
                                ))
                            }
                            <Card>
                                <Form id="formularioFaseCrear" onSubmit={this.crearFase}>
                                    <Card.Header>{"Nueva Fase"}</Card.Header>
                                    <Card.Body>
                                        <Form.Group as={Col}>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                type="text" name="nombre"
                                                value = {nombre}
                                                onChange={this.cambioFase}
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Fecha de Inicio</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                type="date" name="fechaDeInicio"
                                                value = {fechaDeInicio}
                                                onChange={this.cambioFase}
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button variant="success" type="submit">Crear Fase</Button>
                                    </Card.Footer>
                                </Form>
                            </Card>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    }
}

export default withRouter(Fases);