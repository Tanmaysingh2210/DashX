export const retryOnce = async (fn) => {
  try {
    return await fn();
  } catch (err) {
    // retry once
    return await fn();
  }
};
