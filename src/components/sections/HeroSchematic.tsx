/**
 * Decorative system schematic: three stacked planes, four labelled nodes and a
 * dashed signal path. Pure inline SVG — no canvas, no external assets.
 */
export function HeroSchematic() {
  return (
    <svg
      viewBox="0 0 560 560"
      role="presentation"
      aria-hidden="true"
      className="h-auto w-full"
      style={{ fontFamily: 'var(--font-mono)' }}
    >
      <defs>
        <pattern
          id="hero-schematic-grid"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 24 0 L 0 0 0 24"
            fill="none"
            strokeWidth="1"
            className="stroke-line"
          />
        </pattern>
      </defs>

      <rect width="560" height="560" fill="url(#hero-schematic-grid)" />

      {/* Registration ticks */}
      <path d="M0 16 L0 0 L16 0" fill="none" strokeWidth="1" className="stroke-line-strong" />
      <path d="M544 0 L560 0 L560 16" fill="none" strokeWidth="1" className="stroke-line-strong" />
      <path d="M0 544 L0 560 L16 560" fill="none" strokeWidth="1" className="stroke-line-strong" />
      <path d="M560 544 L560 560 L544 560" fill="none" strokeWidth="1" className="stroke-line-strong" />

      {/* Stacked planes */}
      <polygon
        points="280,90 470,185 280,280 90,185"
        fill="none"
        strokeWidth="1"
        className="stroke-line-strong"
      />
      <polygon
        points="280,170 470,265 280,360 90,265"
        fill="none"
        strokeWidth="1"
        className="stroke-line"
      />
      <polygon
        points="280,250 470,345 280,440 90,345"
        fill="none"
        strokeWidth="1"
        className="stroke-line"
      />

      {/* Signal path */}
      <path
        d="M280 90 L470 185 L470 265 L280 440"
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        className="schematic-flow stroke-accent"
      />

      {/* Nodes */}
      <rect x="275" y="85" width="10" height="10" className="fill-accent" />
      <rect x="85" y="180" width="10" height="10" className="fill-surface stroke-accent" strokeWidth="1" />
      <rect x="465" y="260" width="10" height="10" className="fill-surface stroke-accent" strokeWidth="1" />
      <rect x="275" y="435" width="10" height="10" className="fill-surface stroke-accent" strokeWidth="1" />

      {/* Node labels */}
      <text x="292" y="88" fontSize="9" letterSpacing="0.06em" className="fill-ink-muted">
        CLIENT
      </text>
      <text x="100" y="176" fontSize="9" letterSpacing="0.06em" className="fill-ink-muted">
        EDGE
      </text>
      <text
        x="458"
        y="254"
        fontSize="9"
        letterSpacing="0.06em"
        textAnchor="end"
        className="fill-ink-muted"
      >
        SERVICE
      </text>
      <text x="292" y="452" fontSize="9" letterSpacing="0.06em" className="fill-ink-muted">
        DATA
      </text>

      {/* Centre crosshair */}
      <path d="M266 265 L294 265" strokeWidth="1" className="stroke-line-strong" />
      <path d="M280 251 L280 279" strokeWidth="1" className="stroke-line-strong" />
      <circle cx="280" cy="265" r="3" fill="none" strokeWidth="1" className="stroke-accent" />

      <text x="16" y="544" fontSize="9" letterSpacing="0.06em" className="fill-ink-muted">
        FIG. 01
      </text>
      <text
        x="544"
        y="544"
        fontSize="9"
        letterSpacing="0.06em"
        textAnchor="end"
        className="fill-ink-muted"
      >
        560 × 560
      </text>
    </svg>
  )
}
