export const overallGrade = (marks) => {
  const total = marks.reduce((s, m) => s + (m.scored || 0), 0);
  const max = marks.reduce((s, m) => s + (m.max || 100), 0);
  const pct = max ? (total / max) * 100 : 0;
  if (pct >= 90) return 'A+';
  if (pct >= 80) return 'A';
  if (pct >= 70) return 'B';
  if (pct >= 60) return 'C';
  if (pct >= 50) return 'D';
  return 'E';
};
