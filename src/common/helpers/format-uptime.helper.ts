function formatUptime(seconds) {
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Helper function to pad single-digit numbers with a leading zero
  function pad(s) {
    return (s < 10 ? '0' : '') + s;
  }

  return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
}
export default formatUptime;
