export const fetchGitHubActivity = async username => {
  // TODO: replace with real API call later
  // For now, simulate minimal count
  return {
    commits: Math.floor(Math.random() * 5)
  };
};
