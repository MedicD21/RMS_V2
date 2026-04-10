import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStagingStore } from "@/store/stagingStore";
import { useSettingsStore } from "@/store/settingsStore";
import { capturePhoto } from "@/hooks/useCamera";
import { analyzeStaging } from "@/services/ai/AIService";
import { generateRoomRendering } from "@/services/imageGen/ImageGenService";
import { LoadingRing } from "@/components/ui/LoadingRing";
import { BeforeAfterToggle } from "@/components/ui/BeforeAfterToggle";

type Step = "capture" | "analyzing" | "results" | "rendering";

export function StagingAnalysisScreen() {
  const navigate = useNavigate();
  const { addAnalysis, updateRendering } = useStagingStore();
  const { openRouterModel, replicateModel } = useSettingsStore();

  const [step, setStep] = useState<Step>("capture");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [renderUrl, setRenderUrl] = useState<string | null>(null);
  const [analysisId] = useState(() => crypto.randomUUID());
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);

  async function handleCapture(source: "camera" | "library") {
    setError(null);
    const result = await capturePhoto(source);
    if (!result) return;
    setPhotoDataUrl(result.dataUrl);
    runAnalysis(result.dataUrl, result.localUri);
  }

  async function runAnalysis(dataUrl: string, localUri: string) {
    setStep("analyzing");
    try {
      const result = await analyzeStaging(dataUrl, openRouterModel);
      setSuggestions(result.suggestions);

      const analysis = {
        id: analysisId,
        date: new Date().toISOString(),
        photoUri: localUri,
        suggestions: result.suggestions,
      };
      await addAnalysis(analysis);
      setStep("results");

      // Generate rendering in background
      setIsRendering(true);
      generateRoomRendering(dataUrl, result.stagingContext, replicateModel)
        .then(async (uri) => {
          setRenderUrl(uri);
          await updateRendering(analysisId, uri);
        })
        .catch(() => {
          /* rendering is optional */
        })
        .finally(() => setIsRendering(false));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.",
      );
      setStep("capture");
    }
  }

  // Capture screen
  if (step === "capture") {
    return (
      <div className='flex flex-col h-full'>
        <div
          className='flex items-center gap-3 px-5'
          style={{
            paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
            paddingBottom: `calc(env(safe-area-inset-bottom) + 30px)`,
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60'
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
          <h1
            className='text-xl font-bold'
            style={{ color: "var(--text-primary)" }}
          >
            Stage a Room
          </h1>
        </div>

        <div className='flex-1 flex flex-col items-center justify-center px-5 gap-6'>
          <div
            className='w-32 h-32 rounded-3xl flex items-center justify-center'
            style={{ background: "var(--surface)" }}
          >
            <svg width='56' height='56' viewBox='0 0 24 24' fill='none'>
              <path
                d='M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z'
                stroke='var(--accent)'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <circle
                cx='12'
                cy='13'
                r='4'
                stroke='var(--accent)'
                strokeWidth='1.8'
              />
            </svg>
          </div>

          <div className='text-center'>
            <h2
              className='text-xl font-bold mb-2'
              style={{ color: "var(--text-primary)" }}
            >
              Capture the Room
            </h2>
            <p
              className='text-sm leading-relaxed'
              style={{ color: "var(--text-secondary)" }}
            >
              Take a wide photo showing the full room. Good lighting makes for
              better staging advice.
            </p>
          </div>

          {error && (
            <div
              className='w-full px-4 py-3 rounded-xl text-sm font-medium'
              style={{
                background: "var(--score-low-bg)",
                color: "var(--score-low)",
              }}
            >
              {error}
            </div>
          )}

          <div className='w-full space-y-3'>
            <button
              onClick={() => handleCapture("camera")}
              className='w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:opacity-70'
              style={{ background: "var(--accent)", color: "#fff" }}
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
              Take Photo
            </button>
            <button
              onClick={() => handleCapture("library")}
              className='w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:opacity-70'
              style={{
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "1.5px solid var(--border)",
              }}
            >
              <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
                <rect
                  x='3'
                  y='3'
                  width='18'
                  height='18'
                  rx='2'
                  stroke='currentColor'
                  strokeWidth='2'
                />
                <circle cx='8.5' cy='8.5' r='1.5' fill='currentColor' />
                <path
                  d='M21 15l-5-5L5 21'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              Choose from Library
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (step === "analyzing") {
    return (
      <div
        className='flex flex-col h-full items-center justify-center'
        style={{ background: "var(--bg)" }}
      >
        {photoDataUrl && (
          <div className='w-full max-w-sm px-5 mb-6'>
            <img
              src={photoDataUrl}
              alt='Room'
              className='w-full rounded-2xl object-cover'
              style={{ maxHeight: 220 }}
            />
          </div>
        )}
        <LoadingRing mode='staging' />
      </div>
    );
  }

  // Results screen
  return (
    <div className='flex flex-col h-full'>
      <div
        className='flex items-center gap-3 px-5'
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + 30px)`,
          paddingBottom: `calc(env(safe-area-inset-bottom) + 30px)`,
        }}
      >
        <button
          onClick={() => navigate("/staging")}
          className='w-9 h-9 flex items-center justify-center rounded-xl active:opacity-60'
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
        <h1
          className='text-2xl font-bold'
          style={{ color: "var(--text-primary)" }}
        >
          Staging Report
        </h1>
      </div>

      <div className='scroll-area flex-1 px-5 pb-6 space-y-5 fade-in'>
        {/* Photo */}
        {photoDataUrl && (
          <img
            src={photoDataUrl}
            alt='Room'
            className='w-full rounded-2xl object-cover'
            style={{ maxHeight: 240, border: "1px solid var(--border)" }}
          />
        )}

        {/* Suggestions */}
        <div
          className='rounded-3xl p-5 space-y-4'
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
          }}
        >
          <h2
            className='font-bold uppercase text-lg mb-2'
            style={{ color: "var(--text-primary)" }}
          >
            Staging Suggestions
          </h2>
          {suggestions.map((s, i) => (
            <div key={i} className='flex gap-3'>
              <span
                className='w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold'
                style={{
                  background: "var(--accent-hover)",
                  color: "var(--accent)",
                }}
              >
                {i + 1}
              </span>
              <p
                className='text-md font-bold leading-relaxed pb-0.5 translate-y-[-2px]'
                style={{ color: "var(--text-secondary)" }}
              >
                {s}
              </p>
            </div>
          ))}
        </div>

        {/* Rendering */}
        {isRendering && !renderUrl && (
          <div
            className='rounded-3xl p-5'
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <h2
              className='font-bold uppercase text-lg mb-4'
              style={{ color: "var(--text-primary)" }}
            >
              Staged Preview
            </h2>
            <LoadingRing mode='render' />
          </div>
        )}

        {renderUrl && photoDataUrl && (
          <div>
            <h2
              className='font-bold uppercase text-lg mb-3'
              style={{ color: "var(--text-primary)" }}
            >
              Staged Preview
            </h2>
            <BeforeAfterToggle
              beforeUri={photoDataUrl}
              afterUri={renderUrl}
              beforeLabel='Current'
              afterLabel='Staged'
            />
          </div>
        )}
      </div>
    </div>
  );
}
