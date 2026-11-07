const paths = {
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
  external: <path d="M5 19 19 5M5 5h14v14" />,
  chevron: <path d="m9 5 7 7-7 7" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m16 16 5 5" />
    </>
  ),
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M4 8h16M4 16h16" />,
  heart: (
    <path d="M12 21S3 15.8 3 9.5a4.5 4.5 0 0 1 9-1 4.5 4.5 0 0 1 9 1C21 15.8 12 21 12 21Z" />
  ),
  check: <path d="m5 12 4 4L20 5" />,
  phone: (
    <path d="m6 3 4 5-3 3c2 4 4 6 7 7l3-3 4 3c-1 4-5 4-8 2C7 17 3 12 3 7c0-2 1-3 3-4Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  pin: (
    <>
      <path d="M19 10c0 6-7 11-7 11S5 16 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2" />
    </>
  ),
  zoom: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6M10 7v6m-3-3h6" />
    </>
  ),
  copy: (
    <>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V4H4v12h4" />
    </>
  ),
};
const Icon = ({ name, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...props}
  >
    {paths[name]}
  </svg>
);
export default Icon;
