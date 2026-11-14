import { useTranslation } from 'react-i18next'
import { useTeamData } from '@/hooks/useTranslatedData'
import { BoundingBoxFrame, SchematicSectionHeader } from '../ui/blueprint'

export function Personnel() {
  const { t } = useTranslation()
  const members = useTeamData()

  return (
    <section
      id="personnel"
      aria-labelledby="personnel-title"
      className="border-b border-line"
    >
      <div className="p-5 md:p-8 lg:p-12">
        <SchematicSectionHeader
          index={5}
          total={7}
          id="personnel"
          label="PERSONNEL"
          title={t('team.title')}
          description={t('team.subtitle')}
        />

        <div className="mt-12 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-5">
          {members.map((member, index) => (
            <article
              key={member.id}
              className="group border-r border-b border-line bg-surface"
            >
              <BoundingBoxFrame
                baseBorder={false}
                label={`PRS-0${index + 1}`}
                meta={member.role}
                className="bbf--meta-inset bg-surface"
              >
                <div className="aspect-[4/5] overflow-hidden bg-surface-2">
                  {member.profileImage ? (
                    <img
                      src={member.profileImage}
                      alt={member.name}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-top grayscale transition-[filter] duration-150 ease-cad group-hover:grayscale-0"
                    />
                  ) : (
                    <span className="label-mono flex h-full items-center justify-center text-ink-muted">
                      [ PORTRAIT ]
                    </span>
                  )}
                </div>
                <div className="p-5 pb-8">
                  <h3 className="text-base font-semibold tracking-[-0.02em] text-ink">
                    {member.name}
                  </h3>
                  <p className="label-mono mt-1 text-accent-strong">{member.role}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                    {member.bio}
                  </p>
                </div>
              </BoundingBoxFrame>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
