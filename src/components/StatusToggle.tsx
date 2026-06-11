interface StatusToggleProps {
  active: boolean;
  type: "completed" | "important" | "revisit";
  onToggle: () => void;
}

export const StatusToggle = ({
  active,
  type,
  onToggle,
}: StatusToggleProps): React.JSX.Element => {
  const getLabel = (): string => {
    switch (type) {
      case "completed":
        return "Completed";
      case "important":
        return "Important";
      case "revisit":
        return "Revisit";
    }
  };

  const getAriaLabel = (): string => {
    const label = getLabel();
    return `${active ? "Unmark" : "Mark"} video as ${label.toLowerCase()}`;
  };

  const renderIcon = (): React.JSX.Element => {
    switch (type) {
      case "completed":
        // Checkmark icon (always stroke-based, colored green via CSS when active)
        return (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="progress-tube-svg"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case "important":
        // Bookmark icon (filled when active, outlined when inactive)
        return active ? (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
            className="progress-tube-svg"
          >
            <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="progress-tube-svg"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "revisit":
        // Refresh icon (filled when active, outlined when inactive)
        return active ? (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="currentColor"
            aria-hidden="true"
            className="progress-tube-svg"
          >
            <path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="progress-tube-svg"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <polyline points="3 3 3 8 8 8" />
          </svg>
        );
    }
  };

  return (
    <button
      type="button"
      className={`progress-tube-toggle ${type}`}
      aria-label={getAriaLabel()}
      aria-pressed={active}
      title={getLabel()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onToggle();
      }}
    >
      {renderIcon()}
    </button>
  );
};
