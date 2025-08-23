import PDFDocument from 'pdfkit';

export const buildReportCardPDF = async ({ student, exam, grade, logoPath, brandName = 'Tuition Center' }) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));

    try {
      if (logoPath) doc.image(logoPath, 50, 30, { width: 60 });
    } catch {}

    doc.fontSize(18).text(`${brandName} — Report Card`, 120, 40);
    doc.moveDown();

    doc.fontSize(12).text(`Student: ${student.name}`);
    doc.text(`Batch: ${student.batch?.name || ''}`);
    doc.text(`Term: ${exam.term}`);
    doc.moveDown();

    doc.text('Subjects & Marks:');
    exam.marks.forEach((m) => {
      doc.text(`- ${m.subject}: ${m.scored}/${m.max}`);
    });
    doc.moveDown();
    doc.fontSize(14).text(`Overall Grade: ${grade}`, { underline: true });

    doc.end();
  });
};
