import React, { Component }  from 'react';
import axios from 'axios';
import {ButtonGroup, Table, Button, Form, Card, Col} from "react-bootstrap";
import {Link} from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import { withRouter } from 'react-router';
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import {Dropdown} from "../../general/Dropdown";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class TareasIteracion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tareas: []
        };
    }

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.get(URL+proyectoId+'/fases/'+faseId+'/iteraciones/'+this.props.iteracion)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("Entre: "+this.props.iteracion);
                    this.setState({
                        fechaDeInicio: respuesta.data.fechaDeInicio,
                        fechaDeFinalizacion: respuesta.data.fechaDeFinalizacion
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

    render() {
        const {fechaDeInicio, fechaDeFinalizacion} = this.state;
        return(
            <Form id="formularioFaseEditar" onSubmit={this.actualizarFase}>
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
                </Card.Body>
            </Form>
        );
    }
}

export default withRouter(TareasIteracion);