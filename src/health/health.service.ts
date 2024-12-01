class HealthService {
  getHealth() {
    return {
      status: 'healthy',
      timestamp: new Date().toLocaleString(),
    };
  }
}

export const healthService = new HealthService();
