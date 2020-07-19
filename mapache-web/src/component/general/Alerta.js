import React, { Component } from 'react';

import Alert from '@material-ui/lab/Alert';

export class Alerta extends Component {
    
    render() {
        return (
            <div>
                <Alert variant="outlined" severity={ this.props.tipo }>
                    { this.props.mensaje }
                </Alert>
            </div>
        )
    }

}
