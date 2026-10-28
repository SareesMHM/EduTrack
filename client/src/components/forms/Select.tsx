import { SelectHTMLAttributes } from 'react';

interface Props extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function Select({ options, value, onChange, placeholder = 'Select…', ...rest }: Props) {
  return (
    <select {...rest} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
