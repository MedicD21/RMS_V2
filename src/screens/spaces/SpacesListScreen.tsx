import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { AppLogo } from "@/components/ui/AppLogo";
import { ROOM_TYPE_LABELS } from "@/types";

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6 px-8 text-center'>
      <div
        className='w-24 h-24 rounded-3xl flex items-center justify-center'
        style={{ background: "var(--accent-muted)" }}
      >
        <svg width='44' height='44' viewBox='0 0 24 24' fill='none'>
          <path
            d='M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z'
            stroke='var(--accent)'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </div>
      <div>
        <h2
          className='text-xl font-bold mb-2'
          style={{ color: "var(--text-primary)" }}
        >
          No spaces yet
        </h2>
        <p
          className='text-sm leading-relaxed'
          style={{ color: "var(--text-secondary)" }}
        >
          Add your first space to start tracking and improving your
          organization.
        </p>
      </div>
      <button
        onClick={onAdd}
        className='px-8 py-3.5 rounded-2xl font-semibold text-base active:opacity-70 transition-opacity'
        style={{ background: "var(--accent)", color: "#fff" }}
      >
        Add Your First Space
      </button>
    </div>
  );
}

export function SpacesListScreen() {
  const navigate = useNavigate();
  const { spaces, loadSpaces } = useSpacesStore();

  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  const sorted = [...spaces].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className='flex flex-col h-full' style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className='px-5 safe-top'
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 30px)` }}
      >
        <div className='flex items-center justify-between pb-4'>
          <div className='flex items-center gap-3'>
            <AppLogo size={50} />
            <h1
              className='text-3xl font-extrabold'
              style={{ color: "var(--text-primary)" }}
            >
              Reset My Space
            </h1>
          </div>
        </div>
        <h2
          className='text-xl font-bold mb-2 px-2'
          style={{ color: "var(--text-secondary)" }}
        >
          My Spaces{" "}
        </h2>
      </div>

      {/* Content */}
      {spaces.length === 0 ? (
        <EmptyState onAdd={() => navigate("/spaces/new")} />
      ) : (
        <div className='scroll-area flex-1 px-5 pb-4'>
          <div className='space-y-3'>
            {sorted.map((space) => {
              const lastScan = space.scans[space.scans.length - 1];
              const score = lastScan?.score ?? 0;
              const date = lastScan
                ? new Date(lastScan.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : null;

              return (
                <button
                  key={space.id}
                  onClick={() => navigate(`/spaces/${space.id}`)}
                  className='w-full flex items-center gap-4 p-4 rounded-2xl active:opacity-70 transition-opacity text-left'
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <ScoreRing score={score} size='compact' />
                  <div className='flex-1 min-w-0'>
                    <p
                      className='font-bold text-base truncate'
                      style={{ color: "var(--text-primary)" }}
                    >
                      {space.name}
                    </p>
                    <p
                      className='text-sm mt-0.5'
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {ROOM_TYPE_LABELS[space.roomType]}
                      {date && <span className='mx-1.5 opacity-40'>·</span>}
                      {date && <span>{date}</span>}
                    </p>
                    {!lastScan && (
                      <p
                        className='text-xs mt-1'
                        style={{ color: "var(--text-muted)" }}
                      >
                        No scans yet — tap to add one
                      </p>
                    )}
                  </div>
                  <svg
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    style={{ color: "var(--text-muted)", flexShrink: 0 }}
                  >
                    <path
                      d='M9 18l6-6-6-6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* FAB */}
      {spaces.length > 0 && (
        <button
          onClick={() => navigate("/spaces/new")}
          className='absolute bottom-20 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:opacity-70 transition-opacity'
          style={{ background: "var(--accent)" }}
          aria-label='Add space'
        >
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 5v14M5 12h14'
              stroke='var(--text-primary)'
              strokeWidth='2.5'
              strokeLinecap='round'
            />
          </svg>
        </button>
      )}
    </div>
  );
}
