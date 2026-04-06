const Watermark = () => {
  return (
    <>
      {/* Primary watermark layer */}
      <div
        data-demo-hide
        className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Ctext x='50%25' y='30%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='10' fill='rgba(255,255,255,0.015)' transform='rotate(-30 200 125)'%3E© 2026 PGVA Ventures LLC%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='8' fill='rgba(255,255,255,0.012)' transform='rotate(-30 200 125)'%3EbackgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250'%3E%3Ctext x='50%25' y='30%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='10' fill='rgba(255,255,255,0.015)' transform='rotate(-30 200 125)'%3E© 2026 PGVA Ventures LLC%3C/text%3E%3Ctext x='50%25' y='55%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='8' fill='rgba(255,255,255,0.012)' transform='rotate(-30 200 125)'%3Epoke-pulse-ticker.lovable.app · All Rights Reserved · Patent Pending%3C/text%3E%3C/svg%3E")`,%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
      {/* Secondary forensic watermark — offset pattern for screenshot tracing */}
      <div
        data-demo-hide
        className="pointer-events-none fixed inset-0 z-[9998] overflow-hidden select-none"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='300'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='monospace' font-size='7' fill='rgba(255,255,255,0.008)' transform='rotate(-45 250 150)'%3EPROTECTED · DMCA · CFAA · DTSA%3C/text%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />
    </>
  );
};

export default Watermark;
