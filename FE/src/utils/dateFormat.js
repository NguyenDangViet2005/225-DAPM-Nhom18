/**
 * Define formatDate utility function
 * @param {string | Date} date - ISO string or Date object
 * @param {string} format - Format pattern: 'DD/MM/YYYY', 'DD/MM/YYYY HH:mm:ss', 'HH:mm:ss'
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = "DD/MM/YYYY") => {
  if (!date) return "—";

  let dateObj;

  // Handle string ISO format or Date object
  if (typeof date === "string") {
    dateObj = new Date(date);
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    return "—";
  }

  // Check if date is valid
  if (isNaN(dateObj.getTime())) {
    return "—";
  }

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");
  const seconds = String(dateObj.getSeconds()).padStart(2, "0");

  const patterns = {
    "DD/MM/YYYY": `${day}/${month}/${year}`,
    "DD/MM/YYYY HH:mm:ss": `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`,
    "DD/MM/YYYY HH:mm": `${day}/${month}/${year} ${hours}:${minutes}`,
    "HH:mm:ss": `${hours}:${minutes}:${seconds}`,
    "HH:mm": `${hours}:${minutes}`,
    "YYYY-MM-DD": `${year}-${month}-${day}`,
  };

  return patterns[format] || `${day}/${month}/${year}`;
};

export default formatDate;
