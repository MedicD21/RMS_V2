import { useNavigate } from "react-router-dom";
import { useStagingStore } from "@/store/stagingStore";
import { Header } from "@/components/layout/Header";
import { RiHomeSmileLine } from "react-icons/ri";
import photo2 from "/stage.png";

export function StagingHomeScreen() {
  const navigate = useNavigate();
  const { analyses } = useStagingStore();

  return (
    <div className='flex flex-col h-full'>
      <Header>Home Staging</Header>
      <img
        className='absolute top-0 left-0 w-full h-full object-cover opacity-10 z-[0] pointer-events-none'
        src={photo2}
        alt='Background'
      />

      {/* Hero */}
      <div className='flex-1 flex flex-col items-center justify-center text-center gap-4'>
        {/* Icon */}
        <div
          className='w-32 h-32 rounded-3xl flex items-center justify-center'
          style={{
            background: "var(--surface)",
            border: "1.6px solid var(--text-secondary)",
          }}
        >
          <RiHomeSmileLine size={55} color='var(--tab-bar-bg)' />
        </div>

        {/* Copy */}
        <div className='text-center space-y-2'>
          <h2
            className='text-2xl font-extrabold'
            style={{ color: "var(--text-primary)" }}
          >
            Stage Your Space to Sell
          </h2>
          <p
            className='text-base leading-relaxed'
            style={{ color: "var(--text-secondary)" }}
          >
            Get expert staging suggestions and see your room transformed for
            listing photos.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/staging/analyze")}
          className='flex gap-4 items-center align-center uppercase px-8 py-3.5 rounded-2xl font-bold text-base active:opacity-70 transition-opacity'
          style={{
            background: "var(--accent)",
            color: "var(--bg)",
          }}
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <circle
              cx='12'
              cy='13'
              r='4'
              stroke='currentColor'
              strokeWidth='2'
            />
          </svg>
          Analyze a Room
        </button>

        {/* History link */}
        {analyses.length > 0 && (
          <button
            onClick={() => navigate("/staging/history")}
            className='text-sm font-semibold active:opacity-60'
            style={{ color: "var(--text-secondary)" }}
          >
            View History ({analyses.length})
          </button>
        )}
      </div>
    </div>
  );
}
