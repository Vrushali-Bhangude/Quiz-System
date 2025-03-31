// Theme management
export const themes = {
  current: 'light',
  
  init() {
    const savedTheme = localStorage.getItem('quizTheme') || 'light';
    this.set(savedTheme);
  },
  
  set(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quizTheme', theme);
    this.current = theme;
    this.updateThemeButton();
  },
  
  toggle() {
    const newTheme = this.current === 'light' ? 'dark' : 'light';
    this.set(newTheme);
  },
  
  updateThemeButton() {
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      themeBtn.innerHTML = this.current === 'light' ? '🌙' : '☀️';
      themeBtn.setAttribute('aria-label', `Switch to ${this.current === 'light' ? 'dark' : 'light'} mode`);
    }
  }
};

// Audio effects with error handling
export const audio = {
  sfx: {
    correct: '/assets/sfx/correct.mp3',
    wrong: '/assets/sfx/wrong.mp3',
    finish: '/assets/sfx/finish.mp3'
  },
  
  play(sound) {
    try {
      const audio = new Audio(this.sfx[sound]);
      audio.volume = 0.3;
      audio.play().catch(e => console.warn('Audio playback prevented:', e));
    } catch (error) {
      console.error('Audio error:', error);
    }
  },
  
  playCorrect() { this.play('correct'); },
  playWrong() { this.play('wrong'); },
  playFinish() { this.play('finish'); }
};

// API functions with enhanced error handling
const API_BASE = '/api';

export const api = {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed (${endpoint}):`, error);
      throw error;
    }
  },
  
  // Leaderboard functions
  leaderboard: {
    async get(quizId = 'popular') {
      try {
        return await this.request(`/leaderboard?quizId=${quizId}`);
      } catch {
        return []; // Return empty array as fallback
      }
    },
    
    async submit(quizId, username, score) {
      return this.request('/leaderboard', {
        method: 'POST',
        body: JSON.stringify({ quizId, username, score })
      });
    }
  },
  
  // Quiz functions
  quiz: {
    async getByCode(code) {
      return this.request(`/quizzes/code/${code}`);
    },
    
    async getPopular() {
      return this.request('/quizzes/popular');
    }
  },
  
  // AI Explanation
  async getExplanation(question) {
    return this.request('/explain', {
      method: 'POST',
      body: JSON.stringify({ question })
    });
  }
};

// WebSocket connection with reconnection logic
export const createSocket = (onMessage) => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const socket = new WebSocket(`${protocol}//${window.location.host}/ws`);
  
  socket.onopen = () => console.log('WebSocket connected');
  socket.onclose = () => {
    console.log('WebSocket disconnected - attempting reconnect...');
    setTimeout(() => createSocket(onMessage), 3000);
  };
  
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
};

// Utility functions
export const utils = {
  debounce(fn, delay) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  },
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  },
  
  shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }
};

// Initialize default theme when loaded
document.addEventListener('DOMContentLoaded', () => themes.init());