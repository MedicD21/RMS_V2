import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import { Header } from "@/components/layout/Header";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { MetricBar } from "@/components/ui/MetricBar";

export function CompareScansScreen() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { spaces } = useSpacesStore();

  const space = spaces.find((s) => s.id === spaceId);
  const scans = space?.scans ?? [];

  const [leftIdx, setLeftIdx] = useState(Math.max(0, scans.length - 2));
  const [rightIdx, setRightIdx] = useState(scans.length - 1);

  const leftScan = scans[leftIdx];
  const rightScan = scans[rightIdx];

  if (!space || scans.length < 2) {
    return (
      <div
        className='flex items-center justify-center h-full'
        style={{ background: "var(--bg)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>
          Need at least 2 scans to compare.
        </p>
      </div>
    );
  }

  const scoreDelta =
    rightScan && leftScan ? rightScan.score - leftScan.score : 0;
  const deltaColor =
    scoreDelta > 0
      ? "var(--score-high)"
      : scoreDelta < 0
        ? "var(--score-low)"
        : "var(--text-secondary)";

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const allMetricLabels = leftScan?.breakdownMetrics.map((m) => m.label) ?? [];

  return (
    <div className='flex flex-col h-full'>
      <Header onBack={() => navigate(-1)}>Compare Scans</Header>

      <div className='scroll-area flex-1 px-5 pb-6 space-y-5'>
        {/* Scan selectors */}
        <div className='grid grid-cols-2 gap-3'>
          {[
            { label: "Before", idx: leftIdx, setIdx: setLeftIdx },
            { label: "After", idx: rightIdx, setIdx: setRightIdx },
          ].map(({ label, idx, setIdx }) => (
            <div key={label}>
              <p
                className='text-xs font-semibold mb-1.5 text-center'
                style={{ color: "var(--text-muted)" }}
              >
                {label}
              </p>
              <select
                value={idx}
                onChange={(e) => setIdx(Number(e.target.value))}
                className='w-full px-3 py-2.5 rounded-xl text-sm font-medium outline-none'
                style={{
                  background: "var(--surface)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border)",
                }}
              >
                {scans.map((scan, i) => (
                  <option key={scan.id} value={i}>
                    {formatDate(scan.date)}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Score rings side by side */}
        <div
          className='rounded-3xl p-5'
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <div className='flex items-center justify-between'>
            {/* Left score */}
            <div className='flex flex-col items-center gap-2'>
              <ScoreRing score={leftScan?.score ?? 0} size='large' />
              <p
                className='text-xs text-center'
                style={{ color: "var(--text-muted)", maxWidth: 80 }}
              >
                {leftScan ? formatDate(leftScan.date) : "—"}
              </p>
            </div>

            {/* Delta */}
            <div className='flex flex-col items-center gap-1'>
              <span
                className='text-2xl font-extrabold'
                style={{ color: deltaColor }}
              >
                {scoreDelta > 0 ? `+${scoreDelta}` : scoreDelta}
              </span>
              <span
                className='text-xs font-medium'
                style={{ color: "var(--text-muted)" }}
              >
                pts
              </span>
            </div>

            {/* Right score */}
            <div className='flex flex-col items-center gap-2'>
              <ScoreRing score={rightScan?.score ?? 0} size='large' />
              <p
                className='text-xs text-center'
                style={{ color: "var(--text-muted)", maxWidth: 80 }}
              >
                {rightScan ? formatDate(rightScan.date) : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Metric bars side by side */}
        {allMetricLabels.length > 0 && (
          <div
            className='rounded-3xl p-5 space-y-5'
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className='font-bold text-base'
              style={{ color: "var(--text-primary)" }}
            >
              Metric Comparison
            </h2>
            {allMetricLabels.map((label) => {
              const lScore =
                leftScan?.breakdownMetrics.find((m) => m.label === label)
                  ?.score ?? 0;
              const rScore =
                rightScan?.breakdownMetrics.find((m) => m.label === label)
                  ?.score ?? 0;
              const delta = rScore - lScore;
              const deltaC =
                delta > 0
                  ? "var(--score-high)"
                  : delta < 0
                    ? "var(--score-low)"
                    : "var(--text-muted)";

              return (
                <div key={label} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span
                      className='text-sm font-semibold'
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {label}
                    </span>
                    <span
                      className='text-xs font-bold'
                      style={{ color: deltaC }}
                    >
                      {delta > 0 ? `+${delta}` : delta !== 0 ? delta : "—"}
                    </span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <MetricBar label='' score={lScore} />
                    <MetricBar label='' score={rScore} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
