import { Box } from '@mui/material';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { useDataFromSource } from '../../hooks/useDataFromSource';
import { CompareDataProvider } from './-context/ContextProvider';

export const Route = createFileRoute('/compare-data/_layout')({
  component: CompareDataWrapper,
});

/**
 * Top-level wrapper for the compare-data Task Flow templates.
 * Inner pages are rendered inside the `<Outlet />` component
 */
function CompareDataWrapper() {
  // CUSTOMIZE: the data source for the main data table.
  const scenarios = useDataFromSource('data/DEPOT (last year).csv');

  // CUSTOMIZE: the columns for the main data table
  const columns = [
    {
      field: 'ID',
      headerName: 'ID',
      width: 120,
    },
    {
      field: 'Nickname',
      headerName: 'Nickname',
      width: 250,
    },
    {
      field: 'Model',
      headerName: 'Model',
      width: 200,
    },
    {
      field: 'Makername',
      headerName: 'Manufacturer',
      width: 200,
    },
    {
      field: 'Location',
      headerName: 'Location',
      width: 200,
    },
    {
      field: 'State',
      headerName: 'State',
      width: 150,
      isComparisonMetric: true,
    },
    {
      field: 'Shop',
      headerName: 'Shop',
      width: 150,
      isComparisonMetric: true,
    },
    {
      field: 'Class',
      headerName: 'Class',
      width: 150,
      isComparisonMetric: true,
    },
    {
      field: 'LastDate',
      headerName: 'Last Date',
      width: 150,
      isComparisonMetric: true,
    },
  ];

  return (
    <Box>
      <CompareDataProvider
        data={scenarios || []}
        columns={columns}
        // CUSTOMIZE: the unique identifier field in the data
        dataIdField="ID"
      >
        <Outlet />
      </CompareDataProvider>
    </Box>
  );
}
