import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStagingStore } from "@/store/stagingStore";
import { Header } from "@/components/layout/Header";

export function StagingHistoryScreen() {
  const navigate = useNavigate();
  const { analyses, deleteAnalysis } = useStagingStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const sorted = [...analyses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className='flex flex-col h-full'>
      <Header onBack={() => navigate(-1)}>Staging History</Header>

      {sorted.length === 0 ? (
        <div className='flex-1 flex items-center justify-center'>
          <p style={{ color: "var(--text-secondary)" }}>
            No staging analyses yet.
          </p>
        </div>
      ) : (
        <div className='scroll-area flex-1 px-5 pb-6 space-y-3'>
          {sorted.map((a) => (
            <div
              key={a.id}
              className='rounded-2xl overflow-hidden'
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className='w-full h-36 bg-black flex items-center justify-center overflow-hidden'>
                <img
                  src={a.photoUri}
                  alt='Room'
                  className='w-full h-full object-cover opacity-80'
                />
              </div>

              <div className='p-4'>
                <p
                  className='text-xs font-medium mb-2'
                  style={{ color: "var(--text-muted)" }}
                >
                  {formatDate(a.date)}
                </p>
                <p
                  className='text-sm font-semibold leading-relaxed line-clamp-2'
                  style={{ color: "var(--text-secondary)" }}
                >
                  {a.suggestions[0]}
                </p>
                <p
                  className='text-xs mt-1'
                  style={{ color: "var(--text-muted)" }}
                >
                  {a.suggestions.length} suggestion
                  {a.suggestions.length !== 1 ? "s" : ""}
                </p>

                <div className='flex gap-2 mt-3'>
                  <button
                    onClick={() => setConfirmId(a.id)}
                    className='flex-1 py-2.5 rounded-xl text-sm font-semibold active:opacity-60'
                    style={{
                      background: "var(--score-low-bg)",
                      color: "var(--score-low)",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {confirmId && (
        <div
          className='absolute inset-0 flex items-end justify-center'
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 50 }}
          onClick={() => setConfirmId(null)}
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
              Delete this analysis?
            </h3>
            <p
              className='text-sm text-center'
              style={{ color: "var(--text-secondary)" }}
            >
              This staging session will be permanently deleted.
            </p>
            <button
              onClick={() => {
                deleteAnalysis(confirmId);
                setConfirmId(null);
              }}
              className='w-full py-4 rounded-2xl font-bold text-base active:opacity-70'
              style={{ background: "var(--score-low)", color: "#fff" }}
            >
              Delete
            </button>
            <button
              onClick={() => setConfirmId(null)}
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
