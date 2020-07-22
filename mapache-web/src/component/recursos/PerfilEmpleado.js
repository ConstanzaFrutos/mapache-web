import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";

import NavBarPerfilEmpleado from "./NavBarPerfilEmpleado";

import Requester from "../../communication/Requester";
import TabInformacion from './TabInformacion';
import TabCargarHoras from './TabCargarHoras';
import TabTareas from './TabTareas';

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {}
        }

        this.procesarInfo = this.procesarInfo.bind(this);
    }

    componentDidMount() {
        if (this.props.location.state.modo === "info") {
            this.procesarInfo();
        } 
    }
    
    procesarInfo() {
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
                if (response) {
                    this.setState({
                        empleado: response
                    });
                }
            });
    }

    render() {
        
        let tab = null;

        if (this.props.location.state.tab === "informacion") {
            tab = <TabInformacion legajo={this.state.empleado.legajo} modo="info"/>
        } else if (this.props.location.state.tab === "cargar-horas") {
            tab = <TabCargarHoras legajo={this.state.empleado.legajo}/>
        } else if (this.props.location.state.tab === "tareas") {
            tab = <TabTareas legajo={this.state.empleado.legajo}/>
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
