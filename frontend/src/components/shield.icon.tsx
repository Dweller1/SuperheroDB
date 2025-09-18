export const ShieldIcon = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="group-hover:rotate-12 transition-transform duration-500"
  >
    <path
      d="M20 2L2 8V18C2 28 10 35 20 38C30 35 38 28 38 18V8L20 2Z"
      fill="url(#gradient)"
      stroke="url(#gradientStroke)"
      strokeWidth="2"
    />
    <path
      d="M14 20L18 24L26 16"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:scale-110 transition-transform duration-300"
    />

    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="100%" stopColor="#8B5CF6" />
      </linearGradient>
      <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2563EB" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);
