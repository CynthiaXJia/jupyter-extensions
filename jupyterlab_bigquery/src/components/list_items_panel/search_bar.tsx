// import { Dialog } from '@material-ui/core';
import * as React from 'react';
import { stylesheet } from 'typestyle';
// import { SubmitButton } from 'gcp_jupyterlab_shared';
import SearchIcon from '@material-ui/icons/Search';
// import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';

interface Props {
  handleKeyPress: (e) => void;
  handleClear: () => void;
  defaultText?: string;
}

const searchStyle = stylesheet({
  search: {
    display: 'flex',
    flexDirection: 'row',
  },
});

/** Funtional Component for a common dialog interface with cancel and submit buttons. */
export function SearchBar(props: Props) {
  const handleOnChange = event => {
    if (event.target.value === '') {
      props.handleClear();
    }
  };

  return (
    <div className={searchStyle.search}>
      <TextField
        id="standard-search"
        placeholder={props.defaultText || 'Search...'}
        type="search"
        margin="normal"
        onKeyPress={e => props.handleKeyPress(e)}
        onChange={e => handleOnChange(e)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
}
