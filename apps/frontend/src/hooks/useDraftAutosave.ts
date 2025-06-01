import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface DraftData {
  heading: string;
  noteBody: string;
  transcribedText: string;
}

export function useDraftAutosave({
  formData,
  voiceData,
  setFormData,
  setVoiceData,
  storageKey = "note-draft",
  delay = 1000,
  toastDelay = 5000,
}: {
  formData: { heading: string; noteBody: string };
  voiceData: { transcribedText: string };
  setFormData: React.Dispatch<
    React.SetStateAction<{
      heading: string;
      noteBody: string;
      image: File | null;
    }>
  >;
  setVoiceData: React.Dispatch<
    React.SetStateAction<{ transcribedText: string; audioFile: File | null }>
  >;
  storageKey?: string;
  delay?: number;
  toastDelay?: number;
}) {
  const toastTimer = useRef<NodeJS.Timeout | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Track initial mount
  const [hasInteracted, setHasInteracted] = useState(false); // Track user interaction

  // Load draft on mount
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      try {
        const parsed: DraftData = JSON.parse(raw);
        setFormData(
          (prev: {
            heading: string;
            noteBody: string;
            image: File | null;
          }) => ({
            ...prev,
            heading: parsed.heading || "",
            noteBody: parsed.noteBody || "",
          })
        );
        setVoiceData(
          (prev: { transcribedText: string; audioFile: File | null }) => ({
            ...prev,
            transcribedText: parsed.transcribedText || "",
          })
        );
        toast.success("Draft restored");
      } catch (err) {
        console.warn("Failed to parse draft from localStorage", err);
      }
    }
    setIsMounted(true); // Mark as mounted after restoring draft
  }, [setFormData, setVoiceData, storageKey]);

  // Auto-save with debounce and debounce toast
  useEffect(() => {
    if (!isMounted || !hasInteracted) return; // Skip auto-save on initial mount or if no interaction

    const timeout = setTimeout(() => {
      const draft: DraftData = {
        heading: formData.heading,
        noteBody: formData.noteBody,
        transcribedText: voiceData.transcribedText,
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));

      // Show toast once per toastDelay window
      if (!toastTimer.current) {
        toast("Draft saved");
        toastTimer.current = setTimeout(() => {
          toastTimer.current = null;
        }, toastDelay);
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [
    formData.heading,
    formData.noteBody,
    voiceData.transcribedText,
    delay,
    toastDelay,
    storageKey,
    isMounted,
    hasInteracted, // Add hasInteracted to dependencies
  ]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    toast("Draft cleared");
  }, [storageKey]);

  const markInteraction = useCallback(() => {
    setHasInteracted(true); // Mark user interaction
  }, []);

  return { clearDraft, markInteraction };
}
