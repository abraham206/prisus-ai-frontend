export default function ProgressCircle({ percentage }) {
  const radius = 20;
  const strokewidth = 3;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  let color;

  if (percentage > 75 && percentage) {
    color = "rgb(11, 199, 96)";
  }

  if (percentage > 50 && percentage < 75) {
    color = "rgb(255, 196, 0)";
  }

  if (percentage < 50) {
    color = "rgb(248, 35, 70)";
  }

  return (
    <svg width={90} height={90}>
      <circle
        cx="45"
        cy="45"
        r={radius}
        stroke="#141821"
        strokeWidth={strokewidth}
        fill="none"
      />
      <circle
        cx="45"
        cy="45"
        r={radius}
        stroke={color}
        strokeWidth={strokewidth}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 45 45)"
      />
      <text
        x="45"
        y="50"
        textAnchor="middle"
        fill="white"
        fontSize="12"
        fontWeight="bold"
      >
        {percentage}%
      </text>
    </svg>
  );
}
