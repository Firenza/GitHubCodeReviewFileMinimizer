import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import DeleteIcon from 'material-ui-icons/Delete';

export default class FileDiffCollapseRegex extends Component {
    render() {
        return (
            <React.Fragment>
                <Typography type="subheading" gutterBottom>
                    File Diff Regexes
          </Typography>
              <DeleteIcon/>
            </React.Fragment>
        );
    }
}

