import React, {Component} from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";

import "../../assets/css/component/recursos/NavBarPerfilEmpleado.css"

export default class NavBarProyecto extends Component {
    render() {
        return(
            <Navbar className="navbar navbar-expand-lg navbar-dark empleados-navbar">
                <Nav className="mr-auto">
                    <Link 
                        to={{
                            pathname: `/empleados/${this.props.legajo}`, 
                            state: { modo: "info", tab: "informacion" }
                        }} 
                        params={{ legajo: this.props.legajo }}
                        className="nav-link"
                    >Información</Link>
                    <Link 
                        to={{
                            pathname: `/empleados/${this.props.legajo}/proyectos`, 
                        }} 
                        className="nav-link"
                    >Proyectos</Link>
                    <Link 
                        to={{
                            pathname: `/empleados/${this.props.legajo}`, 
                            state: { tab: "tareas"}
                        }} 
                        className="nav-link"
                    >Tareas</Link>
                    <Link 
                        to={{
                            pathname: `/empleados/${this.props.legajo}`, 
                            state: { tab: "cargar-horas"}
                        }} 
                        params={{ legajo: this.props.legajo }}
                        className="nav-link"
                    >Cargar Horas</Link>
                    <Link to={"/empleados/:legajo/horas-cargadas"} className="nav-link">Horas cargadas</Link>
                </Nav>
            </Navbar>
        );
    }
}