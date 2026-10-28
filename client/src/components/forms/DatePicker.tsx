export default function DatePicker({ value, onChange, max, min, id }: { value: string; onChange: (v: string) => void; max?: string; min?: string; id?: string }) {
  return <input id={id} type="date" className="input" value={value} max={max} min={min} onChange={(e) => onChange(e.target.value)} />;
}
