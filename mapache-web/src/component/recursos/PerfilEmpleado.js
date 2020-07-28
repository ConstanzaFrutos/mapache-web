import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";

import { Alerta } from "../general/Alerta";

import NavBarPerfilEmpleado from "./NavBarPerfilEmpleado";

import Requester from "../../communication/Requester";
import TabInformacion from './TabInformacion';
import TabCargarHoras from './TabCargarHoras';
import TabTareas from './TabTareas';
import TabProyectos from './TabProyectos';

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
// const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {},
            mostrarAlerta: false,
            tipoAlerta: "",
            mensajeAlerta: ""
        }

        this.mostrarAlerta = this.mostrarAlerta.bind(this);
        this.handleCloseAlerta = this.handleCloseAlerta.bind(this);
    }

    componentDidMount() {
        let legajo = this.props.match.params.legajo;
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

                if (response) {
                    this.setState({
                        empleado: response
                    });
                }
            });
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

        let tab = null;

        if (this.props.location.state.tab === "informacion") {
            tab = <TabInformacion 
                      legajo={this.state.empleado.legajo} 
                      modo="info"
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        } else if (this.props.location.state.tab === "cargar-horas") {
            tab = <TabCargarHoras 
                      legajo={this.state.empleado.legajo}
                      contrato={this.state.empleado.contrato}
                      tarea={this.props.location.state.tarea ? this.props.location.state.tarea : null}
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        } else if (this.props.location.state.tab === "tareas") {
            tab = <TabTareas 
                      legajo={this.state.empleado.legajo}
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        } else if (this.props.location.state.tab === "proyectos") {
            tab = <TabProyectos 
                      legajo={this.state.empleado.legajo}
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        }

        return (
            <div className="perfil-empleado">
                <NavBarPerfilEmpleado 
                    legajo={ this.state.empleado.legajo }
                />
                { tab }
            </div>
        )
    }

}

export default withRouter(PerfilEmpleado);
