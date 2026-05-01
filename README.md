# react-native-record-screen-extended

[![npm version](https://badge.fury.io/js/react-native-record-screen-extended.svg)](https://badge.fury.io/js/react-native-record-screen-extended)
[![npm downloads](https://img.shields.io/npm/dm/react-native-record-screen-extended.svg)](https://www.npmjs.com/package/react-native-record-screen-extended)
[![license](https://img.shields.io/npm/l/react-native-record-screen-extended.svg)](https://github.com/idanlevi1/react-native-record-screen-extended/blob/master/LICENSE)

Screen recording for React Native with **Android 14+ MediaProjectionConfig** support.

Drop-in replacement for `react-native-record-screen` — 100% backward compatible, with a new `startRecordingEntireScreen()` method that blocks the "Single app" recording option on Android 14+.

## Why Extended?

Android 14 introduced a system dialog letting users choose "Single app" recording instead of full screen. This breaks use cases that require capturing the entire screen (security, compliance, screen sharing).

`startRecordingEntireScreen()` uses `MediaProjectionConfig.createConfigForDefaultDisplay()` to enforce full-screen recording.

| | Original | **Extended** |
|---|----------|-------------|
| Basic recording | `startRecording()` | `startRecording()` |
| "Single app" option (Android 14+) | Always shown | **Block or allow** |
| Force entire screen | Not possible | `startRecordingEntireScreen()` |
| iOS | ReplayKit | ReplayKit (same) |
| Backward compatible | — | 100% |

## Requirements

- iOS >= 11.0 (Simulator not supported)
- Android: minSdkVersion 26, compileSdkVersion 34

## Installation

```sh
npm install react-native-record-screen-extended
```

### iOS

Add permissions to `Info.plist`:

```xml
<key>NSCameraUsageDescription</key>
<string>Please allow use of camera</string>
<key>NSMicrophoneUsageDescription</key>
<string>Please allow use of microphone</string>
```

Then install pods and add `ReplayKit.framework` at **Link Binary With Libraries**.

```sh
npx pod-install
```

### Android

Add permissions to `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Usage

### Basic Recording

```js
import RecordScreen, { RecordingResult } from 'react-native-record-screen-extended';

// Start
const res = RecordScreen.startRecording().catch((error) => console.error(error));
if (res === RecordingResult.PermissionError) {
  // user denied access
}

// Stop
const res = await RecordScreen.stopRecording().catch((error) => console.warn(error));
if (res) {
  const url = res.result.outputURL;
}
```

### Entire Screen Recording (Android 14+)

```js
// Blocks "Single app" option — forces full screen capture
await RecordScreen.startRecordingEntireScreen({
  fps: 30,
  bitrate: 1000000,
  mic: true,
});

// Stop (same as basic)
const res = await RecordScreen.stopRecording();
```

**Platform behavior:**
- **Android 14+** — uses MediaProjectionConfig to block single-app recording
- **Android 13 and below** — falls back to regular behavior
- **iOS** — uses regular startRecording() (no single-app option exists on iOS)

### Options

```js
RecordScreen.startRecording({
  mic: false,            // default: true
  bitrate: 1024000,      // default: 236390400
  fps: 24,               // default: 60
});
```

### Clean Sandbox

```js
RecordScreen.clean();
```

## Migration from react-native-record-screen

1. `npm uninstall react-native-record-screen`
2. `npm install react-native-record-screen-extended`
3. Update imports: `from 'react-native-record-screen'` → `from 'react-native-record-screen-extended'`
4. Existing code works as-is. Use `startRecordingEntireScreen()` where needed.

## License

MIT
