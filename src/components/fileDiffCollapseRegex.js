import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import DeleteIcon from 'material-ui-icons/Delete';
import List, { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Select from 'material-ui/Select';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import Grid from 'material-ui/Grid';
import * as _ from 'lodash';

const listItemStyle = {
    paddingTop: '5px',
    paddingBottom: '5px'
}

export default class FileDiffCollapseRegex extends Component {
    constructor(props) {
        super(props);

        this.state = this.props.fileDiffCollapseSetting;
    }

    componentWillReceiveProps(nextProps) {
        this.setState(nextProps.fileDiffCollapseSetting);
    }

    debouncedUpdated = _.debounce(this.props.updateFileDiffCollapseSetting, 150);

    handleInputChange = event => {
        this.state.matchString = event.target.value;

        this.setState(this.state);

        this.debouncedUpdated(this.state);
    }

    handleSelectChange = event => {
        this.state.matchType = event.target.value;
        
        this.setState(this.state);

        this.debouncedUpdated(this.state);
    }

    render() {
        return (
            <ListItem style={listItemStyle}>
                <Grid container alignItems="center">
                    <Grid item xs={1}>
                        {this.props.index > 0 &&
                          <Typography type="body2">Or</Typography>
                        }
                    </Grid> 
                    <Grid item xs={5}>
                        <Select
                            value={this.state.matchType}
                            onChange={this.handleSelectChange}
                            input={<Input name="matchType" id="blah"/>}
                        >
                            <MenuItem value={"Contains"}>Contains</MenuItem>
                            <MenuItem value={"Matches Regex"}>Matches Regex</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            id="name"
                            value={this.state.matchString}
                            onChange={this.handleInputChange}
                        />
                    </Grid>
                </Grid>

                <ListItemSecondaryAction>
                    <IconButton onClick={() => this.props.deleteFileDiffCollapseSetting(this.state.id)} aria-label="Delete">
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }
}

