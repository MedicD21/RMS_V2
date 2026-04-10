import SplitText from "@/components/ui/SplitText";
import { AppLogo } from "@/components/ui/AppLogo";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <div
      className='px-5'
      style={{
        paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
        paddingBottom: 30,
      }}
    >
      <div className='flex items-center gap-3'>
        <AppLogo size={50} />
        <SplitText
          text={children}
          className='text-3xl font-semibold text-center'
          delay={50}
          duration={1.25}
          ease='power3.out'
          splitType='chars'
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin='-100px'
          textAlign='center'
          tag='h1'
        />
      </div>
    </div>
  );
}
