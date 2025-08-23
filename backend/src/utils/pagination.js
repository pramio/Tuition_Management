export const computeFine = ({ status, forgotBook }) => {
  let fine = 0;
  if (status === 'Absent') fine += 10;
  if (status === 'Present' && forgotBook) fine += 5;
  return fine;
};
