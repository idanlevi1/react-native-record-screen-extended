import { NativeModules, Dimensions, Platform } from 'react-native';

export const RecordingResult = {
  Started: 'started',
  PermissionError: 'permission_error',
} as const;

export type RecordingStartResponse =
  (typeof RecordingResult)[keyof typeof RecordingResult];

export type RecordScreenConfigType = {
  fps?: number;
  bitrate?: number;
  mic?: boolean;
};

export type RecordingSuccessResponse = {
  status: 'success';
  result: {
    outputURL: string;
  };
};

export type RecordingErrorResponse = {
  status: 'error';
  result: unknown;
};

export type RecordingResponse =
  | RecordingSuccessResponse
  | RecordingErrorResponse;

type RecordScreenNativeModule = {
  setup(
    config: RecordScreenConfigType & { width: number; height: number }
  ): void;
  startRecording(): Promise<RecordingStartResponse>;
  startRecordingEntireScreen(): Promise<RecordingStartResponse>;
  stopRecording(): Promise<RecordingResponse>;
  clean(): Promise<string>;
};

const { RecordScreen } = NativeModules;

const RS = RecordScreen as RecordScreenNativeModule;

class ReactNativeRecordScreenClass {
  private setup(config: RecordScreenConfigType = {}): void {
    const { width, height } = Dimensions.get('window');
    RS.setup({
      mic: true,
      width,
      height,
      fps: 60,
      bitrate: 1920 * 1080 * 144,
      ...config,
    });
  }

  startRecording(config: RecordScreenConfigType = {}) {
    this.setup(config);
    return RS.startRecording();
  }

  /**
   * Start recording entire screen only (Android 14+ / API level 34+)
   * 
   * Uses MediaProjectionConfig.createConfigForDefaultDisplay() to block "Single app" recording option.
   * On Android 13 and below (API < 34), falls back to regular startRecording() behavior.
   * On iOS, always uses regular startRecording() as iOS doesn't have "Single app" option.
   * 
   * @param config Recording configuration options
   * @returns Promise resolving to recording start response
   */
  startRecordingEntireScreen(config: RecordScreenConfigType = {}) {
    this.setup(config);
    if (Platform.OS === 'android' && Platform.Version >= 34) {
      // Android 14+ (API 34+): Use new MediaProjectionConfig API
      return RS.startRecordingEntireScreen();
    } else {
      // Android 13- or iOS: Use regular startRecording
      return RS.startRecording();
    }
  }

  stopRecording() {
    return RS.stopRecording();
  }

  clean() {
    return RS.clean();
  }
}

const ReactNativeRecordScreen = new ReactNativeRecordScreenClass();

export default ReactNativeRecordScreen;
