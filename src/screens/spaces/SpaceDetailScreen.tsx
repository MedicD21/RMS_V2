import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { MetricBar } from "@/components/ui/MetricBar";
import { ProductCard } from "@/components/ui/ProductCard";
import { BeforeAfterToggle } from "@/components/ui/BeforeAfterToggle";
import { readPhotoAsDataUrl } from "@/hooks/useCamera";
import { ROOM_TYPE_LABELS } from "@/types";

export function SpaceDetailScreen() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { spaces, deleteSpace } = useSpacesStore();

  const space = spaces.find((s) => s.id === spaceId);
  const lastScan = space?.scans[space.scans.length - 1];

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!lastScan) return;
    readPhotoAsDataUrl(lastScan.photoUri).then(setPhotoUrl);
    if (lastScan.renderingUri) {
      readPhotoAsDataUrl(lastScan.renderingUri).then(setRenderUrl);
    }
  }, [lastScan]);

  if (!space) {
    return (
      <div
        className='flex items-center justify-center h-full'
        style={{ background: "var(--bg)" }}
      >
        <p style={{ color: "var(--text-secondary)" }}>Space not found.</p>
      </div>
    );
  }

  async function handleDelete() {
    await deleteSpace(space!.id);
    navigate("/spaces", { replace: true });
  }

  const scanDate = lastScan
    ? new Date(lastScan.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div
        className='flex items-center gap-3 px-5'
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + 30px)`,
          background: "var(--bg)",
        }}
      >
        <button
          onClick={() => navigate("/spaces")}
          className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60'
          style={{ background: "var(--surface)" }}
          aria-label='Back'
        >
          <svg width='18' height='18' viewBox='0 0 24 24' fill='none'>
            <path
              d='M15 18l-6-6 6-6'
              stroke='var(--text-primary)'
              strokeWidth='3'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <div className='flex-1 min-w-0'>
          <h1
            className='text-xl font-bold truncate'
            style={{ color: "var(--text-primary)" }}
          >
            {space.name}
          </h1>
          <p className='text-xs' style={{ color: "var(--text-secondary)" }}>
            {ROOM_TYPE_LABELS[space.roomType]}
          </p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60'
          style={{ background: "var(--surface)" }}
          aria-label='Delete space'
        >
          <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
            <path
              d='M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6'
              stroke='var(--score-low)'
              strokeWidth='1.8'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className='scroll-area flex-1 px-5 pb-6'>
        {!lastScan ? (
          /* No scans yet */
          <div className='flex flex-col items-center justify-center py-16 gap-6 text-center'>
            <div
              className='w-20 h-20 rounded-2xl flex items-center justify-center'
              style={{ background: "var(--surface)" }}
            >
              <svg width='36' height='36' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z'
                  stroke='var(--accent)'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <circle
                  cx='12'
                  cy='13'
                  r='4'
                  stroke='var(--accent)'
                  strokeWidth='1.8'
                />
              </svg>
            </div>
            <p className='text-base' style={{ color: "var(--text-secondary)" }}>
              No scans yet. Tap below to analyze this space.
            </p>
          </div>
        ) : (
          <div className='fade-in space-y-6'>
            {/* Score + photo */}
            <div
              className='rounded-3xl p-5 flex flex-col items-center gap-4'
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <ScoreRing score={lastScan.score} size='large' />
              <p className='text-xs' style={{ color: "var(--text-muted)" }}>
                Last scanned {scanDate}
              </p>
              {photoUrl && (
                <img
                  src={photoUrl}
                  alt='Space'
                  className='w-full rounded-2xl object-cover'
                  style={{ maxHeight: 200 }}
                />
              )}
            </div>

            {/* Breakdown metrics */}
            <div
              className='rounded-3xl p-5 space-y-4'
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <h2
                className='font-bold text-base'
                style={{ color: "var(--text-primary)" }}
              >
                Breakdown
              </h2>
              {lastScan.breakdownMetrics.map((m) => (
                <MetricBar key={m.label} label={m.label} score={m.score} />
              ))}
            </div>

            {/* Strengths */}
            {lastScan.strengths.length > 0 && (
              <div
                className='rounded-3xl p-5 space-y-3'
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  className='font-bold text-base'
                  style={{ color: "var(--text-primary)" }}
                >
                  What's Working
                </h2>
                {lastScan.strengths.map((s, i) => (
                  <div key={i} className='flex gap-3'>
                    <span
                      className='w-2 h-2 rounded-full mt-1.5 flex-shrink-0'
                      style={{ background: "var(--score-high)" }}
                    />
                    <p
                      className='text-sm leading-relaxed'
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Weaknesses */}
            {lastScan.weaknesses.length > 0 && (
              <div
                className='rounded-3xl p-5 space-y-3'
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <h2
                  className='font-bold text-base'
                  style={{ color: "var(--text-primary)" }}
                >
                  Opportunities
                </h2>
                {lastScan.weaknesses.map((w, i) => (
                  <div key={i} className='flex gap-3'>
                    <span
                      className='w-2 h-2 rounded-full mt-1.5 flex-shrink-0'
                      style={{ background: "var(--accent)" }}
                    />
                    <p
                      className='text-sm leading-relaxed'
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {w}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Reset Plan */}
            {(lastScan.resetSteps ?? []).length > 0 && (
              <div
                className='rounded-3xl p-5 space-y-4'
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className='flex items-center justify-between'>
                  <h2
                    className='font-bold text-base'
                    style={{ color: "var(--text-primary)" }}
                  >
                    Reset Plan
                  </h2>
                  {lastScan.estimatedMinutes != null && (
                    <div
                      className='flex items-center gap-1.5 px-3 py-1 rounded-full'
                      style={{ background: "var(--accent-muted)" }}
                    >
                      <svg width='13' height='13' viewBox='0 0 24 24' fill='none'>
                        <circle cx='12' cy='12' r='9' stroke='var(--accent)' strokeWidth='2' />
                        <path d='M12 7v5l3 3' stroke='var(--accent)' strokeWidth='2' strokeLinecap='round' />
                      </svg>
                      <span
                        className='text-xs font-semibold'
                        style={{ color: "var(--accent)" }}
                      >
                        {lastScan.estimatedMinutes < 60
                          ? `~${lastScan.estimatedMinutes} min`
                          : `~${Math.round((lastScan.estimatedMinutes / 60) * 10) / 10} hr`}
                      </span>
                    </div>
                  )}
                </div>
                {(lastScan.resetSteps ?? []).map((step, i) => (
                  <div key={i} className='flex gap-3 items-start'>
                    <span
                      className='w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5'
                      style={{
                        background: "var(--accent-muted)",
                        color: "var(--accent)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <p
                      className='text-sm leading-relaxed'
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Amazon products */}
            {lastScan.productSuggestions.length > 0 && (
              <div>
                <h2
                  className='font-bold text-base mb-3'
                  style={{ color: "var(--text-primary)" }}
                >
                  Recommended Products
                </h2>
                <div
                  className='flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 scroll-area'
                  style={{ scrollSnapType: "x mandatory" }}
                >
                  {lastScan.productSuggestions.map((p, i) => (
                    <div
                      key={`${p.asin}-${i}`}
                      style={{ scrollSnapAlign: "start" }}
                    >
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Before/After rendering */}
            {photoUrl && renderUrl && (
              <div>
                <h2
                  className='font-bold text-base mb-3'
                  style={{ color: "var(--text-primary)" }}
                >
                  Your Space, Optimized
                </h2>
                <BeforeAfterToggle
                  beforeUri={photoUrl}
                  afterUri={renderUrl}
                  beforeLabel='Current'
                  afterLabel='Optimized'
                />
              </div>
            )}

            {photoUrl && !renderUrl && (
              <div
                className='rounded-2xl p-4 text-center text-sm'
                style={{
                  background: "var(--surface)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                AI rendering in progress — check back in a moment
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div
        className='px-5 pb-1 pt-1 safe-bottom flex gap-3'
        style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 5px)` }}
      >
        <button
          onClick={() => navigate(`/spaces/${spaceId}/scan`)}
          className='flex-1 py-4 rounded-2xl font-bold text-base active:opacity-70 transition-opacity'
          style={{ background: "var(--accent)", color: "#fff" }}
        >
          New Scan
        </button>
        {space.scans.length >= 2 && (
          <button
            onClick={() => navigate(`/spaces/${spaceId}/compare`)}
            className='flex-1 py-4 rounded-2xl font-bold text-base active:opacity-70 transition-opacity'
            style={{
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1.5px solid var(--border)",
            }}
          >
            Compare
          </button>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div
          className='absolute inset-0 flex items-end justify-center'
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 50 }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className='w-full rounded-t-3xl p-6 space-y-4'
            style={{ background: "var(--surface)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className='text-lg font-bold text-center'
              style={{ color: "var(--text-primary)" }}
            >
              Delete "{space.name}"?
            </h3>
            <p
              className='text-sm text-center'
              style={{ color: "var(--text-secondary)" }}
            >
              All scans and history for this space will be permanently deleted.
            </p>
            <button
              onClick={handleDelete}
              className='w-full py-4 rounded-2xl font-bold text-base active:opacity-70'
              style={{ background: "var(--score-low)", color: "#fff" }}
            >
              Delete Space
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className='w-full py-4 rounded-2xl font-bold text-base active:opacity-70'
              style={{
                background: "var(--bg)",
                color: "var(--text-secondary)",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
