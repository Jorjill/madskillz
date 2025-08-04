// Simple event system for triggering summary updates
class SummaryEventEmitter {
  private listeners: Array<() => void> = [];

  // Subscribe to summary refresh events
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Trigger summary refresh
  triggerRefresh() {
    console.log('Triggering summary refresh...');
    this.listeners.forEach(callback => callback());
  }
}

// Export singleton instance
export const summaryEvents = new SummaryEventEmitter();
