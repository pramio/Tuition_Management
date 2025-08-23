import dayjs from 'dayjs';

export const nextCycle = (admissionDate, refDate = new Date()) => {
  const adm = dayjs(admissionDate);
  const ref = dayjs(refDate);
  let start =
    adm.date() <= ref.date()
      ? ref.date(adm.date())
      : ref.subtract(1, 'month').date(adm.date());
  let end = start.add(1, 'month');
  return { start: start.startOf('day').toDate(), end: end.startOf('day').toDate() };
};

export const isBirthdayToday = (dob) => {
  const d = dayjs(dob);
  const now = dayjs();
  return d.date() === now.date() && d.month() === now.month();
};
