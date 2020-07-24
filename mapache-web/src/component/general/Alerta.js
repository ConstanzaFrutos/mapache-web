import React, { Component } from 'react';

import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Alert from '@material-ui/lab/Alert';

export class Alerta extends Component {

    render() {
        let open = this.props.open;

        return (
            <div>
                <Collapse in={ open }>
                    <Alert 
                        variant="outlined" 
                        severity={ this.props.tipo }
                        action={
                                <IconButton
                                    aria-label="close"
                                    color="inherit"
                                    size="small"
                                    onClick={this.props.handleClose}
                                >
                                    <CloseIcon fontSize="inherit" />
                                </IconButton>
                            }
                    >
                        { this.props.mensaje }
                    </Alert>
                </Collapse>
            </div>
        )
    }

}
