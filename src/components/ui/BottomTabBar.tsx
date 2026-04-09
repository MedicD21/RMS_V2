import { useLocation, useNavigate } from "react-router-dom";

const TABS = [
  {
    id: "spaces",
    path: "/spaces",
    label: "Spaces",
    icon: (active: boolean) => (
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <path
          d='M3 9.5L12 3L21 9.5V20a1 1 0 01-1 1H15v-5h-6v5H4a1 1 0 01-1-1V9.5z'
          stroke='currentColor'
          strokeWidth={active ? 3 : 1.8}
          strokeLinecap='round'
          strokeLinejoin='round'
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    id: "staging",
    path: "/staging",
    label: "Staging",
    icon: (active: boolean) => (
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <rect
          x='2'
          y='7'
          width='20'
          height='13'
          rx='2'
          stroke='currentColor'
          strokeWidth={active ? 2.2 : 1.8}
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
        <path
          d='M8 7V5a4 4 0 018 0v2'
          stroke='currentColor'
          strokeWidth={active ? 2.2 : 1.8}
          strokeLinecap='round'
        />
        <circle cx='12' cy='13.5' r='1.5' fill='currentColor' />
      </svg>
    ),
  },
  {
    id: "settings",
    path: "/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
        <circle
          cx='12'
          cy='12'
          r='3'
          stroke='currentColor'
          strokeWidth={active ? 2.2 : 1.8}
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.3 : 0}
        />
        <path
          d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
          stroke='currentColor'
          strokeWidth={active ? 2.2 : 1.8}
        />
      </svg>
    ),
  },
];

export function BottomTabBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className='flex items-center safe-bottom'
      style={{
        background: "var(--tab-bar-bg)",
        borderTop: "1px solid var(--tab-bar-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      {TABS.map((tab) => {
        const active = location.pathname.startsWith(tab.path);
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className='flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-opacity active:opacity-60'
            style={{
              color: active ? "var(--text-muted)" : "var(--text-secondary)",
              fontWeight: active ? "bold" : "normal",
            }}
            aria-label={tab.label}
            aria-current={active ? "page" : undefined}
          >
            {tab.icon(active)}
            <span className='text-xs font-medium'>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
