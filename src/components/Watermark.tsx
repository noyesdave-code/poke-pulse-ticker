const Watermark = () => {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
      aria-hidden="true"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='11' fill='rgba(255,255,255,0.018)' transform='rotate(-30 150 100)'%3E© PGVA Ventures LLC%3C/text%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export default Watermark;
