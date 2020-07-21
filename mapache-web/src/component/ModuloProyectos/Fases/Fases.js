import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button, Card, Col, Form, Table} from "react-bootstrap";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
//const URL = 'https://mapache-proyectos.herokuapp.com/';

class Fases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fases : []
        };
    }

    data = [{nombre: 'Fase de Desarollo',fechaDeInicio: '2020-09-09'}, {nombre: 'Fase de Testing',fechaDeInicio: '2020-09-19'}];

    obtenerFases(){
        this.setState({fases : this.data});
    }

    componentDidMount() {
        this.obtenerFases()
    }

    render() {
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
                                <Form id="formularioFaseCrear">
                                    <Card.Header>{"Nueva Fase"}</Card.Header>
                                    <Card.Body>
                                        <Form.Group as={Col}>
                                            <Form.Label>Nombre</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                type="text" name="nombre"
                                            />
                                        </Form.Group>
                                        <Form.Group as={Col}>
                                            <Form.Label>Fecha de Inicio</Form.Label>
                                            <Form.Control
                                                autoComplete="off"
                                                type="date" name="fechaDeInicio"
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                    <Card.Footer>
                                        <Button>Crear Fase</Button>
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