import React, { Component } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
/* import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close'; */

import "../../assets/css/component/general/Alerta.css";

export class Alerta extends Component {
    render() {
        let open = this.props.open;

        return (
            <Snackbar open={open}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                autoHideDuration={this.props.duracion}
                onClose={this.props.handleClose}
            >
                <Alert variant="filled"
                    onClose={this.props.handleClose}
                    severity={this.props.tipo}
                >
                    {this.props.mensaje}
                </Alert>
            </Snackbar>
            // <div>
            // <div className="custom-alerta-div">
            //     <Snackbar open={open} onClose={this.props.handleClose}
            //         anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
            //         <Alert
            //             severity={this.props.tipo}
            //             action={
            //                 <IconButton
            //                     aria-label="close"
            //                     color="inherit"
            //                     size="small"
            //                     onClick={this.props.handleClose}
            //                 >
            //                     <CloseIcon fontSize="inherit" />
            //                 </IconButton>
            //             }
            //         >
            //             {this.props.mensaje}
            //         </Alert>
            //     </Snackbar>
            // </div>
        )
    }
}
