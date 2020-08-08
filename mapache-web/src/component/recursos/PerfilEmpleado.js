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
import TabHorasCargadas from './TabHorasCargadas';
import TabEstadisticas from './TabEstadisticas';

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
                    this.mostrarAlerta(
                        `Error al consultar al empleado con legajo ${legajo}`,
                        "error"
                    )
                }
            })
            .then(response => {

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
        let navBar = <NavBarPerfilEmpleado 
            legajo={ this.state.empleado.legajo }
        />
        
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
        let modo = this.props.location.state.modo ? this.props.location.state.modo : "info";
        console.log("Modo ", modo);
        console.log("Tab ", this.props.location.state.tab);
        if (this.props.location.state.tab === "informacion") {
            if (modo === "add") {
                navBar = null;
            }
            tab = <TabInformacion 
                      legajo={this.state.empleado.legajo} 
                      modo={ modo }
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
        } else if (this.props.location.state.tab === "horas-cargadas") {
            tab = <TabHorasCargadas 
                      legajo={this.state.empleado.legajo}
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        } else if (this.props.location.state.tab === "estadisticas") {
            tab = <TabEstadisticas 
                      legajo={this.state.empleado.legajo}
                      mostrarAlerta={ this.mostrarAlerta }
                      handleCloseAlerta={ this.handleCloseAlerta }
                      alerta={ alerta }
                  />
        }

        return (
            <div className="perfil-empleado">
                { navBar }
                { tab }
            </div>
        )
    }

}

export default withRouter(PerfilEmpleado);
