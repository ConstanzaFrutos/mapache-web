import React, { Component } from 'react';

import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";

import "../assets/css/component/Tabla.css";

export class Tabla extends Component {

    render() {
        return (
            <div className="tabla">
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.props.title}</TableCell>
                                {this.props.tableCells.filter((cell) => {
                                    return cell !== this.props.tableCells[0]
                                }).map((cell) => {
                                    return <TableCell align="right">{cell}</TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.props.rows.map((row) => (
                                <TableRow key={row.nombre}>
                                    <TableCell component="th" scope="row">
                                        {row.legajo}
                                    </TableCell>

                                    {this.props.tableCells.filter((cell) => {
                                        return cell !== this.props.tableCells[0]
                                    }).map((cell) => {
                                        return <TableCell align="right">
                                                    {row[cell.toLowerCase()]}
                                                </TableCell>
                                    })}
                                    
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }

}