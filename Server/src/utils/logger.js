export const logError = (message, meta = {}) => {
  console.error(
    JSON.stringify({
      level: 'error',
      message,
      meta,
      timestamp: new Date().toISOString()
    })
  );
};
