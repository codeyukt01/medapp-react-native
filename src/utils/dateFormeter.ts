import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isYesterday from 'dayjs/plugin/isYesterday';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(relativeTime);
dayjs.extend(isYesterday);
dayjs.extend(localizedFormat);


export function formatDate(inputDate: string | number | dayjs.Dayjs | Date | null | undefined) {
    const date = dayjs(inputDate);
    const now = dayjs();
  
    // If it's today and within the last 24 hours
    if (date.isAfter(now.subtract(1, 'day'))) {
      if (date.isYesterday()) {
        return 'Yesterday';
      }
      return date.fromNow(); // e.g., "10 minutes ago", "3 hours ago"
    }
  
    // If it's yesterday
    if (date.isYesterday()) {
      return 'Yesterday';
    }
  
    // Else, return formatted date like "1 June 2025"
    return date.format('D MMMM YYYY');
  }
