import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSpacesStore } from "@/store/spacesStore";
import { useSettingsStore } from "@/store/settingsStore";
import { Header } from "@/components/layout/Header";
import { capturePhoto } from "@/hooks/useCamera";
import { analyzeSpace } from "@/services/ai/AIService";
import { generateRoomRendering } from "@/services/imageGen/ImageGenService";
import { mockAmazonAdapter } from "@/services/amazon/MockAmazonAdapter";
import { LoadingRing } from "@/components/ui/LoadingRing";
import type { Scan } from "@/types";

type Step = "capture" | "analyzing" | "rendering" | "done";

export function ScanScreen() {
  const { spaceId } = useParams<{ spaceId: string }>();
  const navigate = useNavigate();
  const { addScan, updateScanRendering } = useSpacesStore();
  const { openRouterModel, replicateModel } = useSettingsStore();

  const [step, setStep] = useState<Step>("capture");
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanId] = useState(() => crypto.randomUUID());

  async function handleCapture(source: "camera" | "library") {
    setError(null);
    const result = await capturePhoto(source);
    if (!result) return;
    setPhotoDataUrl(result.dataUrl);
    runAnalysis(result.dataUrl, result.localUri);
  }

  async function runAnalysis(dataUrl: string, localUri: string) {
    if (!spaceId) return;
    setStep("analyzing");

    try {
      const analysis = await analyzeSpace(dataUrl, openRouterModel);

      // Fetch Amazon products for each suggested category
      const productPromises = analysis.productCategories
        .slice(0, 3)
        .map((cat) => mockAmazonAdapter.searchProducts(cat, 2));
      const productGroups = await Promise.all(productPromises);
      // Deduplicate by ASIN — same product can appear across multiple categories
      const seen = new Set<string>();
      const products = productGroups
        .flat()
        .filter((p) => {
          if (seen.has(p.asin)) return false;
          seen.add(p.asin);
          return true;
        })
        .slice(0, 6);

      const scan: Scan = {
        id: scanId,
        spaceId,
        date: new Date().toISOString(),
        photoUri: localUri,
        score: analysis.score,
        breakdownMetrics: analysis.breakdownMetrics,
        strengths: analysis.strengths,
        weaknesses: analysis.weaknesses,
        estimatedMinutes: analysis.estimatedMinutes ?? 30,
        resetSteps: analysis.resetSteps ?? [],
        productSuggestions: products,
      };

      await addScan(spaceId, scan);
      setStep("rendering");

      // Fire-and-forget rendering (non-blocking)
      const renderPrompt = `${analysis.weaknesses.join(". ")} Optimized organization with clean storage solutions.`;
      generateRoomRendering(dataUrl, renderPrompt, replicateModel)
        .then((uri) => updateScanRendering(spaceId, scanId, uri))
        .catch(() => {
          /* rendering is optional */
        });

      setStep("done");
      navigate(`/spaces/${spaceId}`, { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Analysis failed. Please try again.",
      );
      setStep("capture");
    }
  }

  if (step === "analyzing" || step === "rendering") {
    return (
      <div
        className='flex flex-col h-full items-center justify-center'
        style={{ background: "var(--bg)" }}
      >
        {photoDataUrl && (
          <div className='w-full max-w-sm mx-auto px-5 mb-6'>
            <img
              src={photoDataUrl}
              alt='Your space'
              className='w-full rounded-2xl object-cover'
              style={{ maxHeight: 220, border: "1px solid var(--border)" }}
            />
          </div>
        )}
        <LoadingRing mode='analysis' />
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <Header onBack={() => navigate(-1)}>New Scan</Header>

      <div className='flex-1 flex flex-col items-center justify-center px-5 gap-6'>
        {/* Illustration */}
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
            className='text-3xl font-bold mb-2'
            style={{ color: "var(--text-primary)" }}
          >
            Capture Your Space
          </h2>
          <p
            className='text-sm leading-relaxed'
            style={{ color: "var(--text-secondary)" }}
          >
            Take a clear photo of your room. Make sure the whole space is
            visible for the best analysis.
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
            className='w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:opacity-70 transition-opacity'
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
            className='w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-3 active:opacity-70 transition-opacity'
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
