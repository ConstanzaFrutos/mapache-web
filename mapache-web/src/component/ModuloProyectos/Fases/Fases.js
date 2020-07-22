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
    }

    estadoInicial = {nombre: '',fechaDeInicio: ''};

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

    componentDidMount() {
        this.obtenerFases()
    }

    cambioFase = event => {
        const aux = {[event.target.name]: event.target.value};
        this.setState({
            nuevaFase : aux
        });
    }

    crearFase = event => {
        event.preventDefault();
        const fase = {
            nombre: this.state.nuevaFase.nombre,
        };
        const proyectoId = +this.props.match.params.id;
        (async() => {
            try {
                await axios.post(URL+proyectoId+'/fases', fase)
                    .then(respuesta => {
                        if(respuesta.data){
                            this.setState({nuevaFase: this.estadoInicial});
                            alert("La fase se creo exitosamente");
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
        this.obtenerFases();
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
                                            <Form id="formularioFaseEditar">
                                                <Card.Header>{fase.nombre}</Card.Header>
                                                <Card.Body>
                                                    <Form.Group as={Col}>
                                                        <Form.Label>Fecha de Inicio</Form.Label>
                                                        <Form.Control
                                                            autoComplete="off"
                                                            type="date" name="fechaDeInicio"
                                                            value={fase.fechaDeInicio}
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                                <Card.Footer>
                                                    <Button>Actualizar</Button>
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