import React, {Component} from "react";
import { withRouter } from 'react-router';
import {Button, Card, Col, Form, Table} from "react-bootstrap";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import axios from 'axios';
import Fase from "./Fase";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class ListadoFases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fases : [],
            nuevaFase : this.estadoInicial
        };
        this.cambioFase = this.cambioFase.bind(this);
        this.obtenerFases = this.obtenerFases.bind(this);
    }

    estadoInicial = {nombre: '', fechaDeInicio : '0000-00-00'};

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
        let copia = Object.assign({}, this.state.nuevaFase);
        copia.nombre = event.target.value;
        this.setState({
            nuevaFase : copia
        });
    }

    crearFase = event => {
        event.preventDefault();
        const fase = {
            nombre: this.state.nuevaFase.nombre,
            fechaDeInicio: this.state.nuevaFase.fechaDeInicio
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
                if(err.response){
                    let mensaje = "Error: " + err.response.status;
                    if(err.response.message){
                        mensaje += ': ' + err.response.message;
                    }
                    alert(mensaje);
                } else {
                    alert("Ocurrio un error desconocido");
                }
            }
        })();
    }

    render() {
        const {nombre} = this.state.nuevaFase;
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
                                            <Fase fase={fase} obtenerFases={this.obtenerFases}/>
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
                                                required autoComplete="off"
                                                type="text" name="nombre"
                                                value = {nombre}
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

export default withRouter(ListadoFases);