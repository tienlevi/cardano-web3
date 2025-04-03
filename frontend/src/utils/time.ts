export const getTimes = (timestamp: number) => {
  // Create a Date object
  const date = new Date(timestamp);

  // Or, for a custom format:
  const year = date.getFullYear();
  const month = String(date.getMonth()).padStart(2, "0"); // Months are 0-based, so +1
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  console.log(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
};
