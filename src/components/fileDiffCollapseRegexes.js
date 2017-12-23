import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import FileDiffCollapseRegex from './fileDiffCollapseRegex'

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
{     console.log("regex props = " + this.props.regexes)}
                {
               
                    this.props.regexes.map(() => {
                        <FileDiffCollapseRegex />
                    })
                }
             
            </React.Fragment>
        );
    }
}

