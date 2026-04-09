import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { OPENROUTER_MODELS, REPLICATE_MODELS } from "@/types";
import type { ThemeMode } from "@/types";
import { AppLogo } from "@/components/ui/AppLogo";
import ShinyText from "@/components/ui/ShinyText";

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

function SettingRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className='px-5 py-4 flex items-center justify-between gap-3'
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      <span
        className='text-sm font-medium'
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </span>
      <div className='flex-shrink-0'>{children}</div>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <p
      className='px-5 pt-6 pb-2 text-xs font-bold uppercase tracking-wider'
      style={{ color: "var(--text-muted)" }}
    >
      {title}
    </p>
  );
}

export function SettingsScreen() {
  const {
    theme,
    setTheme,
    openRouterModel,
    setOpenRouterModel,
    replicateModel,
    setReplicateModel,
    amazonConfigured,
    clearAllData,
  } = useSettingsStore();

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  return (
    <div className='flex flex-col h-full' style={{ background: "var(--bg)" }}>
      {/* Header */}
      <div
        className='px-5'
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
          paddingBottom: 30,
        }}
      >
        <div className='flex items-center gap-3'>
          <AppLogo size={50} />
          <h1
            className='text-3xl font-extrabold'
            style={{ color: "var(--text-primary)" }}
          >
            <ShinyText
              text='Settings'
              spread={500}
              speed={2}
              delay={4}
              color='var(--text-primary)'
              shineColor='#ffffff'
            />
          </h1>
        </div>
      </div>

      <div className='scroll-area flex-1 pb-8'>
        {/* Appearance */}
        <SectionHeader title='Appearance' />
        <div
          style={{
            background: "var(--tab-bar-bg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <SettingRow label='Theme'>
            <div
              className='flex rounded-xl overflow-hidden'
              style={{ border: "1px solid var(--border)" }}
            >
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTheme(opt.value)}
                  className='px-3 py-1.5 text-xs font-semibold transition-all'
                  style={{
                    background:
                      theme === opt.value ? "var(--accent)" : "transparent",
                    color:
                      theme === opt.value ? "#fff" : "var(--text-secondary)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>

        {/* AI Models */}
        <SectionHeader title='AI Models' />
        <div
          style={{
            background: "var(--tab-bar-bg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <SettingRow label='Vision Model'>
            <select
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              className='text-md rounded-lg px-2.5 py-1.5 outline-none'
              style={{
                background: "var(--bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                maxWidth: screen.width < 640 ? "100%" : 220,
              }}
            >
              {OPENROUTER_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label='Image Generation'>
            <select
              value={replicateModel}
              onChange={(e) => setReplicateModel(e.target.value)}
              className='text-sm rounded-lg px-2.5 py-1.5 outline-none'
              style={{
                background: "var(--bg)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                maxWidth: screen.width < 640 ? "100%" : 180,
              }}
            >
              {REPLICATE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </SettingRow>
        </div>

        {/* Integrations */}
        <SectionHeader title='Integrations' />
        <div
          style={{
            background: "var(--tab-bar-bg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <SettingRow label='Amazon PA API'>
            <span
              className='text-sm font-bold px-2.5 py-1 rounded-full'
              style={{
                background: amazonConfigured
                  ? "var(--score-high-bg)"
                  : "var(--score-low-bg)",
                color: amazonConfigured
                  ? "var(--score-high)"
                  : "var(--score-low)",
              }}
            >
              {amazonConfigured ? "Configured" : "Not Configured"}
            </span>
          </SettingRow>
        </div>

        {/* Data */}
        <SectionHeader title='Data' />
        <div
          style={{
            background: "var(--tab-bar-bg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <button
            onClick={() => setShowClearConfirm(true)}
            className='w-full px-5 py-4 text-sm font-semibold text-left active:opacity-60'
            style={{ color: "var(--score-low)" }}
          >
            Clear All Data
          </button>
        </div>

        {/* About */}
        <SectionHeader title='About' />
        <div
          style={{
            background: "var(--tab-bar-bg)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <SettingRow label='Version'>
            <span className='text-sm' style={{ color: "var(--text-muted)" }}>
              1.0.0
            </span>
          </SettingRow>
          <div
            className='px-5 py-4'
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className='text-xs leading-relaxed'
              style={{ color: "var(--text-muted)" }}
            >
              Reset My Space participates in the Amazon Associates Program.
              Product links may earn us a commission at no extra cost to you.
            </p>
          </div>
        </div>
      </div>

      {/* Clear All Data modal */}
      {showClearConfirm && (
        <div
          className='absolute inset-0 flex items-end justify-center'
          style={{ background: "rgba(0,0,0,0.6)", zIndex: 50 }}
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className='w-full rounded-t-3xl p-6 space-y-4'
            style={{ background: "var(--tab-bar-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className='text-lg font-bold text-center'
              style={{ color: "var(--text-primary)" }}
            >
              Clear All Data?
            </h3>
            <p
              className='text-sm text-center'
              style={{ color: "var(--text-secondary)" }}
            >
              All spaces, scans, and staging analyses will be permanently
              deleted.
            </p>
            <button
              onClick={clearAllData}
              className='w-full py-4 rounded-2xl font-bold text-base active:opacity-70'
              style={{ background: "var(--score-low)", color: "#fff" }}
            >
              Clear Everything
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
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
