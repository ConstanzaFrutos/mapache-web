import React, { Component } from 'react';
import { withRouter } from 'react-router';

import { Tabla } from "../component/Tabla";

import Requester from "../communication/Requester";

import "../assets/css/controller/EmpleadosScreen.css";

//const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

class EmpleadosScreen extends Component {

    constructor(props) {
        super(props);

        this.requester = new Requester(mapacheRecursosBaseUrl);

        this.state = {
            empleados: [],
            rows: []
        }

        this.createRows = this.createRows.bind(this);
    }

    componentDidMount() {
        this.requester.get('/empleados/')
        .then(response => {
            if (response.ok){
                return response.json();
            } else {
                console.log("Error al consultar empleados");
            }
        })
        .then(response => {
            console.log(response);
            let rows = this.createRows(response);
            if (response) {
                this.setState({
                    empleados: response,
                    rows: rows
                });
            }
        });
    }

    createRows(empleados) {
        //legajo, nombre, apellido, contrato, seniority
        return empleados.map( (empleado) => {
            return createData(
                empleado.legajo, 
                empleado.nombre,
                empleado.apellido, 
                empleado.contrato,
                empleado.seniority
            );
        });
    }

    render() {
        return (
            <div className="empleados-screen-div">
                <Tabla 
                    title = { title }
                    tableCells={ tableCells }
                    rows={ this.state.rows }
                ></Tabla>
            </div>
        )
    }

}

export default withRouter(EmpleadosScreen);

const title = "Empleado";

const tableCells = [
    "Legajo",
    "Nombre",
    "Apellido", 
    "Contrato",
    "Seniority"
]

function createData(legajo, nombre, apellido, contrato, seniority) {
    return { legajo, nombre, apellido, contrato, seniority };
}
