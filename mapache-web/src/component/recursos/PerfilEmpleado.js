import React, { Component } from 'react';
import { withRouter } from 'react-router';

import Requester from "../../communication/Requester";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleado: {}
        }

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
                if (response) {
                    this.setState({
                        empleado: response
                    });
                }
            });
    }

    render() {
        return (
            <div className="perfil-empleado">
                {this.state.empleado.legajo}
            </div>
        )
    }

}

export default withRouter(PerfilEmpleado);