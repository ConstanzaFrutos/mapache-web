import React, { Component } from 'react';

import TextField from '@material-ui/core/TextField';

export class DatePicker extends Component {

    getCurrentDate() {
        let currentDate = new Date();
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
                        defaultValue={this.getCurrentDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
            </div>
        )
    }

}