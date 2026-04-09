import { Outlet } from "react-router-dom";
import PillNav from "@/components/ui/PillNav";

export function AppShell() {
  return (
    <div className='flex flex-col h-full' style={{ background: "var(--bg)" }}>
      <main className='flex-1 overflow-hidden relative'>
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
        activePillColor='var(--accent-hover)'
        activeTextColor='var(--text-primary)'
        inactiveTextColor='var(--text-secondary)'
        hoverTextColor='var(--text-hover)'
        navHeight='42px'
        pillPadX='18px'
        pillGap='10px'
        borderTop='1px solid var(--tab-bar-border)'
        paddingTop={10}
      />
    </div>
  );
}
