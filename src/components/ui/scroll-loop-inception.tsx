"use client"

import { useEffect, useRef, useState } from "react"
import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

// Ember CTA button. A dark #2a2a2a base whose face holds a
// 3px-cell doom-fire canvas: when `lit`, molten fire fills the button from the
// bottom like a liquid gauge (exponential ease, churning waterline), hovering
// bends the flames toward the cursor, pressing fires a burst pulse. The label
// dims to 40% white while the fire is out.

const STEPS = 38
const CELL = 3
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

function buildPalette(alpha: number) {
  const p = new Uint8Array(STEPS * 4)
  for (let s = 0; s < STEPS; s++) {
    const t = s / (STEPS - 1)
    let r: number
    let g: number
    let b: number
    if (t < 0.4) {
      const e = t / 0.4
      r = lerp(120, 218, e)
      g = lerp(20, 58, e)
      b = 0
    } else if (t < 0.75) {
      const e = (t - 0.4) / 0.35
      r = lerp(218, 255, e)
      g = lerp(58, 138, e)
      b = lerp(0, 42, e)
    } else {
      const e = (t - 0.75) / 0.25
      r = 255
      g = lerp(138, 228, e)
      b = lerp(42, 157, e)
    }
    p[s * 4] = r
    p[s * 4 + 1] = g
    p[s * 4 + 2] = b
    p[s * 4 + 3] = Math.round(t ** 1.2 * alpha)
  }
  return p
}

