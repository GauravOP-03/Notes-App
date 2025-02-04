import React, { useState, useRef, useEffect, MouseEvent } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square } from "lucide-react";

// Define the props type for the component
interface VoiceRecorderProps {
  onDataChange: (data: {
    transcribedText: string;
    audioFile: File | null;
  }) => void;
}

// Minimal type declarations for the Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((this: SpeechRecognition, event: SpeechRecognitionEvent) => void)
    | null;
  onerror:
    | ((this: SpeechRecognition, event: SpeechRecognitionErrorEvent) => void)
    | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult | null;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

// Declare SpeechRecognition on the global scope (for browsers that support webkitSpeechRecognition)
declare global {
  interface Window {
    webkitSpeechRecognition: {
      prototype: SpeechRecognition;
      new (): SpeechRecognition;
    };
  }
  // Also declare SpeechRecognition in the global scope to support browsers that use the unprefixed version
  // eslint-disable-next-line no-var
  var SpeechRecognition: {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
  };
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onDataChange }) => {
  const [transcribedText, setTranscribedText] = useState<string>("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [timer, setTimer] = useState<number | null>(null);

  const { startRecording, stopRecording, mediaBlobUrl, status } =
    useReactMediaRecorder({ audio: true });

  // Initialize the speech recognition
  useEffect(() => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.log("Web Speech API is not supported");
      return;
    }

    const SpeechRecognitionConstructor =
      window.webkitSpeechRecognition || SpeechRecognition;
    const recognition = new SpeechRecognitionConstructor();
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscribedText(text);
      // Send the transcribed text immediately (audioFile will be provided later)
      onDataChange({ transcribedText: text, audioFile: null });
    };

    recognition.onerror = (e: SpeechRecognitionErrorEvent) =>
      console.error("Speech recognition error:", e.error);

    recognitionRef.current = recognition;

    // Cleanup when unmounting
    return () => {
      recognition.stop();
    };
  }, [onDataChange]);

  // When recording stops and mediaBlobUrl is available, fetch the blob and call onDataChange with the audio file.
  useEffect(() => {
    if (status === "stopped" && mediaBlobUrl) {
      (async () => {
        try {
          const audioBlob: Blob = await fetch(mediaBlobUrl).then((r) =>
            r.blob()
          );
          const fileExtension = audioBlob.type.split("/")[1] || "wav";
          const audioFile = new File([audioBlob], `voice.${fileExtension}`, {
            type: audioBlob.type,
          });
          onDataChange({ transcribedText, audioFile });
        } catch (error) {
          console.error("Failed to fetch audio blob:", error);
          onDataChange({ transcribedText, audioFile: null });
        }
      })();
    }
  }, [status, mediaBlobUrl, transcribedText, onDataChange]);

  const handleStart = (e?: MouseEvent<HTMLButtonElement>): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    startRecording();
    setTranscribedText("");
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }

    // Set a 1-minute timer to automatically stop recording
    const recordingTimer = window.setTimeout(() => {
      handleStop();
    }, 60000);
    setTimer(recordingTimer);
  };

  const handleStop = (e?: MouseEvent<HTMLButtonElement>): void => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    stopRecording();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    // Clear the timer if the user manually stops before 1 minute
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }
    // The effect above will pick up the updated mediaBlobUrl and call onDataChange with the audio file.
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Voice Recorder &amp; Transcriber</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center gap-2">
          <Button
            onClick={status === "recording" ? handleStop : handleStart}
            variant={status === "recording" ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {status === "recording" ? (
              <>
                <Square className="w-4 h-4" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Start Recording
              </>
            )}
          </Button>
        </div>

        {transcribedText && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Transcribed Text:</h3>
            <p className="text-gray-700">{transcribedText}</p>
          </div>
        )}

        {mediaBlobUrl && (
          <div className="mt-4">
            <h3 className="text-md font-semibold mb-2">Recorded Audio:</h3>
            <audio controls src={mediaBlobUrl} className="w-full"></audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceRecorder;
