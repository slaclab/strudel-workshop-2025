import { useMemo } from 'react';
import { CheckboxOption } from '../components/CheckboxList';

interface UseFilterOptionsProps {
  data: any[] | undefined;
  field: string;
}

/**
 * Custom hook to extract unique values from a specific field in the data
 * and convert them to CheckboxOption format for use with CheckboxList filters
 */
export const useFilterOptions = ({
  data,
  field,
}: UseFilterOptionsProps): CheckboxOption[] => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // Extract unique values from the specified field
    const uniqueValues = new Set<string>();

    data.forEach((row) => {
      const value = row[field];
      if (value !== null && value !== undefined && value !== '') {
        uniqueValues.add(String(value).trim());
      }
    });

    // Convert to CheckboxOption format and sort alphabetically
    const options: CheckboxOption[] = Array.from(uniqueValues)
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        label: value,
        value: value,
      }));

    return options;
  }, [data, field]);
};
