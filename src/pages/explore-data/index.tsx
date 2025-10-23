import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explore-data/')({
  component: RouteComponent,
})

// CUSTOMIZE: the filter definitions
const filterConfigs: FilterConfig[] = [
  {
    field: 'State',
    label: 'State',
    operator: 'contains-one-of',
    filterComponent: 'CheckboxList',
    filterProps: {
      options: [
        {
          label: 'New',
          value: 'NEW',
        },
        {
          label: 'Ready',
          value: 'READY',
        },
        {
          label: 'Spare',
          value: 'SPARE',
        },
        {
          label: 'Maintenance',
          value: 'MAINT',
        },
      ],
    },
  },
];

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
