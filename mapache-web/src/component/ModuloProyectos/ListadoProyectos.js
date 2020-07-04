import React, { Component }  from 'react';
import axios from 'axios';
import {ButtonGroup, Card, Table, Button} from "react-bootstrap";
import {Link} from "react-router-dom";

export default class ListadoProyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            proyectos : []
        };
    }

    componentDidMount() {
        axios.get('http://localhost:8080/proyectos')
            .then(respuesta => respuesta.data)
            .then((data) => {
                this.setState({proyectos : data})
            });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        axios.get('http://localhost:8080/proyectos')
            .then(respuesta => respuesta.data)
            .then((data) => {
                this.setState({proyectos : data})
            });
    }

    eliminarProyecto = (proyectoId) => {
        axios.delete('http://localhost:8080/proyectos/'+proyectoId)
            .then(respuesta => {
                if(respuesta.data != null){
                    alert("El proyecto fue eliminado correctamente");
                }
            });
    }

    render() {
        return (
            <div className={"proyectosDiv"}>
                <Card className={"proyectos-card"}>
                    <Card.Header>Proyectos</Card.Header>
                    <Card.Body>
                        <Table bordered hover striped varient="dark">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Nombre</th>
                                <th>Tipo</th>
                                <th>Acciones</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.proyectos.length === 0 ?
                                <tr align="center">
                                    <td colSpan="4">No exite ningun proyecto</td>
                                </tr> :
                                this.state.proyectos.map((proyecto) => (
                                    <tr key={proyecto.id}>
                                        <td>{proyecto.id}</td>
                                        <td>{proyecto.nombre}</td>
                                        <td>{proyecto.tipoDeProyecto}</td>
                                        <td>
                                            <ButtonGroup>
                                                <Link to={"/proyectos/edit/"+proyecto.id}><Button size="sm" variant="outline-primary">
                                                    Edit
                                                </Button>
                                                </Link>
                                                <Button size="sm" variant="outline-primary" onClick={this.eliminarProyecto.bind(this,proyecto.id)}>
                                                    Delete
                                                </Button>
                                            </ButtonGroup>
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}