function FireCanvas({
  litRef,
  hoverRef,
  pressedRef,
}: {
  litRef: React.RefObject<boolean>
  hoverRef: React.RefObject<boolean>
  pressedRef: React.RefObject<boolean>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const cols = Math.max(8, Math.ceil((canvas.offsetWidth || 160) / CELL))
    const rows = Math.max(8, Math.ceil((canvas.offsetHeight || 38) / CELL))
    canvas.width = cols
    canvas.height = rows

    const palette = buildPalette(180)
    const heat = new Uint8Array(cols * rows)
    const waterline = new Float32Array(cols)
    let maxHeat = 0
    let pointerX = cols / 2
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width > 0) pointerX = ((e.clientX - rect.left) / rect.width) * cols
    }
    const parent = canvas.parentElement
    parent?.addEventListener("pointermove", onMove)

    const img = ctx.createImageData(cols, rows)
    let level = litRef.current ? 1 : 0

    // First paint synchronously: a lit button is molten from frame zero, even
    // if the rAF loop has not ticked yet (throttled tabs, mid-scroll mounts).
    if (level === 1) {
      const d = img.data
      for (let o = 0; o < d.length; o += 4) {
        d[o] = 218
        d[o + 1] = 58
        d[o + 2] = 0
        d[o + 3] = 255
      }
      ctx.putImageData(img, 0, 0)
    }

    let raf = 0
    let lastT = 0
    let acc = 0
    let burst = 0
    let wasPressed = false
    let alive = true
    const TICK = 1000 / 30

    const step = (t: number) => {
      if (!alive) return
      raf = requestAnimationFrame(step)
      lastT ||= t
      const dt = Math.min(64, t - lastT)
      lastT = t

      // Fill level eases toward the lit state.
      if (litRef.current) level += (1 - level) * (1 - Math.exp(-dt / 240))
      else if (level > 0) {
        level += (0 - level) * (1 - Math.exp(-dt / 320))
        if (level < 0.02) level = 0
      }

      acc += dt
      if (acc >= TICK) {
        acc %= TICK

        // Churning waterline: random walk per column, smoothed 1-2-1.
        for (let x = 0; x < cols; x++) {
          waterline[x] = Math.max(
            -4,
            Math.min(4, (waterline[x] ?? 0) + (Math.random() - 0.5) * 1.6),
          )
        }
        for (let x = 1; x < cols - 1; x++) {
          waterline[x] =
            ((waterline[x - 1] ?? 0) + (waterline[x] ?? 0) * 2 + (waterline[x + 1] ?? 0)) /
            4
        }

        // Propagate upward; cooling is harsher while unlit.
        const cool = litRef.current ? 0 : 1
        for (let y = 0; y < rows - 1; y++) {
          for (let x = 0; x < cols; x++) {
            const src = (y + 1) * cols + x
            const dst =
              y * cols +
              Math.min(cols - 1, Math.max(0, x + ((Math.random() * 3) | 0) - 1))
            const v = (heat[src] ?? 0) - (1 + cool + ((Math.random() * 2.4) | 0))
            heat[dst] = v > 0 ? v : 0
          }
        }

        const churn = level * (1 - level) * 4
        const fill = level * (rows + 6)

        // Press pulse: spikes on press, sustains while held, decays after.
        if (pressedRef.current && !wasPressed) burst = 1
        wasPressed = !!pressedRef.current
        burst = pressedRef.current ? Math.max(burst * 0.86, 0.45) : burst * 0.8

        if (litRef.current) {
          for (let x = 0; x < cols; x++) {
            const h = fill + (waterline[x] ?? 0) * (0.4 + churn)
            const surface = rows - 1 - Math.floor(h)
            // The molten surface line burns at max heat.
            if (level > 0.02 && surface >= 0 && surface < rows) {
              heat[surface * cols + x] = STEPS - 1
              if (surface + 1 < rows) heat[(surface + 1) * cols + x] = STEPS - 1
            }
            if (level > 0.97) {
              if (burst > 0.05) {
                heat[(rows - 1) * cols + x] = STEPS - 1
                heat[(rows - 2) * cols + x] = STEPS - 1
                if (rows > 2 && Math.random() < burst)
                  heat[(rows - 3) * cols + x] = STEPS - 1
                if (Math.random() < burst * 0.3)
                  heat[((Math.random() * rows) | 0) * cols + x] = STEPS - 1
              } else if (hoverRef.current) {
                heat[(rows - 1) * cols + x] = STEPS - 1
                if (Math.random() < 0.7) heat[(rows - 2) * cols + x] = STEPS - 2
                const d = x - pointerX
                const near = Math.exp(-(d * d) / 18)
                if (near > 0.35 && rows > 2) heat[(rows - 3) * cols + x] = STEPS - 1
                if (near > 0.7 && rows > 3) heat[(rows - 4) * cols + x] = STEPS - 3
              } else if (Math.random() < 0.55) {
                heat[(rows - 1) * cols + x] =
                  Math.random() < 0.5 ? STEPS - 11 : STEPS - 17
              }
            }
          }
        }
      }

      if (level === 0 && maxHeat === 0) {
        ctx.clearRect(0, 0, cols, rows)
        return
      }

      // Render: solid molten body below the fill line (blended over #DA3A00),
      // translucent flames above it.
      maxHeat = 0
      const d = img.data
      const churn = level * (1 - level) * 4
      const fill = level * (rows + 6)
      for (let x = 0; x < cols; x++) {
        const h = fill + (waterline[x] ?? 0) * (0.4 + churn)
        for (let y = 0; y < rows; y++) {
          const idx = y * cols + x
          const o = idx * 4
          const v = heat[idx] ?? 0
          if (v > maxHeat) maxHeat = v
          const pi = v * 4
          const a = palette[pi + 3]!
          if (rows - y <= h) {
            d[o] = 218 + (((palette[pi]! - 218) * a) >> 8)
            d[o + 1] = 58 + (((palette[pi + 1]! - 58) * a) >> 8)
            d[o + 2] = 0 + (((palette[pi + 2]! - 0) * a) >> 8)
            d[o + 3] = 255
          } else {
            d[o] = palette[pi]!
            d[o + 1] = palette[pi + 1]!
            d[o + 2] = palette[pi + 2]!
            d[o + 3] = a
          }
        }
      }
      ctx.putImageData(img, 0, 0)
    }
    raf = requestAnimationFrame(step)

    return () => {
      alive = false
      cancelAnimationFrame(raf)
      parent?.removeEventListener("pointermove", onMove)
    }
  }, [litRef, hoverRef, pressedRef])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:pixelated]"
    />
  )
}

export function PixelFireButton({
  children,
  lit = true,
  variant = "primary",
  className,
  style,
  overlay,
  tabIndex,
  type,
  onClick,
  disabled,
}: {
  children: React.ReactNode
  /** Fire on or out. Out = dark base, dimmed label, embers dying. */
  lit?: boolean
  variant?: "primary" | "ghost"
  className?: string
  /** Merged into the button style, e.g. the width morph while submitting */
  style?: React.CSSProperties
  /** Absolute layers over the fire, e.g. spinner and success check */
  overlay?: React.ReactNode
  tabIndex?: number
  type?: "button" | "submit"
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}) {
  const litRef = useRef(lit)
  const hoverRef = useRef(false)
  const pressedRef = useRef(false)
  litRef.current = lit

  if (variant === "ghost") {
    return (
      <button
        type={type ?? "button"}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-[38px] items-center justify-center gap-2 rounded-md border border-[#f4f1ea]/15 bg-[#16140f] px-4 text-sm font-semibold tracking-[-0.015em] text-[#f4f1ea]",
          "transition-[scale,border-color,box-shadow,color] duration-150 active:scale-[0.985]",
          "hover:border-[#ff8a3d]/40 hover:text-[#ffd6bf]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a3d]",
          disabled && "opacity-50 pointer-events-none",
          className,
        )}
      >
        {children}
      </button>
    )
  }

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => {
        hoverRef.current = true
      }}
      onMouseLeave={() => {
        hoverRef.current = false
        pressedRef.current = false
      }}
      onPointerDown={() => {
        pressedRef.current = true
      }}
      onPointerUp={() => {
        pressedRef.current = false
      }}
      tabIndex={tabIndex}
      style={{
        color: lit ? "#ffffff" : "rgba(255, 255, 255, 0.4)",
        transition:
          "color 400ms ease, transform 120ms ease-out, width 380ms cubic-bezier(0.65, 0, 0.2, 1), padding 380ms cubic-bezier(0.65, 0, 0.2, 1)",
        ...style,
      }}
      className={cn(
        "relative inline-flex h-[38px] shrink-0 items-center justify-center overflow-hidden whitespace-nowrap rounded-md border-none bg-[#2a2a2a] px-4 text-sm font-semibold tracking-[-0.015em] active:scale-[0.985]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8a3d]",
        disabled && "pointer-events-none",
        className,
      )}
    >
      <FireCanvas litRef={litRef} hoverRef={hoverRef} pressedRef={pressedRef} />
      <span className="relative">{children}</span>
      {overlay}
    </button>
  )
}

