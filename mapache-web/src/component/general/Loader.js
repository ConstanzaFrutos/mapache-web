import React, { Component } from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

export class Loader extends Component {
    render() {
        return (
            <Grid container spacing={0}
                direction="column" alignItems="center"
                justify="center" style={{ minHeight: '100vh' }}>
                <Grid item xs={3}>
                    <CircularProgress />
                </Grid>
            </Grid>
        )
    }
}
