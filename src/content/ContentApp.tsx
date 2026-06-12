import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { PlaylistStats } from "../components/PlaylistStats";
import { VideoControls } from "../components/VideoControls";
import { portalRegistry } from "./portalRegistry";

export const ContentApp = (): React.JSX.Element => {
  const targets = useSyncExternalStore(portalRegistry.subscribe, portalRegistry.getSnapshot);

  return (
    <>
      {targets.map((target) => {
        if (target.kind === "video" && target.videoId && target.rowElement) {
          return createPortal(
            <VideoControls
              playlistId={target.playlistId}
              videoId={target.videoId}
              rowElement={target.rowElement}
            />,
            target.element,
            target.key,
          );
        }

        if (target.kind === "stats") {
          const videoIds = targets
            .filter(
              (candidate) =>
                candidate.kind === "video" &&
                candidate.playlistId === target.playlistId &&
                candidate.videoId,
            )
            .map((candidate) => candidate.videoId as string);
          return createPortal(
            <PlaylistStats
              playlistId={target.playlistId}
              discoveredVideoIds={videoIds}
              {...(target.totalVideos === undefined ? {} : { declaredTotal: target.totalVideos })}
            />,
            target.element,
            target.key,
          );
        }

        return null;
      })}
    </>
  );
};
