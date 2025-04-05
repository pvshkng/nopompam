interface ArrowRightIconProps {
  className?: string;
  color?: string;
}

export function ArrowRightIcon(props: ArrowRightIconProps) {
  const { className, color = "black" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9h6V5l7 7-7 7v-4H6V9z" />
    </svg>
  );
}