// Scroll inception, the looped edition: a site stuck inside its own browser
// window, Droste style. Scrolling dives INTO the window on the page; the
// moment it fills the screen the cycle wraps seamlessly and you are falling
// again. One camera transform, exponential zoom path, nested self-similar
// screens whose copy shifts by depth so the seam is invisible.

const W = 1200
const H = 760
const BAR = 48
// Zoom factor between levels: the inner window is 1/K of the screen.
const K = 2.8
// Inner window center offset from the screen center (px, screen space).
const D_Y = 180
// How many dives one pass of the section performs.
const DIVES = 3
// Nested copies to render; deeper ones are a few px tall.
const LEVELS = 4

export type InceptionScreen = { eyebrow: string; heading: string; sub?: string }

const DEFAULT_SCREENS: InceptionScreen[] = [
  {
    eyebrow: "loop 00",
    heading: "This site contains itself.",
    sub: "The window below is this exact page.",
  },
  {
    eyebrow: "loop 01",
    heading: "You are inside the site now.",
    sub: "Same page, one level down.",
  },
  {
    eyebrow: "loop 02",
    heading: "Deeper. Still the same site.",
    sub: "Only the scale changed.",
  },
  {
    eyebrow: "loop 03",
    heading: "It loops forever.",
    sub: "Scroll back up to climb out.",
  },
]

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function Screen({
  level,
  depth,
  screens,
  url,
  buttonLabel,
}: {
  level: number
  depth: number
  screens: InceptionScreen[]
  url: string
  buttonLabel: string
}) {
  const idx = (depth + level) % screens.length
  const text = screens[idx]!
  const innerW = W / K
  const innerH = H / K

  return (
    <div
      style={{ width: W, height: H }}
      className="flex flex-col overflow-hidden rounded-2xl bg-[#FFFDF8] shadow-[0_0_0_1px_rgba(29,26,22,0.1),0_24px_80px_rgba(29,26,22,0.22)]"
    >
      {/* Browser chrome. Hidden until the dive starts (--ek-bar), so the
          section reads as a plain page at rest. Uniform across levels, so the
          loop seam never flashes a bar in or out. */}
      <div
        style={{ height: BAR, opacity: "var(--ek-bar, 1)" }}
        className="flex shrink-0 items-center gap-3 border-b border-[#1D1A16]/8 bg-[#F6F2E9] px-4"
      >
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-7 w-80 items-center justify-center gap-1.5 rounded-md bg-[#1D1A16]/5 text-xs text-[#6E675C]">
          <Lock className="size-3" />
          {url}
          <span className="font-mono text-[10px] text-[#6D5BFF]">×{idx}</span>
        </div>
        <span className="w-10" />
      </div>

      {/* Page */}
      <div className="relative min-h-0 flex-1">
        <div className="flex flex-col items-center px-8 pt-14 text-center">
          <p className="font-mono text-[11px] tracking-[0.12em] text-[#6D5BFF]">
            {text.eyebrow}
          </p>
          <h3 className="mt-3 max-w-2xl text-balance font-averia text-[44px] leading-[1.05] text-[#1D1A16]">
            {text.heading}
          </h3>
          {text.sub && (
            <p className="mt-4 max-w-md text-pretty text-sm leading-relaxed text-[#6E675C]">
              {text.sub}
            </p>
          )}
          <div className="mt-6">
            {level < 2 ? (
              // The camera only ever looks at levels 0 and 1: content rotates
              // by depth, the camera snaps back each dive.
              <PixelFireButton>{buttonLabel}</PixelFireButton>
            ) : (
              // Deeper copies are a few pixels tall; a facsimile keeps them cheap.
              <div className="relative h-[38px] w-[150px] overflow-hidden rounded-md bg-[#2a2a2a]">
                <div className="absolute inset-x-0 bottom-0 h-2.5 bg-gradient-to-t from-[#e5470f] to-transparent" />
              </div>
            )}
          </div>
        </div>

        {/* The next level: this same screen, 1/K scale, centered lower */}
        {level + 1 < LEVELS ? (
          <div
            style={{
              position: "absolute",
              left: (W - innerW) / 2,
              top: H / 2 + D_Y - BAR - innerH / 2,
              width: innerW,
              height: innerH,
            }}
          >
            <div
              style={{
                width: W,
                height: H,
                transform: `scale(${1 / K})`,
                transformOrigin: "top left",
              }}
            >
              <Screen
                level={level + 1}
                depth={depth}
                screens={screens}
                url={url}
                buttonLabel={buttonLabel}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              position: "absolute",
              left: (W - innerW) / 2,
              top: H / 2 + D_Y - BAR - innerH / 2,
              width: innerW,
              height: innerH,
            }}
            className="rounded-md bg-[#EFE9DC] shadow-[0_0_0_1px_rgba(29,26,22,0.08)]"
          />
        )}
      </div>
    </div>
  )
}

