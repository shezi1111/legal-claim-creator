"use client";

import { useState, useRef, useCallback, KeyboardEvent } from "react";
import { SendHorizontal, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = "Type or speak your message...",
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4',
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType,
        });

        // Transcribe with Whisper
        await transcribeAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to use voice input.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);

    try {
      const formData = new FormData();
      const extension = audioBlob.type.includes('webm') ? 'webm' : 'mp4';
      formData.append("audio", audioBlob, `recording.${extension}`);

      const res = await fetch("/api/voice", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Transcription failed");

      const data = await res.json();
      if (data.text) {
        // Append transcribed text to current input
        setValue((prev) => {
          const newValue = prev ? `${prev} ${data.text}` : data.text;
          // Adjust textarea height after setting value
          setTimeout(adjustHeight, 0);
          return newValue;
        });
      }
    } catch (err) {
      console.error("Transcription error:", err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="px-4 py-3 bg-white border-t border-border">
      <div className="flex items-end gap-2 max-w-4xl mx-auto">
        {/* Voice Button */}
        <button
          onClick={toggleRecording}
          disabled={disabled || isTranscribing}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-all flex-shrink-0",
            isRecording
              ? "bg-danger text-white animate-pulse"
              : isTranscribing
              ? "bg-accent/10 text-accent"
              : "bg-surface text-text-light hover:bg-primary/10 hover:text-primary border border-border"
          )}
          aria-label={isRecording ? "Stop recording" : "Start voice input"}
        >
          {isTranscribing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </button>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
          placeholder={isRecording ? "Listening... speak now" : isTranscribing ? "Transcribing..." : placeholder}
          disabled={disabled || isRecording}
          rows={1}
          className={cn(
            "flex-1 resize-none rounded-xl border border-border px-4 py-2.5 text-sm text-text placeholder:text-text-light",
            "focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            isRecording && "border-danger/30 bg-danger/5 placeholder:text-danger/60",
            "transition-colors"
          )}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim() || isRecording}
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-xl transition-colors flex-shrink-0",
            value.trim() && !disabled && !isRecording
              ? "bg-primary text-white hover:bg-primary-light"
              : "bg-border text-text-light cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4" />
        </button>
      </div>
      <p className="text-[10px] text-text-light/60 text-center mt-1.5">
        {isRecording
          ? "Recording... tap the microphone to stop"
          : "Tap the microphone to speak in any language, or type your message"
        }
      </p>
    </div>
  );
}
