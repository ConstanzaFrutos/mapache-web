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

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com/";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

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
            let rows = this.createRows();
            if (response) {
                this.setState({
                    empleados: response,
                    rows: rows
                });
            }
        });
    }

    createRows() {
        //legajo, nombre, apellido, contrato, seniority
        return this.state.empleados.map( (empleado) => {
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
                                        if (cell != "legajo")
                                            return <TableCell align="right">{cell}</TableCell>
                                    })}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.nombre}>
                                        <TableCell component="th" scope="row">
                                            {row.legajo}
                                        </TableCell>

                                        {tableCells.map((cell) => {
                                            console.log(cell);
                                            if (cell != "legajo")
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

const rows = [
    createData('1','Jane', 'Doe', "Full-time", "Senior"),
    createData('2', 'Jon', 'Snow', "Junior", "Soporte"),
    createData('3', 'Hermione', 'Granger', "Senior", "Full-time"),
    createData('4', 'Anakin', 'Skywalker', "Senior", "Part-time"),
];

const empleados = [
    {
        legajo: "1",
        nombre: "nombre",
        apellido: "apellido",
        seniority: "junior",
        contrato: "full-time"
    },
    {
        legajo: "2",
        nombre: "nombre2",
        apellido: "apellido2",
        seniority: "junior",
        contrato: "full-time"
    }
]
