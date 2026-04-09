import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  items: PillNavItem[];
  ease?: string;
  baseColor?: string;
  activePillColor?: string;
  activeTextColor?: string;
  inactiveTextColor?: string;
  hoverTextColor?: string;
  navHeight?: string;
  pillPadX?: string;
  pillGap?: string;
  borderTop?: string;
  paddingTop?: number;
}

const PillNav: React.FC<PillNavProps> = ({
  items,
  ease = "power3.easeOut",
  baseColor = "var(--tab-bar-bg)",
  activePillColor = "var(--accent)",
  activeTextColor = "#ffffff",
  inactiveTextColor = "var(--text-secondary)",
  hoverTextColor = "#ffffff",
  navHeight = "42px",
  pillPadX = "18px",
  pillGap = "10px",
  borderTop = "1px solid var(--tab-bar-border)",
  paddingTop = 10,
}) => {
  const location = useLocation();
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const hoverLabel = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (hoverLabel) gsap.set(hoverLabel, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0,
        );
        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: "auto" }, 0);
        }
        if (hoverLabel) {
          gsap.set(hoverLabel, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            hoverLabel,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0,
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    if (document.fonts) document.fonts.ready.then(layout).catch(() => {});
    return () => window.removeEventListener("resize", layout);
  }, [items, ease]);

  // Reset all hover animations when route changes
  useEffect(() => {
    activeTweenRefs.current.forEach((t) => t?.kill());
    circleRefs.current.forEach((circle, index) => {
      if (!circle) return;
      const pill = circle.parentElement as HTMLElement;
      if (!pill) return;
      const label = pill.querySelector<HTMLElement>(".pill-label");
      const hoverLabel = pill.querySelector<HTMLElement>(".pill-label-hover");
      gsap.set(circle, { scale: 0 });
      if (label) gsap.set(label, { y: 0 });
      if (hoverLabel) gsap.set(hoverLabel, { opacity: 0 });
      tlRefs.current[index]?.seek(0);
    });
  }, [location.pathname]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  const cssVars = {
    ["--base"]: baseColor,
    ["--pill-bg"]: activePillColor,
    ["--hover-text"]: hoverTextColor,
    ["--nav-h"]: navHeight,
    ["--pill-pad-x"]: pillPadX,
    ["--pill-gap"]: pillGap,
  } as React.CSSProperties;

  return (
    <nav
      className='w-full flex items-center justify-center box-border px-4 safe-bottom'
      aria-label='Primary'
      style={{
        ...cssVars,
        background: baseColor,
        borderTop,
        paddingTop,
        paddingBottom: `calc(env(safe-area-inset-bottom) + 10px)`,
      }}
    >
      <div
        className='relative flex items-center rounded-full'
        style={{
          height: "var(--nav-h)",
          background: "var(--base)",
        }}
      >
        <ul
          role='menubar'
          className='list-none flex justify-between mx-auto p-[3px] h-full'
          style={{ gap: "var(--pill-gap)" }}
        >
          {items.map((item, i) => {
            const isActive = location.pathname.startsWith(item.href);

            const pillStyle: React.CSSProperties = {
              background: isActive ? "var(--pill-bg)" : "transparent",
              color: isActive ? activeTextColor : inactiveTextColor,
              paddingLeft: "var(--pill-pad-x)",
              paddingRight: "var(--pill-pad-x)",
            };

            const PillContent = (
              <>
                <span
                  className='hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none'
                  style={{ background: "var(--base)", willChange: "transform" }}
                  aria-hidden='true'
                  ref={(el) => {
                    circleRefs.current[i] = el;
                  }}
                />
                <span className='label-stack relative inline-block leading-[1] z-[2]'>
                  <span
                    className='pill-label relative z-[2] inline-block leading-[1]'
                    style={{ willChange: "transform" }}
                  >
                    {item.label}
                  </span>
                  <span
                    className='pill-label-hover absolute left-0 top-0 z-[3] inline-block'
                    style={{
                      color: "var(--hover-text)",
                      willChange: "transform, opacity",
                    }}
                    aria-hidden='true'
                  >
                    {item.label}
                  </span>
                </span>
              </>
            );

            const basePillClasses =
              "relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-sm leading-[0] tracking-[0.2px] whitespace-nowrap cursor-pointer px-0 transition-colors duration-200";

            return (
              <li key={item.href} role='none' className='flex h-full'>
                <Link
                  role='menuitem'
                  to={item.href}
                  className={basePillClasses}
                  style={pillStyle}
                  aria-label={item.ariaLabel || item.label}
                  aria-current={isActive ? "page" : undefined}
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  {PillContent}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default PillNav;
