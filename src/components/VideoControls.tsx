import { useEffect, useState } from "react";
import { useVideoState } from "../hooks/useVideoState";
import { logError } from "../utils/logger";
import { StatusToggle } from "./StatusToggle";

interface VideoControlsProps {
  playlistId: string;
  videoId: string;
  rowElement: HTMLElement;
}

export const VideoControls = ({
  playlistId,
  videoId,
  rowElement,
}: VideoControlsProps): React.JSX.Element => {
  const [video, update] = useVideoState(playlistId, videoId);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (video.completed) rowElement.dataset.progressTubeCompleted = "true";
    else delete rowElement.dataset.progressTubeCompleted;

    if (video.important) rowElement.dataset.progressTubeImportant = "true";
    else delete rowElement.dataset.progressTubeImportant;

    if (video.revisit) rowElement.dataset.progressTubeRevisit = "true";
    else delete rowElement.dataset.progressTubeRevisit;

    const activeStatus = video.completed
      ? "completed"
      : video.important
      ? "important"
      : video.revisit
      ? "revisit"
      : undefined;

    if (activeStatus) {
      rowElement.dataset.progressTubeStatus = activeStatus;
    } else {
      delete rowElement.dataset.progressTubeStatus;
    }
  }, [rowElement, video.completed, video.important, video.revisit]);



  useEffect(
    () => () => {
      delete rowElement.dataset.progressTubeStatus;
      delete rowElement.dataset.progressTubeCompleted;
      delete rowElement.dataset.progressTubeImportant;
      delete rowElement.dataset.progressTubeRevisit;
    },
    [rowElement],
  );

  const toggle = async (field: "completed" | "important" | "revisit"): Promise<void> => {
    if (busy) return;
    setBusy(true);
    try {
      await update({ [field]: !video[field] });
    } catch (error: unknown) {
      logError(`Failed to toggle ${field}`, error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="progress-tube-controls"
      aria-label="Learning progress controls"
      aria-busy={busy}
      onClick={(event) => event.stopPropagation()}
    >
      <StatusToggle
        active={video.completed}
        type="completed"
        onToggle={() => void toggle("completed")}
      />
      <StatusToggle
        active={video.important}
        type="important"
        onToggle={() => void toggle("important")}
      />
      <StatusToggle
        active={video.revisit}
        type="revisit"
        onToggle={() => void toggle("revisit")}
      />
    </div>
  );
};
