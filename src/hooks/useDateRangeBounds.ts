import { useMemo } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

interface UseDateRangeBoundsProps {
  data: any[] | undefined;
  field: string;
  dateFormat?: string;
}

/**
 * Custom hook to extract minimum and maximum dates from a specific field in the data
 * Returns the date range bounds as Date objects for use with DateRange filters
 */
export const useDateRangeBounds = ({
  data,
  field,
  dateFormat = 'MM/DD/YY',
}: UseDateRangeBoundsProps): [Date | null, Date | null] => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [null, null];
    }

    let minDate: dayjs.Dayjs | undefined;
    let maxDate: dayjs.Dayjs | undefined;

    data.forEach((row) => {
      const dateValue = row[field];
      if (dateValue !== null && dateValue !== undefined && dateValue !== '') {
        const parsedDate = dayjs(dateValue, dateFormat);

        if (parsedDate.isValid()) {
          if (!minDate || parsedDate.isBefore(minDate)) {
            minDate = parsedDate;
          }
          if (!maxDate || parsedDate.isAfter(maxDate)) {
            maxDate = parsedDate;
          }
        }
      }
    });

    return [
      minDate ? minDate.toDate() : null,
      maxDate ? maxDate.toDate() : null,
    ];
  }, [data, field, dateFormat]);
};
