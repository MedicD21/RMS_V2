import SplitText from "@/components/ui/SplitText";
import { AppLogo } from "@/components/ui/AppLogo";

interface HeaderProps {
  children: React.ReactNode;
  onBack?: () => void;
  subtitle?: string;
  right?: React.ReactNode;
}

export function Header({ children, onBack, subtitle, right }: HeaderProps) {
  return (
    <div
      className='flex items-center opacity-80 gap-3 px-5 z-[99] bg-[var(--bg)] rounded-3xl pt-6 pb-6'
      //   style={{
      //     paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
      //     paddingBottom: 30,
      //   }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60 flex-shrink-0'
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
      ) : (
        <AppLogo size={50} />
      )}

      <div className='flex-1 min-w-0'>
        <SplitText
          text={children}
          className='text-3xl font-semibold'
          delay={50}
          duration={1.25}
          ease='power3.out'
          splitType='chars'
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin='-100px'
          textAlign='left'
          tag='h1'
        />
        {subtitle && (
          <p
            className='text-xs mt-0.5'
            style={{ color: "var(--text-secondary)" }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {right && <div className='flex-shrink-0'>{right}</div>}
    </div>
  );
}
