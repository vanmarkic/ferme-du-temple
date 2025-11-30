interface DirectionalArrowProps {
  direction: "down" | "right" | "down-right" | "curve";
  className?: string;
}

export const DirectionalArrow = ({
  direction,
  className = ""
}: DirectionalArrowProps) => {
  const paths = {
    down: "M12 5v14m0 0l-4-4m4 4l4-4",
    right: "M5 12h14m0 0l-4-4m4 4l-4 4",
    "down-right": "M5 5l14 14m0 0l-4-4m4 4l-4 4",
    curve: "M5 12c0 7 7 7 14 0"
  };

  return (
    <svg
      className={`w-8 h-8 stroke-magenta stroke-2 fill-none ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d={paths[direction]}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
