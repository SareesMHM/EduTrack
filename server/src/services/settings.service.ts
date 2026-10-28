import { prisma } from '../config/db';

export const DEFAULTS: Record<string, string> = {
  schoolName: 'EduTrack School',
  lowAttendanceThreshold: '75',
  academicYear: String(new Date().getFullYear()),
};

export async function getSettings() {
  const rows = await prisma.setting.findMany();
  return { ...DEFAULTS, ...Object.fromEntries(rows.map((r) => [r.key, r.value])) };
}

export async function updateSettings(input: Record<string, string>) {
  const keys = Object.keys(DEFAULTS);
  await prisma.$transaction(
    Object.entries(input)
      .filter(([k]) => keys.includes(k))
      .map(([key, value]) => prisma.setting.upsert({ where: { key }, create: { key, value }, update: { value } })),
  );
  return getSettings();
}
