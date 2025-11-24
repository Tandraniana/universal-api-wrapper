class APIClient {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.API_KEY;
    this.baseURL = config.baseURL || 'https://api.example.com/v1';
    this.cache = new Map();
    this.cacheTTL = config.cacheTTL || 300000; // 5 minutes default
    
    if (!this.apiKey) {
      throw new Error('API key is required. Provide via config or API_KEY environment variable.');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = options.method === 'GET' ? url : null;

    // Check cache for GET requests
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTTL) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    const config = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Cache successful GET responses
      if (cacheKey) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now()
        });
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Request failed: ${error.message}`);
      }
      throw new Error('Request failed: Unknown error occurred');
    }
  }

  clearCache() {
    this.cache.clear();
  }
}

export default APIClient;
