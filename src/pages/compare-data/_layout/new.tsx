import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { AppLink } from '../../../components/AppLink';
import { PageHeader } from '../../../components/PageHeader';
import { useCompareData } from '../-context/ContextProvider';
import { setComparing } from '../-context/actions';

export const Route = createFileRoute('/compare-data/_layout/new')({
  component: NewScenario,
});

/**
 * Page for filling out a form for adding a new item to
 * the main list in the compare-data Task Flow.
 */
function NewScenario() {
  const { dispatch } = useCompareData();
  const [availableNicknames, setAvailableNicknames] = useState<string[]>([]);
  const [selectedNickname, setSelectedNickname] = useState('');

  /**
   * Set comparing to true whenever this page renders.
   * Set it back to false when the component is torn down.
   */
  useEffect(() => {
    dispatch(setComparing(true));
    return () => {
      dispatch(setComparing(false));
    };
  }, []);

  /**
   * Load available nicknames from the CSV file
   */
  useEffect(() => {
    const loadNicknames = async () => {
      try {
        const response = await fetch('/data/DEPOT (last year).csv');
        const csvText = await response.text();

        // Parse CSV properly handling quoted fields
        const lines = csvText.split('\n');
        const nicknames = new Set<string>();

        // Skip header row, start from index 1
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Parse CSV line with proper quote handling
          const columns = parseCSVLine(line);
          if (columns.length > 8) {
            const nickname = columns[8].trim();
            if (nickname) {
              nicknames.add(nickname);
            }
          }
        }

        // Convert Set to sorted array
        const sortedNicknames = Array.from(nicknames).sort();
        setAvailableNicknames(sortedNicknames);
      } catch (error) {
        // Error loading nicknames - fail silently
        setAvailableNicknames([]);
      }
    };

    loadNicknames();
  }, []);

  /**
   * Parse a CSV line handling quoted fields with commas
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }

    // Push the last field
    result.push(current);

    return result;
  };

  return (
    <Box>
      <PageHeader
        // CUSTOMIZE: the title that displays at the top of the page
        pageTitle="New Scenario"
        // CUSTOMIZE: the subtitle that displays underneath the title
        description="Description of this app section"
        actions={
          <Stack direction="row">
            <Box>
              <AppLink to="..">
                <Button
                  variant="contained"
                  color="warning"
                  data-testid="cpd-cancel-button"
                >
                  Cancel
                </Button>
              </AppLink>
            </Box>
            <Box>
              <AppLink to="..">
                {/* CUSTOMIZE: the save button text */}
                <Button variant="contained" data-testid="cpd-save-button">
                  Save item
                </Button>
              </AppLink>
            </Box>
          </Stack>
        }
        sx={{
          padding: 3,
          backgroundColor: 'white',
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          marginTop: 3,
          marginBottom: 3,
        }}
      >
        <Paper
          sx={{
            padding: 2,
          }}
        >
          {/* CUSTOMIZE: form elements */}
          <Stack spacing={3}>
            <TextField
              label="SLAC ID"
              variant="outlined"
              fullWidth
              placeholder="Enter SLAC ID"
            />
            <TextField
              label="Serial"
              variant="outlined"
              fullWidth
              placeholder="Enter Serial"
            />
            <TextField
              select
              label="Nickname"
              variant="outlined"
              fullWidth
              value={selectedNickname}
              onChange={(e) => setSelectedNickname(e.target.value)}
              placeholder="Select Nickname"
            >
              {availableNicknames.map((nickname) => (
                <MenuItem key={nickname} value={nickname}>
                  {nickname}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Location"
              variant="outlined"
              fullWidth
              placeholder="Enter Location"
            />
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
