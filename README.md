# Inactivity Detector

Inactivity Detector is a lightweight JavaScript library that helps you monitor user inactivity, tab changes, and monitor configuration changes. It's particularly useful for applications that require strict user attention, such as online exams or sensitive data entry forms.

## Features

- Detect user inactivity based on custom thresholds
- Monitor tab changes and window focus
- Detect monitor configuration changes
- Customizable callbacks for various events
- Easy integration with existing projects

## Installation

Simply include the `inactivityDetector.js` file in your HTML:

```html
<script src="path/to/inactivityDetector.js"></script>
```

## Usage

Here's a basic example of how to use the Inactivity Detector:

```html
<script src="path/to/inactivityDetector.js"></script>
<script>
const detector = new InactivityDetector({
    warningThreshold: 5, // 5 seconds
    onInactive: (inactiveStr, secondsInactive) => {
        console.log(`User inactive: ${inactiveStr} for ${secondsInactive} seconds`);
    },
    onActive: () => {
        console.log("User active again");
    },
    onMonitorChange: (lastScreens, currentScreens) => {
        console.log(`Monitor changed from ${lastScreens} to ${currentScreens}`);
    }
});

detector.init(); // Start detecting

// Later, when you want to stop detecting
detector.destroy();
</script>
```

## API Reference

### Constructor Options

- `warningThreshold`: Number of seconds before considering user as inactive (default: 5)
- `onInactive(inactiveStr, secondsInactive)`: Callback function when user becomes inactive
- `onActive()`: Callback function when user becomes active again
- `onMonitorChange(lastScreens, currentScreens)`: Callback function when monitor configuration changes

### Methods

- `init()`: Start the inactivity detector
- `destroy()`: Stop the inactivity detector and clean up event listeners

## Demo

Check out the `index.html` file in this repository for a live demo and more detailed usage examples.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.