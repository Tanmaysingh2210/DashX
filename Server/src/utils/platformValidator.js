export const validateGitHubUrl = url => {
  try {
    const u = new URL(url);
    return (
      u.hostname === 'github.com' &&
      u.pathname.split('/').filter(Boolean).length === 1
    );
  } catch {
    return false;
  }
};

export const validateLeetCodeUrl = url => {
  try {
    const u = new URL(url);
    return (
      u.hostname.includes('leetcode.com') &&
      u.pathname.startsWith('/u/')
    );
  } catch {
    return false;
  }
};

export const extractUsername = url => {
  const u = new URL(url);
  return u.pathname.split('/').filter(Boolean).pop();
};
