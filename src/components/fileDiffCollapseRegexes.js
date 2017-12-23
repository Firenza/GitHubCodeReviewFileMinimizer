import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import FileDiffCollapseRegex from './fileDiffCollapseRegex'
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';

export default class FileDiffCollapseRegexes extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <React.Fragment>
                <Typography type="subheading" gutterBottom>
                    File Diff Regexes
                </Typography>
                {
                    this.props.fileDiffCollapseSettings.map((fileDiffCollapseSetting, index) => {
                        return (
                            <FileDiffCollapseRegex 
                                key={index} 
                                fileDiffCollapseSetting={fileDiffCollapseSetting}
                                deleteFileDiffCollapseSetting={this.props.deleteFileDiffCollapseSetting} 
                                updateFileDiffCollapseSetting={this.props.updateFileDiffCollapseSetting}
                            />
                        );
                    })
                }
                <Button onClick={() => this.props.addNewFileDiffCollapseSetting()} fab color="primary" aria-label="add">
                    <AddIcon />
                </Button>
            </React.Fragment>
        );
    }
}

