export default function MultiSelect({ options, value, onChange, label }: {
  options: { value: string; label: string }[]; value: string[]; onChange: (v: string[]) => void; label: string;
}) {
  const toggle = (v: string) => onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  return (
    <fieldset className="rounded-md border border-paper-line p-3">
      <legend className="px-1 text-sm font-medium text-ink-soft">{label}</legend>
      {options.length === 0 && <p className="text-sm text-ink-faint">No options available.</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value.includes(o.value);
          return (
            <label key={o.value} className={`cursor-pointer rounded-full border px-3 py-1 text-sm ${on ? 'border-brand bg-brand-light text-brand-dark' : 'border-paper-line'}`}>
              <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
