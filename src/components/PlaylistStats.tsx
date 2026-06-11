import { useEffect, useState } from "react";
import { usePlaylistState } from "../hooks/usePlaylistState";

type FilterType = "all" | "completed" | "important" | "revisit";

interface PlaylistStatsProps {
  playlistId: string;
  discoveredVideoIds: string[];
  declaredTotal?: number;
}

export const PlaylistStats = ({
  playlistId,
  discoveredVideoIds,
  declaredTotal,
}: PlaylistStatsProps): React.JSX.Element => {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const playlist = usePlaylistState(playlistId);
  const persistedVideos = Object.values(playlist.videos);
  const knownIds = new Set([...Object.keys(playlist.videos), ...discoveredVideoIds]);
  const total = Math.max(declaredTotal ?? 0, knownIds.size);
  const completed = persistedVideos.filter((video) => video.completed).length;
  const important = persistedVideos.filter((video) => video.important).length;
  const revisit = persistedVideos.filter((video) => video.revisit).length;

  useEffect(() => {
    document.body.dataset.progressTubeActiveFilter = activeFilter;
    return () => {
      delete document.body.dataset.progressTubeActiveFilter;
    };
  }, [activeFilter]);

  const chips: { type: FilterType; label: string }[] = [
    { type: "all", label: "All" },
    { type: "completed", label: "Completed" },
    { type: "important", label: "Important" },
    { type: "revisit", label: "Revisit" },
  ];

  return (
    <div className="progress-tube-header-container">
      <div className="progress-tube-filters" aria-label="Playlist progress filters">
        {chips.map((chip) => (
          <button
            key={chip.type}
            type="button"
            className={`progress-tube-chip ${activeFilter === chip.type ? "active" : ""}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setActiveFilter(chip.type);
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <div className="progress-tube-stats-summary">
        <span>{total} videos</span>
        <span className="separator">•</span>
        <span>{completed} completed</span>
        <span className="separator">•</span>
        <span>{important} important</span>
        <span className="separator">•</span>
        <span>{revisit} revisit</span>
      </div>
    </div>
  );
};
