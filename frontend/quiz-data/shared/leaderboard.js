export const leaderboard = {
    async get(type) {
      try {
        const response = await fetch(`/api/leaderboard/${type}`);
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        return await response.json();
      } catch (error) {
        console.error('Leaderboard fetch error:', error);
        throw error; // Re-throw so join.js can handle it
      }
    }
  };