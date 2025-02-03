import React, { useState, useRef, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play } from "lucide-react";

const VoiceRecorder = ({ onDataChange }) => {
  const [transcribedText, setTranscribedText] = useState("");
  const recognitionRef = useRef(null);
  const [timer, setTimer] = useState(null); // Store timer reference

  const { startRecording, stopRecording, mediaBlobUrl, status, mediaBlob } =
    useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      console.log("Web Speech API is not supported");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.continuous = true;

    recognition.onresult = (e) => {
      let text = "";
      for (let i = 0; i < e.results.length; i++) {
        text += e.results[i][0].transcript;
      }
      setTranscribedText(text);
      onDataChange({ transcribedText, audioUrl: mediaBlobUrl });
    };

    recognition.onerror = (e) => console.error("Speech error:", e.error);

    // recognition.onend = () => setTranscribedText("");

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [mediaBlobUrl]);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startRecording();
    setTranscribedText("");
    if (recognitionRef.current) recognitionRef.current.start();

    // Set a 1-minute timer to automatically stop recording
    const recordingTimer = setTimeout(() => {
      handleStop();
    }, 60000); // 60000 ms = 1 minute
    setTimer(recordingTimer); // Store timer reference
  };

  const handleStop = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    stopRecording();
    if (recognitionRef.current) recognitionRef.current.stop();

    // Clear the timer if the user manually stops the recording before 1 minute
    if (timer) {
      clearTimeout(timer);
      setTimer(null);
    }

    const audioFile = audioBlobToFile(mediaBlob, "audio.wav");
    onDataChange({ transcribedText: transcribedText, audioFile });
  };

  const audioBlobToFile = (blob, filename = "audio.wav") => {
    const file = new File([blob], filename, { type: "audio/wav" });
    return file;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle> Voice Recorder & Transcriber</CardTitle>
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
