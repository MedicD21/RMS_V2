import { Outlet } from "react-router-dom";
import PillNav from "@/components/ui/PillNav";
import LightRays from "@/components/ui/LightRays";
import { useTheme } from "@/hooks/useTheme";

export function AppShell() {
  const theme = useTheme();
  const raysColor = theme === "dark" ? "#c9deea" : "#79a8ba";

  return (
    <div className='flex flex-col h-full' style={{ background: "var(--bg)" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          zIndex: 0,
        }}
      >
        <LightRays
          raysOrigin='top-center'
          raysColor={raysColor}
          raysSpeed={1}
          lightSpread={0.3}
          rayLength={3}
          followMouse={false}
          mouseInfluence={0}
          noiseAmount={0}
          distortion={0}
          className='custom-rays'
          pulsating={false}
          fadeDistance={200}
          saturation={2}
        />
      </div>
      <main className='flex-1 overflow-hidden relative' style={{ zIndex: 2 }}>
        <Outlet />
      </main>

      <PillNav
        items={[
          { label: "Spaces", href: "/spaces" },
          { label: "Staging", href: "/staging" },
          { label: "Settings", href: "/settings" },
        ]}
        ease='power2.easeOut'
        baseColor='var(--tab-bar-bg)'
        activePillColor='var(--accent)'
        activeTextColor='var(--on-accent)'
        inactiveTextColor='var(--text-secondary)'
        hoverTextColor='var(--text-hover)'
        navHeight='42px'
        pillPadX='18px'
        pillGap='10px'
        borderTop='1px solid var(--tab-bar-border)'
        paddingTop={10}
        zIndex={30}
      />
    </div>
  );
}
