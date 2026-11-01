import { pad2, shortStudioName } from '../../lib/studio-utils'

/** Compact, keyboard-friendly studio picker under the map (synchronised with the markers). */
export default function MapLocationSelector({ studios, selectedId, onSelect, controlsId }) {
  return (
    <div className="mt-4 md:mt-5">
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5 lg:gap-3" aria-label="Wybierz studio na mapie">
        {studios.map((studio, i) => {
          const active = studio.id === selectedId
          return (
            <li key={studio.id}>
              <button
                type="button"
                onClick={(event) => onSelect(studio.id, event.currentTarget, event)}
                data-studio-selector={studio.id}
                aria-pressed={active}
                aria-controls={controlsId}
                // Selected = dark fill; keyboard focus = separate ink outline with an offset ring,
                // so the two states never look alike.
                className={`group flex min-h-14 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-[background-color,border-color,box-shadow] duration-500 ease-luxe focus-visible:outline-ink-900 focus-visible:outline-offset-3 ${
                  active
                    ? 'border-brand-400 bg-ink-900 shadow-[0_16px_34px_-20px_rgba(23,23,23,0.75),inset_0_0_0_1px_var(--color-brand-400)]'
                    : 'border-brand-200 bg-ivory-50/70 hover:border-brand-300 hover:bg-ivory-50'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-9 shrink-0 place-items-center rounded-full border-2 text-[0.8rem] font-bold tabular-nums transition-colors duration-500 ease-luxe ${
                    active ? 'border-brand-400 bg-brand-600 text-ivory-50' : 'border-brand-400 bg-ink-900 text-brand-400'
                  }`}
                >
                  {pad2(i + 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate font-serif text-[1.15rem] leading-tight transition-colors duration-500 ease-luxe lg:text-[1.2rem] ${
                      active ? 'text-ivory-50' : 'text-ink-900'
                    }`}
                  >
                    {shortStudioName(studio.name)}
                  </span>
                  <span
                    className={`block truncate text-[0.8rem] transition-colors duration-500 ease-luxe ${
                      active ? 'text-ivory-300' : 'text-ink-600'
                    }`}
                  >
                    {studio.street}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
