import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

interface DataViewHeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchColumn: string;
  setSearchColumn: React.Dispatch<React.SetStateAction<string>>;
  onToggleFiltersPanel: () => void;
}

/**
 * Data table header section with filters button and search bar
 */
export const DataViewHeader: React.FC<DataViewHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  searchColumn,
  setSearchColumn,
  onToggleFiltersPanel,
}) => {
  const handleSearch: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setSearchTerm(evt.target.value);
  };

  const handleColumnChange = (event: any) => {
    setSearchColumn(event.target.value);
  };

  // Column options based on the data structure
  const columnOptions = [
    { value: 'all', label: 'All Columns' },
    { value: 'ID', label: 'ID' },
    { value: 'Model', label: 'Model' },
    { value: 'Nickname', label: 'Nickname' },
    { value: 'Location', label: 'Location' },
    { value: 'LastDate', label: 'Last Date' },
    { value: 'Makername', label: 'Manufacturer' },
    { value: 'State', label: 'State' },
    { value: 'Subsystem', label: 'Subsystem' },
  ];

  return (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      sx={{
        overflow: 'hidden',
        padding: 2,
      }}
    >
      <Typography variant="h6" component="h2" flex={1}>
        Entity List
      </Typography>
      <Button startIcon={<FilterListIcon />} onClick={onToggleFiltersPanel}>
        Filters
      </Button>
      <Stack direction="row" spacing={0} alignItems="center">
        <Select
          value={searchColumn}
          onChange={handleColumnChange}
          size="small"
          renderValue={() => <SearchIcon fontSize="small" />}
          sx={{
            width: 'auto',
            minWidth: 'unset',
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            '& .MuiSelect-select': {
              paddingRight: '32px !important',
              paddingLeft: '8px',
              display: 'flex',
              alignItems: 'center',
            },
            '& fieldset': {
              borderRight: 'none',
            },
          }}
        >
          {columnOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        <TextField
          variant="outlined"
          label="Search"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            },
          }}
        />
      </Stack>
    </Stack>
  );
};
