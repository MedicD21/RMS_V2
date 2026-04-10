import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import { Header } from "@/components/layout/Header";
import { ScoreRing } from "@/components/ui/ScoreRing";
import { ROOM_TYPE_LABELS, type Space } from "@/types";
import photo1 from "/homeorg.png";
import photo2 from "/stage.png";
import { useTheme } from "@/hooks/useTheme";

const TIPS: Record<"low" | "mid" | "high", string[]> = {
  low: [
    "Start with one drawer. Small wins build momentum.",
    "A 15-minute reset today beats a 3-hour overhaul later.",
    "Clutter is just delayed decisions — make one now.",
    "Pick the messiest corner and spend 10 minutes there.",
  ],
  mid: [
    "You're making progress. Keep one surface always clear.",
    "Good foundation — now tackle one weak spot per week.",
    "Maintenance is easier than recovery. Stay consistent.",
    "Label it, contain it, and you'll never lose it again.",
  ],
  high: [
    "Your space is working for you. Nice work.",
    "High score — now help someone else reset theirs.",
    "A tidy space is a clear mind. Keep it up.",
    "You've built great habits. Don't let busy weeks undo them.",
  ],
};

function getTip(score: number): string {
  const bucket = score <= 40 ? "low" : score <= 70 ? "mid" : "high";
  const list = TIPS[bucket];
  return list[Math.floor(Date.now() / 86400000) % list.length];
}

function HomeHealthCard({
  spaces,
  onWorstPress,
}: {
  spaces: Space[];
  onWorstPress: (id: string) => void;
}) {
  const scannedSpaces = spaces.filter((s) => s.scans.length > 0);
  if (scannedSpaces.length === 0) return null;

  const avgScore = Math.round(
    scannedSpaces.reduce((sum, s) => {
      const last = s.scans[s.scans.length - 1];
      return sum + (last?.score ?? 0);
    }, 0) / scannedSpaces.length,
  );

  const worst = [...scannedSpaces].sort((a, b) => {
    const aScore = a.scans[a.scans.length - 1]?.score ?? 0;
    const bScore = b.scans[b.scans.length - 1]?.score ?? 0;
    return aScore - bScore;
  })[0];
  const worstScore = worst.scans[worst.scans.length - 1]?.score ?? 0;

  const tip = getTip(avgScore);
  const theme = useTheme();

  return (
    <>
      {/* Overall Home Health */}
      <div
        className='rounded-3xl flex items-center gap-5 mb-3'
        style={{
          background: "var(--surface)",
          border: "3px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        <ScoreRing score={avgScore} size='large' />
        <div className='flex-1 min-w-0'>
          <p
            className='text-xs font-semibold uppercase tracking-widest mb-1'
            style={{ color: "var(--text-muted)" }}
          >
            Home Health
          </p>
          <p
            className='text-2xl font-extrabold leading-tight'
            style={{ color: "var(--text-primary)" }}
          >
            {avgScore}/100
          </p>
          <p
            className='text-xs mt-1 leading-relaxed'
            style={{ color: "var(--text-secondary)" }}
          >
            Avg across {scannedSpaces.length} scanned space
            {scannedSpaces.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Needs Attention */}
      {worstScore < 75 && (
        <button
          onClick={() => onWorstPress(worst.id)}
          className='w-full rounded-2xl px-4 py-3 flex items-center gap-3 mb-3 active:opacity-70 transition-opacity text-left'
          style={{
            background: "rgb(210, 43, 43, 0.3)",
            border: "1px solid #000000",
          }}
        >
          <svg
            width='18'
            height='18'
            viewBox='0 0 24 24'
            fill='none'
            style={{ flexShrink: 0 }}
          >
            <path
              d='M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z'
              stroke='rgb(210, 43, 43)'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <div className='flex-1 min-w-0'>
            <p
              className='text-sm font-bold'
              style={{
                color: theme === "dark" ? "var(--bg)" : "var(--text-primary)",
                textShadow: "0 0 5px #d42b2b80",
              }}
            >
              Needs Attention
            </p>
            <p
              className='text-sm truncate'
              style={{ color: "var(--text-secondary)" }}
            >
              {worst.name} — scoring {worstScore}
            </p>
          </div>
          <svg
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            style={{ flexShrink: 0 }}
          >
            <path
              d='M9 18l6-6-6-6'
              stroke='var(--score-low)'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      )}

      {/* Quick tip */}
      <div
        className='rounded-2xl px-4 py-3 flex items-center gap-3 mb-4'
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          style={{ flexShrink: 0, marginTop: 2 }}
        >
          <path
            d='M12 2a7 7 0 015.292 11.584C16.54 14.647 16 15.746 16 17v1a2 2 0 01-2 2h-4a2 2 0 01-2-2v-1c0-1.254-.54-2.353-1.292-3.416A7 7 0 0112 2z'
            stroke='var(--text-primary)'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M9 21h6'
            stroke='var(--text-primary)'
            strokeWidth='1.8'
            strokeLinecap='round'
          />
        </svg>
        <p
          className='text-sm leading-relaxed italic'
          style={{ color: "var(--text-primary)" }}
        >
          {tip}
        </p>
      </div>
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center h-full gap-6 px-8 text-center'>
      <div
        className='w-24 h-24 rounded-3xl flex items-center justify-center'
        style={{ background: "var(--surface)" }}
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

  const sorted = useMemo(
    () =>
      [...spaces].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [spaces],
  );

  return (
    <div className='flex flex-col h-full'>
      <Header>Reset My Space</Header>
      <img
        className='opacity-75 w-screen rounded-4xl border-2 border-slate-500 shadow-xl shadow-slate-500 scale-[140%] overflow-hidden overscroll-auto z-[2]'
        src={photo1}
      ></img>
      <img
        className='absolute top-0 left-0 w-full h-full object-cover opacity-10'
        src={photo2}
        alt='Background'
      />

      {/* Content */}
      {spaces.length === 0 ? (
        <EmptyState onAdd={() => navigate("/spaces/new")} />
      ) : (
        <div className='scroll-area flex-1 px-5 pb-4 z-[7] -mt-[25%]'>
          <HomeHealthCard
            spaces={spaces}
            onWorstPress={(id) => navigate(`/spaces/${id}`)}
          />

          <h2
            className='text-base font-bold mb-3 px-1'
            style={{ color: "var(--text-secondary)" }}
          >
            My Spaces
          </h2>

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
          className='absolute bottom-12 right-8 w-14 h-14 rounded-full flex items-center justify-center shadow-lg active:opacity-70 transition-opacity z-[98]'
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
