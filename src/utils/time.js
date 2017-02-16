export const formatDate = time => new Date(time).toLocaleString();
export const formatElapsedTime = time => `${(time / (60 * 1000)).toFixed(2)}m`;
