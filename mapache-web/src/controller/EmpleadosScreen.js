import React, { Component } from 'react';
import { withRouter } from 'react-router';

import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import "../assets/css/controller/EmpleadosScreen.css";

class EmpleadosScreen extends Component {

    render() {
        return (
            <div className="empleados-screen-div">
                <div className="empleados-table">
                    <TableContainer component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Empleado</TableCell>
                                    <TableCell align="right">Seniority</TableCell>
                                    <TableCell align="right">Contrato</TableCell>
                                    <TableCell align="right">Horas trabajadas</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.nombre}>
                                        <TableCell component="th" scope="row">
                                            {row.nombre}
                                        </TableCell>
                                        <TableCell align="right">{row.seniority}</TableCell>
                                        <TableCell align="right">{row.contrato}</TableCell>
                                        <TableCell align="right">{row.horasTrabajadas}</TableCell>
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

function createData(nombre, seniority, contrato, horasTrabajadas) {
    return { nombre, seniority, contrato, horasTrabajadas };
}

const rows = [
    createData('Jane Doe', "Senior", "Full-time", "19 hs"),
    createData('Jon Snow', "Junior", "Soporte", "12 hs"),
    createData('Hermione Granger', "Senior", "Full-time", "40 hs"),
    createData('Anakin Skywalker', "Senior", "Part-time", "4 hs"),
];