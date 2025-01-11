import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  SelectChangeEvent,
} from '@mui/material';
import { SearchFilters } from '../types';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
}

export const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  filters,
  onFilterChange,
}) => {
  const handleSourceChange = (event: SelectChangeEvent<string[]>) => {
    onFilterChange({
      ...filters,
      sources: event.target.value as string[],
    });
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      sortBy: event.target.value as 'relevance' | 'citations' | 'date',
    });
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    onFilterChange({
      ...filters,
      sortOrder: event.target.value as 'asc' | 'desc',
    });
  };

  const handleYearChange = (type: 'start' | 'end', value: string) => {
    const yearValue = value === '' ? undefined : value;
    onFilterChange({
      ...filters,
      [type === 'start' ? 'startYear' : 'endYear']: yearValue,
    });
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Sources</InputLabel>
        <Select
          multiple
          value={filters.sources}
          onChange={handleSourceChange}
          label="Sources"
          size="small"
        >
          <MenuItem value="PubMed">PubMed</MenuItem>
          <MenuItem value="arXiv">arXiv</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy}
          onChange={handleSortByChange}
          label="Sort By"
          size="small"
        >
          <MenuItem value="relevance">Relevance</MenuItem>
          <MenuItem value="citations">Citations</MenuItem>
          <MenuItem value="date">Date</MenuItem>
        </Select>
      </FormControl>

      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={filters.sortOrder}
          onChange={handleSortOrderChange}
          label="Order"
          size="small"
        >
          <MenuItem value="desc">Descending</MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label="Start Year"
        type="number"
        size="small"
        value={filters.startYear || ''}
        onChange={(e) => handleYearChange('start', e.target.value)}
        sx={{ width: 100 }}
      />

      <TextField
        label="End Year"
        type="number"
        size="small"
        value={filters.endYear || ''}
        onChange={(e) => handleYearChange('end', e.target.value)}
        sx={{ width: 100 }}
      />

      <TextField
        label="Max Results"
        type="number"
        size="small"
        value={filters.maxResults}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (!isNaN(value) && value > 0) {
            onFilterChange({
              ...filters,
              maxResults: value
            });
          }
        }}
        sx={{ width: 100 }}
        inputProps={{ min: 1 }}
      />
    </Box>
  );
};
