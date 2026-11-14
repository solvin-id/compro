import type { Portfolio } from '@/db/schema'
import { cn } from '@/lib/utils'
import { ImageFromStorage } from '../ImageFromStorage'

interface ProjectPlateProps {
  item: Portfolio
  index: number
  variant?: 'card' | 'hero'
}

function PendingPlate({ item, index }: { item: Portfolio; index: number }) {
  return (
    <div className="blueprint-grid relative h-full w-full bg-surface-2">
      <span
        aria-hidden="true"
        className="absolute inset-0 flex select-none items-center justify-center text-[clamp(4rem,16vw,9rem)] font-semibold tracking-[-0.045em] text-line-strong"
      >
        0{index + 1}
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center font-mono text-lg text-ink-muted"
      >
        +
      </span>
      <span className="label-mono absolute right-4 top-4 text-ink-muted">
        {item.sector}
      </span>
      <span className="label-mono absolute bottom-4 left-4 text-ink-muted">
        [ PREVIEW PENDING ]
      </span>
    </div>
  )
}

export function ProjectPlate({
  item,
  index,
  variant = 'card',
}: ProjectPlateProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-surface-2',
        variant === 'hero' ? 'aspect-[16/9]' : 'aspect-[4/3]',
      )}
    >
      {item.image ? (
        <ImageFromStorage
          objectKey={item.image}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover"
          fallback={<PendingPlate item={item} index={index} />}
        />
      ) : (
        <PendingPlate item={item} index={index} />
      )}
    </div>
  )
}
