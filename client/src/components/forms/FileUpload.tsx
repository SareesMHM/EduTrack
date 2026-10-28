import { useRef, useState } from 'react';

export default function FileUpload({ current, onSelect, busy }: { current?: string | null; onSelect: (f: File) => void; busy?: boolean }) {
  const [preview, setPreview] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const input = useRef<HTMLInputElement>(null);

  const pick = (f?: File) => {
    if (!f) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) return setErr('Use a JPEG, PNG or WebP image.');
    if (f.size > 2 * 1024 * 1024) return setErr('Image must be 2 MB or smaller.');
    setErr('');
    setPreview(URL.createObjectURL(f));
    onSelect(f);
  };

  const src = preview ?? current ?? undefined;
  return (
    <div className="flex items-center gap-4">
      {src ? <img src={src} alt="Profile" className="h-16 w-16 rounded-full object-cover" /> : <div className="h-16 w-16 rounded-full bg-paper-line" aria-hidden />}
      <div>
        <button type="button" className="btn-ghost" disabled={busy} onClick={() => input.current?.click()}>{busy ? 'Uploading…' : 'Choose photo'}</button>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        <p className="mt-1 text-xs text-ink-faint">JPEG, PNG or WebP, up to 2 MB.</p>
        {err && <p className="text-xs font-medium text-bad" role="alert">{err}</p>}
      </div>
    </div>
  );
}
