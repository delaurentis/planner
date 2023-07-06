
// Turn a text based date into a numeric one
export const textDateToNumeric = (text: string) => {

  // Convert our string back to a date
  const date = new Date(text);

  // Get the individual parts of the date
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  const day = date.getDate();

  // Construct the date string
  return `${year}-${month}-${day}`;
}

// Modify the numericDateToText function to allow year and timeZone to be optional
export const numericDateToText = (numeric: string | undefined, includeYear: boolean = true, timeZone: string = 'UTC') => {
  const date = numeric ? new Date(numeric) : undefined;
  const dateOptions: any = { 
    year: includeYear ? 'numeric' : undefined, 
    month: 'short', 
    day: 'numeric', 
    timeZone: timeZone
  };
  return date ? date.toLocaleDateString("en-US", dateOptions) : '';
}

// Create the new method
export const humanizeDateRange = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // If the dates are in the same month and year
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${numericDateToText(start, false)}-${endDate.getDate()}`;
  }

  // If the dates are in different months or years
  return `${numericDateToText(start, false)}-${numericDateToText(end, false)}`;
}

