import { useEffect, useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';

export default function SearchBar({ onSearch, placeholder = 'Search' }: { onSearch: (q: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('');
  const debounced = useDebounce(value);
  useEffect(() => { onSearch(debounced); }, [debounced]); // eslint-disable-line react-hooks/exhaustive-deps
  return <input className="input max-w-xs" type="search" value={value} onChange={(e) => setValue(e.target.value)} placeholder={placeholder} aria-label={placeholder} />;
}
