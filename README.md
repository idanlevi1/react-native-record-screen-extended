# react-native-record-screen-extended

A screen record module for React Native with enhanced MediaProjectionConfig support for Android 14+.

## 🆕 What's New in Extended Version?

> **Enhanced Android 14+ Support**: This fork adds a new `startRecordingEntireScreen()` method that uses Android's `MediaProjectionConfig.createConfigForDefaultDisplay()` API to **block the "Single app" recording option** on Android 14+, forcing entire screen recording for security and compliance requirements.

### Key Differences from Original Package

| Feature | Original Package | **Extended Package** ✨ |
|---------|-----------------|----------------------|
| Basic screen recording | ✅ `startRecording()` | ✅ `startRecording()` (same behavior) |
| "Single app" option (Android 14+) | ✅ Always allowed | ✅ **Choice**: Allow OR Block |
| Force entire screen recording | ❌ Not possible | ✅ **New: `startRecordingEntireScreen()`** |
| iOS Support | ✅ | ✅ (no changes) |
| Backward Compatible | - | ✅ **100% compatible** |

**Use Case**: Perfect for security applications, compliance requirements, and ensuring consistent recording behavior across Android versions.

---

- Support iOS >= 11.0 (Simulator is not work)

- Support Android
  - minSdkVersion = 26
  - compileSdkVersion = 34
  - targetSdkVersion = 34
  - use [HBRecorder](https://github.com/HBiSoft/HBRecorder)

## Installation

```sh
npm install react-native-record-screen-extended
```

### iOS

1. Add the permission strings to your Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>Please allow use of camera</string>
<!-- If you intend to use the microphone -->
<key>NSMicrophoneUsageDescription</key>
<string>Please allow use of microphone</string>
```

2. pod install

```sh
npx pod-install
```

3. Add ReplayKit.framework at Link Binary With Libraries

![Add ReplayKit.framework at Link Binary With Libraries](https://user-images.githubusercontent.com/4530616/257236753-e3555d2f-53a5-4ffd-87eb-db1691d0552d.png)

### Android

1. Add the permissions to your AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<!-- If you intend to use the microphone -->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

## Usage

### Recording full screen

```js
import RecordScreen, { RecordingResult } from 'react-native-record-screen-extended';

// recording start
const res = RecordScreen.startRecording().catch((error) => console.error(error));
if (res === RecordingResult.PermissionError) {
  // user denies access
}

// recording stop
const res = await RecordScreen.stopRecording().catch((error) =>
  console.warn(error)
);
if (res) {
  const url = res.result.outputURL;
}
```

### Setting microphone

default true.

```js
// mic off
RecordScreen.startRecording({ mic: false }).catch((error) =>
  console.error(error)
);

// recording stop
const res = await RecordScreen.stopRecording().catch((error) =>
  console.warn(error)
);
if (res) {
  const url = res.result.outputURL;
}
```

### Adjusting bitrate / frame rate

```js
RecordScreen.startRecording({
  bitrate: 1024000, // default 236390400
  fps: 24, // default 60
})
```

### Clean Sandbox

```js
RecordScreen.clean();
```

## 🆕 Enhanced Screen Recording (Android 14+)

### New Method: `startRecordingEntireScreen()`

```javascript
import RecordScreen from 'react-native-record-screen-extended';

// Force entire screen recording (blocks "Single app" option)
await RecordScreen.startRecordingEntireScreen({
  fps: 30,
  bitrate: 1000000,
  mic: true
});
```

### Platform Behavior
- **Android 14+**: Uses MediaProjectionConfig to block "Single app" recording
- **Android 13-**: Falls back to regular behavior  
- **iOS**: Uses regular startRecording() (no "Single app" option exists)

### Migration Guide
- **Existing code**: No changes needed, `startRecording()` works as before
- **New feature**: Use `startRecordingEntireScreen()` when you need to enforce full screen recording

### Use Cases
- Security applications requiring full context
- Compliance and audit requirements
- Consistent UX across Android versions

## License

MIT
