import { useNavigate } from 'react-router-dom'
import { useStagingStore } from '@/store/stagingStore'

export function StagingHistoryScreen() {
  const navigate = useNavigate()
  const { analyses, deleteAnalysis } = useStagingStore()

  const sorted = [...analyses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      <div
        className="flex items-center gap-3 px-5"
        style={{ paddingTop: `calc(env(safe-area-inset-top) + 16px)`, paddingBottom: 16 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60"
          style={{ background: 'var(--surface)' }}
          aria-label="Back"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Staging History
        </h1>
      </div>

      {sorted.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: 'var(--text-secondary)' }}>No staging analyses yet.</p>
        </div>
      ) : (
        <div className="scroll-area flex-1 px-5 pb-6 space-y-3">
          {sorted.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl overflow-hidden"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
            >
              {/* Thumbnail */}
              <div className="w-full h-36 bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={a.photoUri}
                  alt="Room"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>

              <div className="p-4">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
                  {formatDate(a.date)}
                </p>
                <p className="text-sm leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                  {a.suggestions[0]}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  {a.suggestions.length} suggestion{a.suggestions.length !== 1 ? 's' : ''}
                </p>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => deleteAnalysis(a.id)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold active:opacity-60"
                    style={{ background: 'var(--score-low-bg)', color: 'var(--score-low)' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