export function ScrollInception({
  screens = DEFAULT_SCREENS,
  url = "yoursite.com",
  buttonLabel = "Get early access",
  revealChrome = true,
  className,
}: {
  /** Copy per dive level; cycles, so the wrap stays seamless */
  screens?: InceptionScreen[]
  url?: string
  buttonLabel?: string
  /**
   * Keep the browser bars hidden until the dive starts, so the section reads
   * as a plain page at rest. Pass false to show them from the first frame.
   */
  revealChrome?: boolean
  className?: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const [depth, setDepth] = useState(0)
  const depthRef = useRef(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const fitEl = fitRef.current
    const camera = cameraRef.current
    if (!section || !fitEl || !camera) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let raf = 0

    const apply = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const vh = window.innerHeight
      const vw = window.innerWidth
      const denom = rect.height - vh
      const p = reduced ? 0 : denom > 0 ? clamp(-rect.top / denom, 0, 1) : 0

      // Cover-fit the 1200x760 screen into the viewport.
      const fit = Math.max(vw / W, vh / H)
      fitEl.style.transform = `scale(${fit})`

      // Which dive we are on, and how far into it.
      const ft = Math.min(p * DIVES, DIVES - 0.0001)
      const d = Math.floor(ft)
      const f = ft - d

      // Exponential camera: constant perceived dive speed, seamless at f=1.
      const sigma = Math.pow(K, f)
      const cy = D_Y * ((sigma - 1) / (K - 1))
      camera.style.transform = `translateY(${-cy * sigma}px) scale(${sigma})`

      // Browser bars fade in over the first slice of the dive, on every level
      // at once, so the wrap never catches a bar half-faded.
      section.style.setProperty(
        "--ek-bar",
        revealChrome ? clamp(p / 0.08, 0, 1).toFixed(3) : "1",
      )

      if (d !== depthRef.current) {
        depthRef.current = d
        setDepth(d)
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = String(clamp(1 - p * 14, 0, 1))
      }
      if (counterRef.current) {
        counterRef.current.textContent = `${(ft + 0).toFixed(2).replace(".", ":")} / ${DIVES}`
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }

    apply()
    setReady(true)
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [revealChrome])

  return (
    <section
      ref={sectionRef}
      // Start hidden so the first paint (before the scroll effect runs) has
      // no browser bars either.
      style={{ "--ek-bar": revealChrome ? 0 : 1 } as React.CSSProperties}
      className={cn("relative h-[380vh] bg-[#F3EFE6]", className)}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden bg-[radial-gradient(120%_100%_at_50%_0%,#FBF9F3_0%,#F3EFE6_55%,#E9E3D5_100%)]">
        <div
          ref={fitRef}
          style={{ visibility: ready ? "visible" : "hidden" }}
          className="shrink-0"
        >
          <div ref={cameraRef} className="will-change-transform">
            <Screen
              level={0}
              depth={depth}
              screens={screens}
              url={url}
              buttonLabel={buttonLabel}
            />
          </div>
        </div>

        {/* Dive meter */}
        <span
          ref={counterRef}
          className="pointer-events-none absolute bottom-6 right-6 font-mono text-[11px] tabular-nums text-[#6E675C]"
        >
          0:00 / {DIVES}
        </span>

        {/* Scroll hint, dies as soon as the dive starts */}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.12em] text-[#6E675C]"
        >
          scroll
        </div>
      </div>
    </section>
  )
}

export default ScrollInception;
