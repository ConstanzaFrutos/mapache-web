import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

export class DatePicker extends Component {

    getCurrentDate() {
        let currentDate = new Date();
        console.log(`${currentDate.getMonth}/${currentDate.getDay}/${currentDate.getFullYear}`);
        return `${currentDate.getMonth}/${currentDate.getDay}/${currentDate.getFullYear}`;
    }

    render() {
        return (
            <div className="datepicker">
                <form className="fecha-nacimiento" noValidate>
                    <TextField
                        id="date"
                        label={ this.props.label }
                        type="date"
                        defaultValue={ this.getCurrentDate }
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