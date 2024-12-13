import { Audio } from "expo-av";
import { useState } from "react";
import SpeechToText from "./speech2Text";

const useMainBackend = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcription, setTranscription] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== "granted") {
        console.log("Requesting permission...");
        await requestPermission();
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recordingOptions = {
        android: {
          extension: ".wav",
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: ".wav",
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
      };

      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      const { sound } = await Audio.Sound.createAsync({ uri });
      await sound.playAsync();

      const result = await transcribeAudio(uri);
      setTranscription(result.transcription);
      setIsProcessing(result.isProcessing);
      console.log("Transcription:", result.transcription);
    } catch (err) {
      console.error("Failed to stop recording or play audio", err);
    }
  };

  const transcribeAudio = async (uri: string) => {
    return SpeechToText(uri);
  };

  return {
    startRecording,
    stopRecording,
    recording,
    transcription,
    isProcessing,
  };
};

export default useMainBackend;