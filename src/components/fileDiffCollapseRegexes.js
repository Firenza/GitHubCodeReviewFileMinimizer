import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import FileDiffCollapseRegex from './fileDiffCollapseRegex'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Grid from 'material-ui/Grid';
import Tooltip from 'material-ui/Tooltip/Tooltip';

const addButtonStyle = {
    marginTop: "10px",
    marginBottom: "10px",
    marginRight: "18px"
};

const titleStyle = {
    marginTop: "30px"
};

const headerStyle = {
    marginTop: "10px",
    marginLeft: "48px",
    marginBottom: "-15px"
};

export default class FileDiffCollapseRegexes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Grid container justify="center">
                        <Typography style={titleStyle} type="title">
                            File Diff Collapsing
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography style={headerStyle} type="body2">
                        Collapse file diff when file path ...
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {
                        this.props.fileDiffCollapseSettings.map((fileDiffCollapseSetting, index) => {
                            return (
                                <FileDiffCollapseRegex
                                    key={index}
                                    index={index}
                                    fileDiffCollapseSetting={fileDiffCollapseSetting}
                                    deleteFileDiffCollapseSetting={this.props.deleteFileDiffCollapseSetting}
                                    updateFileDiffCollapseSetting={this.props.updateFileDiffCollapseSetting}
                                />
                            );
                        })
                    }
                </Grid>
                <Grid item xs={12}>
                    <Grid container justify="flex-end">
                        <Tooltip placement="right" title="Add new contition">
                            <Button style={addButtonStyle} mini onClick={() => this.props.addNewFileDiffCollapseSetting()} fab color="primary" aria-label="add">
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

