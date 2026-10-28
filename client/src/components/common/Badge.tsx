import { ReactNode } from 'react';

const tones = {
  neutral: 'bg-paper text-ink-soft', good: 'bg-good-light text-good', warn: 'bg-warn-light text-warn',
  bad: 'bg-bad-light text-bad', brand: 'bg-brand-light text-brand-dark',
};
export type Tone = keyof typeof tones;

export default function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
