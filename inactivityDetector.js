// inactivityDetector.js

/**
 * InactivityDetector class
 * 
 * This class provides functionality to detect user inactivity, page visibility changes,
 * and monitor configuration changes. It can be used to implement warning systems or
 * auto-logout features in web applications.
 */
class InactivityDetector {
  /**
   * Create an InactivityDetector instance.
   * @param {Object} options - Configuration options
   * @param {number} [options.warningThreshold=5] - Inactivity time (in seconds) before triggering a warning
   * @param {Function} [options.onInactive] - Callback function when user becomes inactive
   * @param {Function} [options.onActive] - Callback function when user becomes active again
   * @param {Function} [options.onMonitorChange] - Callback function when monitor configuration changes
   */
  constructor(options = {}) {
      // Merge default options with provided options
      this.options = {
          warningThreshold: 5, // Default 5 seconds
          onInactive: () => {},
          onActive: () => {},
          onMonitorChange: () => {},
          ...options
      };

      // Initialize tracking variables
      this.lastActiveTime = new Date();
      this.isActive = true;
      this.lastScreens = `${window.screen.width}x${window.screen.height}`;

      // Bind methods to ensure correct 'this' context when used as event listeners
      this.checkActivity = this.checkActivity.bind(this);
      this.resetTimer = this.resetTimer.bind(this);
      this.checkMonitorChange = this.checkMonitorChange.bind(this);
  }

  /**
   * Initialize the detector by setting up event listeners and intervals.
   */
  init() {
      // Set up activity listeners for various user interactions
      ['mousedown', 'keydown', 'touchstart', 'mousemove'].forEach(eventType => {
          document.addEventListener(eventType, this.resetTimer);
      });

      // Set up visibility change listener to detect when the page is hidden/shown
      document.addEventListener('visibilitychange', this.checkActivity);

      // Start the inactivity timer, checking every second
      this.activityInterval = setInterval(this.checkActivity, 1000);

      // Start the monitor change checker, checking every second
      this.monitorInterval = setInterval(this.checkMonitorChange, 1000);
  }

  /**
   * Clean up by removing event listeners and clearing intervals.
   */
  destroy() {
      // Remove all event listeners
      ['mousedown', 'keydown', 'touchstart', 'mousemove'].forEach(eventType => {
          document.removeEventListener(eventType, this.resetTimer);
      });
      document.removeEventListener('visibilitychange', this.checkActivity);

      // Clear intervals
      clearInterval(this.activityInterval);
      clearInterval(this.monitorInterval);
  }

  /**
   * Reset the inactivity timer when user activity is detected.
   */
  resetTimer() {
      this.lastActiveTime = new Date();
      if (!this.isActive) {
          this.isActive = true;
          this.options.onActive(); // Trigger the onActive callback
      }
  }

  /**
   * Check for user inactivity or page visibility changes.
   */
  checkActivity() {
      if (document.hidden) {
          // Page is not visible, consider as inactive
          this.handleInactivity();
      } else {
          const currentTime = new Date();
          const timeDiff = (currentTime - this.lastActiveTime) / 1000; // Convert to seconds

          if (timeDiff >= this.options.warningThreshold) {
              this.handleInactivity(timeDiff);
          }
      }
  }

  /**
   * Handle inactivity by triggering the onInactive callback.
   * @param {number} timeDiff - Time difference in seconds since last activity
   */
  handleInactivity(timeDiff) {
      if (this.isActive) {
          this.isActive = false;
          const inactiveStr = document.hidden ? "Page is hidden" : "User inactive";
          this.options.onInactive(inactiveStr, Math.floor(timeDiff));
      }
  }

  /**
   * Check for changes in monitor configuration (e.g., resolution changes).
   */
  checkMonitorChange() {
      const currentScreens = `${window.screen.width}x${window.screen.height}`;
      if (currentScreens !== this.lastScreens) {
          this.options.onMonitorChange(this.lastScreens, currentScreens);
          this.lastScreens = currentScreens;
      }
  }
}

// Expose InactivityDetector to the global scope if in a browser environment
if (typeof window !== 'undefined') {
  window.InactivityDetector = InactivityDetector;
}