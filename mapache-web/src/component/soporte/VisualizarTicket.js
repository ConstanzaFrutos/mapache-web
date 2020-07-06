import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/PerfilEmpleado.css";



import Paper from '@material-ui/core/Paper';

import Requester from "../../communication/Requester";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheSoporteBaseUrl = "http://localhost:5000";

class VisualizarTicket extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheSoporteBaseUrl);

        this.state = {
            ticket: {},
        }

    }

    componentDidMount() {
        let id_ticket = this.props.match.params.id;
        console.log("Params: ", this.props);
        console.log(`id_ticket: ${id_ticket}`);
        this.requester.get('/empleados/' + id_ticket)
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
                        ticket: response,

                    });
                }
            });
    }

    render() {
        return (
            <div className="visualizar-ticket">
                <div className={ "visualizar-ticket-body" }>
                    <Paper square className="paper-informacion">
                        <div className="informacion">
                            <p>Nombre: { this.state.ticket.nombre}</p>
                            <br></br>
                            <p>Descripcion: { this.state.ticket.descripcion }</p>
                            <br></br>
                            <p>Estado { this.state.ticket.estado }</p>
                            <br></br>
                            <p>Tipo: { this.state.ticket.tipo }</p>
                            <br></br>
                        </div>
                    </Paper>
                </div>
            </div>
        )
    }

}

export default withRouter(VisualizarTicket);