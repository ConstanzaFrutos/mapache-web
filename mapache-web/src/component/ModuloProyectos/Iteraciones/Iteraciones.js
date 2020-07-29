import React, { Component }  from 'react';
import axios from 'axios';
import {Card} from "react-bootstrap";
import { withRouter } from 'react-router';
import "../../../assets/css/controller/ProyectosScreen.css";
import "../../../assets/css/ModuloProyectos/TablaCrearProyecto.css";
import {Dropdown} from "../../general/Dropdown";
import TareasIteracion from "./TareasIteracion";
const URL = 'https://mapache-proyectos.herokuapp.com/proyectos/';

class Iteraciones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iteraciones: [],
            iteracionActual: 0
        }
    }

    componentDidMount() {
        const proyectoId = +this.props.match.params.id;
        const faseId = +this.props.match.params.id_fase;
        axios.get(URL+proyectoId+'/fases/'+faseId+'/iteraciones')
            .then(respuesta => {
                let aux = respuesta.data.map((iteracion) => {
                    return {
                        name: iteracion.nombre,
                        value: iteracion.id
                    }
                });
                this.setState({
                    iteraciones: aux,
                    iteracionActual: aux[0].name
                });
            }).catch(function(err){
            if(err.response){
                let mensaje = "Error: " + err.response.data.status;
                if(err.response.data.error){
                    mensaje += '\n' + err.response.data.error;
                }
                alert(mensaje);
            } else {
                alert("Ocurrio un error desconocido");
            }
        });
    }

    seleccionarIteracion = event => {
        event.preventDefault();
        this.setState({iteracionActual: event.target.value});
    }

    render() {
        const {iteraciones, iteracionActual} = this.state;
        return(
            <div className="proyectos-screen-div" style={{width:"100%", height:"100%"}}>
                <Card className="tablaCrearProyectos">
                    <Dropdown
                        renderDropdown={ true }
                        label="Iteraciones"
                        value={ iteracionActual }
                        values={ iteraciones }
                        handleChange={ this.seleccionarIteracion }
                    >
                    </Dropdown>
                    <TareasIteracion iteracion={iteracionActual}/>
                </Card>
            </div>
        );
    }
}

export default withRouter(Iteraciones);