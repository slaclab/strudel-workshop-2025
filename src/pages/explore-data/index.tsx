import { Box, Paper, Stack } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import React, { useMemo, useState } from 'react';
import { FilterContext } from '../../components/FilterContext';
import { PageHeader } from '../../components/PageHeader';
import { FilterConfig } from '../../types/filters.types';
import { useListQuery } from '../../hooks/useListQuery';
import { useFilterOptions } from '../../hooks/useFilterOptions';
import { useDateRangeBounds } from '../../hooks/useDateRangeBounds';
import { DataView } from './-components/DataView';
import { DataViewHeader } from './-components/DataViewHeader';
import { FiltersPanel } from './-components/FiltersPanel';
import { PreviewPanel } from './-components/PreviewPanel';

export const Route = createFileRoute('/explore-data/')({
  component: DataExplorer,
});

/**
 * Main explorer page in the explore-data Task Flow.
 * This page includes the page header, filters panel,
 * main table, and the table row preview panel.
 */
function DataExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [previewItem, setPreviewItem] = useState<any>();
  const [showFiltersPanel, setShowFiltersPanel] = useState(true);

  // Fetch data to generate dynamic filter options
  const { data } = useListQuery({
    activeFilters: [],
    dataSource: 'data/DEPOT (last year).csv',
    filterConfigs: [],
    offset: 0,
    page: 0,
    pageSize: 1000, // Fetch all data to get complete filter options
    queryMode: 'client',
    staticParams: null,
  });

  // Generate dynamic filter options for each field
  const locationOptions = useFilterOptions({ data, field: 'Location' });
  const stateOptions = useFilterOptions({ data, field: 'State' });
  const manufacturerOptions = useFilterOptions({ data, field: 'Makername' });
  const subsystemOptions = useFilterOptions({ data, field: 'Subsystem' });

  // Get date range bounds for LastDate filter
  const [minDate, maxDate] = useDateRangeBounds({
    data,
    field: 'LastDate',
    dateFormat: 'MM/DD/YY',
  });

  // CUSTOMIZE: the filter definitions with dynamic options
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        field: 'Location',
        label: 'Location',
        operator: 'contains-one-of',
        filterComponent: 'CheckboxList',
        filterProps: {
          options: locationOptions,
        },
      },
      {
        field: 'State',
        label: 'State',
        operator: 'contains-one-of',
        filterComponent: 'CheckboxList',
        filterProps: {
          options: stateOptions,
        },
      },
      {
        field: 'Makername',
        label: 'Manufacturer',
        operator: 'contains-one-of',
        filterComponent: 'CheckboxList',
        filterProps: {
          options: manufacturerOptions,
        },
      },
      {
        field: 'Subsystem',
        label: 'Subsystem',
        operator: 'contains-one-of',
        filterComponent: 'CheckboxList',
        filterProps: {
          options: subsystemOptions,
        },
      },
      {
        field: 'LastDate',
        label: 'Last Date',
        operator: 'between-dates-inclusive',
        filterComponent: 'DateRange',
        filterProps: {
          min: minDate,
          max: maxDate,
        },
      },
    ],
    [
      locationOptions,
      stateOptions,
      manufacturerOptions,
      subsystemOptions,
      minDate,
      maxDate,
    ]
  );

  const handleCloseFilters = () => {
    setShowFiltersPanel(false);
  };

  const handleToggleFilters = () => {
    setShowFiltersPanel(!showFiltersPanel);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  return (
    <FilterContext>
      <Box>
        <PageHeader
          // CUSTOMIZE: the page title
          pageTitle="Explore DEPOT Data"
          // CUSTOMIZE: the page description
          description="View entries in DEPOT"
          sx={{
            marginBottom: 1,
            padding: 2,
          }}
        />
        <Box>
          <Stack direction="row">
            {showFiltersPanel && (
              <Box
                sx={{
                  width: '350px',
                }}
              >
                <FiltersPanel
                  filterConfigs={filterConfigs}
                  onClose={handleCloseFilters}
                />
              </Box>
            )}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                minHeight: '600px',
                minWidth: 0,
              }}
            >
              <DataViewHeader
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                searchColumn={searchColumn}
                setSearchColumn={setSearchColumn}
                onToggleFiltersPanel={handleToggleFilters}
              />
              <DataView
                filterConfigs={filterConfigs}
                searchTerm={searchTerm}
                searchColumn={searchColumn}
                setPreviewItem={setPreviewItem}
              />
            </Paper>
            {previewItem && (
              <Box
                sx={{
                  minWidth: '400px',
                }}
              >
                <PreviewPanel
                  previewItem={previewItem}
                  onClose={handleClosePreview}
                />
              </Box>
            )}
          </Stack>
        </Box>
      </Box>
    </FilterContext>
  );
}
