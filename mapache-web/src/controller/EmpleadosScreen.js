import React, { Component } from 'react';
import { withRouter } from 'react-router';

import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

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
                <div className="empleados-table">
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{title}</TableCell>
                                    {tableCells.map((cell) => {
                                        if (cell !== "legajo")
                                            return <TableCell align="right">{cell}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows.map((row) => (
                                    <TableRow key={row.nombre}>
                                        <TableCell component="th" scope="row">
                                            {row.legajo}
                                        </TableCell>

                                        {tableCells.map((cell) => {
                                            if (cell !== "legajo")
                                                return <TableCell align="right">
                                                            {row[cell]}
                                                        </TableCell>
                                        })}
                                        
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        )
    }

}

export default withRouter(EmpleadosScreen);

const title = "Empleado";

const tableCells = [
    "legajo",
    "nombre",
    "apellido", 
    "contrato",
    "seniority"
]

function createData(legajo, nombre, apellido, contrato, seniority) {
    return { legajo, nombre, apellido, contrato, seniority };
}
