import React, { Component } from 'react';

class PerfilEmpleado extends Component {

    constructor(props) {
        super(props);

        this.state = {
            legajo: '',
            nombre: '',
            apellido: '',
            dni: '',
            fechaNacimiento: ''
        }

    }

    render() {
        return (
            <div className="perfil-empleado">
                
            </div>
        )
    }

}