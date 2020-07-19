import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

export class DatePicker extends Component {

    getCurrentDate() {
        let currentDate = new Date();
        
        return `${currentDate.getFullYear}-${currentDate.getMonth}-${currentDate.getDay}`;
    }

    render() {

        let defaultValue = this.getCurrentDate();
        if (this.props.defaultValue) {
            defaultValue = this.props.defaultValue;
            console.log(this.props.defaultValue);
        }

        return (
            <div className="datepicker">
                <form className="fecha-nacimiento" noValidate>
                    <TextField
                        id="date"
                        label={ this.props.label }
                        type="date"
                        defaultValue={ defaultValue }
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={ (event) => this.props.handleDateInput(event, this.props.label) }
                    />
                </form>
            </div>
        )
    }

}