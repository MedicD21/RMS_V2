import { useState } from "react";
import { useSettingsStore } from "@/store/settingsStore";
import { OPENROUTER_MODELS, REPLICATE_MODELS } from "@/types";
import type { ThemeMode } from "@/types";
import { Header } from "@/components/layout/Header";
import photo2 from "/stage.png";

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
      style={{ color: "var(--text-primary)" }}
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
    <div className='flex flex-col h-full relative'>
      {/* Header */}
      <Header>Settings</Header>
      <img
        className='absolute top-0 left-0 w-full h-full object-cover opacity-5 pointer-events-none'
        src={photo2}
        alt='Background'
      />

      <div
        className='scroll-area flex-1'
        style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 80px)` }}
      >
        {/* Appearance */}
        <SectionHeader title='Appearance' />
        <div
          style={{
            background: "var(--section-bg)",
            borderTop: "1px solid var(--border-strong)",
          }}
        >
          <SettingRow label='Theme'>
            <div
              className='flex rounded-xl overflow-hidden'
              style={{ border: "2px solid var(--accent)" }}
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
                      theme === opt.value
                        ? "var(--on-accent)"
                        : "var(--text-secondary)",
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
            background: "var(--section-bg)",
            borderTop: "1px solid var(--border-strong)",
          }}
        >
          <SettingRow label='Vision Model'>
            <select
              value={openRouterModel}
              onChange={(e) => setOpenRouterModel(e.target.value)}
              className='text-md min-w-fit rounded-lg px-1 py-1.5 outline-none'
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
              className='text-md min-w-fit rounded-lg py-1.5 outline-none'
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
            background: "var(--section-bg)",
            borderTop: "1px solid var(--border-strong)",
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
            background: "var(--section-bg)",
            borderTop: "1px solid var(--border-strong)",
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
            background: "var(--section-bg)",
            borderTop: "1px solid var(--border-strong)",
          }}
        >
          <SettingRow label='Version'>
            <span className='text-sm' style={{ color: "var(--text-primary)" }}>
              1.0.0
            </span>
          </SettingRow>
          <div
            className='px-5 py-4'
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <p
              className='text-xs leading-relaxed'
              style={{ color: "var(--text-secondary)" }}
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
          style={{ background: "var(--overlay)", zIndex: 50 }}
          onClick={() => setShowClearConfirm(false)}
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
              style={{ background: "var(--score-low)", color: "var(--on-danger)" }}
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
