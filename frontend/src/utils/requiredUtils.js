

const formatDuration = (duration) => {
  const totalSeconds = Math.floor(duration); // Get total seconds from decimal

  if (totalSeconds < 60) {
    const formattedSeconds = totalSeconds.toString().padStart(2, '0'); // Format seconds
    return `0.${formattedSeconds}`; // Return formatted string as 0.ss
  }

  // For durations of 1 minute or more
  const minutes = Math.floor(totalSeconds / 60); // Get minutes
  const seconds = totalSeconds % 60; // Get remaining seconds

  // Format minutes and seconds
  const formattedSeconds = seconds.toString().padStart(2, '0'); // Format seconds

  return `${minutes}.${formattedSeconds}`; // Return formatted string as m.ss
};



const formatViews = (num) => {
  if (num >= 1000000000) {
    return Math.floor(num / 1000000000) + "B"; // No decimal places for billions
  } else if (num >= 1000000) {
    return Math.floor(num / 1000000) + "M"; // No decimal places for millions
  } else if (num >= 1000) {
    return Math.floor(num / 1000) + "k"; // No decimal places for thousands
  } else {
    return num.toString(); // For numbers below 1000, show the exact number
  }
};


export { formatViews , formatDuration };