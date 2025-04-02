export const formatDate = (dateString) => {
    if (!dateString) return "N/A";
  
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid Date";
  
    const day = date.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
        ? "rd"
        : "th";
  
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
  
    return `${day}${suffix} ${month} ${year}`;
  };
  