import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";

import Avatar from '@material-ui/core/Avatar';
import PhoneIcon from '@material-ui/icons/Phone';

import Paper from '@material-ui/core/Paper';
import { TabPanel } from "../general/TabPanel";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            iniciales: "",
            fechaNacimientoFormateada: ""
        }

        this.formatearFecha = this.formatearFecha.bind(this);
    }

    componentDidMount() {
        let legajo = this.props.match.params.legajo;
        console.log("Params: ", this.props);
        console.log(`Legajo: ${legajo}`);
        this.requester.get('/empleados/' + legajo)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    console.log("Error al consultar empleado con legajo: ");
                }
            })
            .then(response => {
                console.log(response);
                let iniciales = response.nombre.charAt(0) + response.apellido.charAt(0);
                iniciales = iniciales.toUpperCase();
                let fechaNacimientoFormateada = this.formatearFecha(response.fechaNacimiento);
                console.log(fechaNacimientoFormateada);
                if (response) {
                    this.setState({
                        empleado: response,
                        iniciales: iniciales,
                        fechaNacimientoFormateada: fechaNacimientoFormateada
                    });
                }
            });
    }

    formatearFecha(fecha) {
        let año = fecha[0];
        let mes = fecha[1];
        let dia = fecha[2];

        return `${dia}/${mes}/${año}`;
    }

    render() {

        let value = [
            "Información",
            "Carga de horas"
        ]

        let labels = [
            "Información",
            "Carga de horas"
        ]

        let icons = [
            <PhoneIcon></PhoneIcon>,
            <PhoneIcon></PhoneIcon>
        ]

        return (
            <div className="perfil-empleado">
                <div className={"foto-y-nombre"}>
                    <Avatar className="avatar">{this.state.iniciales}</Avatar>
                    <p className={"nombre"}>{this.state.empleado.apellido + ", " + this.state.empleado.nombre}</p>
                </div>
                <div className={ "perfil-empleado-body" }>
                    <Paper square className="paper-informacion">
                        <div className="informacion">
                            <p>Nombre y Apellido: { this.state.empleado.nombre + ", " + this.state.empleado.apellido }</p>
                            <p>DNI: { this.state.empleado.dni }</p>
                            <p>Fecha de nacimiento: { this.state.fechaNacimientoFormateada }</p>
                            <br></br>
                            <p>Legajo: { this.state.empleado.legajo }</p>
                            <br></br>
                            <p>Seniority: { this.state.empleado.seniority }</p>
                            <br></br>
                            <p>Contrato: { this.state.empleado.contrato }</p>
                            <br></br>
                            <p>Antigüedad: { this.state.empleado.antiguedad }</p>
                            <br></br>
                            <p>Rol: { this.state.empleado.rol }</p>
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }

}

export default withRouter(PerfilEmpleado);
