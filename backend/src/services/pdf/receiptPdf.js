import PDFDocument from 'pdfkit';
import fs from 'fs';
import dayjs from 'dayjs';
import numberToWords from 'num-words';

function generateHeader(doc, brandName, logoPath) {
  // Top blue bar
  doc
    .rect(0, 0, doc.page.width, 30)
    .fill('#0ea5e9');

  // Logo or brand name on the left
  if (logoPath && fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 45, { width: 30 });
  } else {
    doc
      .fillColor('#000')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(brandName || 'SciencePlus Tuition', 50, 50);
  }
  
  doc
    .fillColor('#666')
    .fontSize(8)
    .text('TAGLINE HERE', 50, 65);

  // RECEIPT title in center
  doc
    .fillColor('#000')
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('RECEIPT', 0, 50, { align: 'center', width: doc.page.width });

  // Company info on the right - Fixed positioning
  const rightX = doc.page.width - 200; // More space from right edge
  doc
    .fillColor('#666')
    .fontSize(8)
    .text('Your Address, City, State, Country', rightX, 45, { align: 'right', width: 190 })
    .text('contact@tuitioncenter.com', rightX, 55, { align: 'right', width: 190 })
    .text('www.tuitioncenter.com', rightX, 65, { align: 'right', width: 190 })
    .text('+91 9876543210', rightX, 75, { align: 'right', width: 190 });
}

function generateReceiptInfo(doc, student, receipt) {
  const startY = 110;
  const rightColumnX = doc.page.width - 150; // Fixed right column position
  
  // Receipt Number (MR. NO.)
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('MR. NO.', 50, startY)
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text(receipt.receiptNumber || 'N/A', 120, startY);
    
  // Date on right - Fixed positioning
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('Date', rightColumnX, startY)
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text(dayjs(receipt.paidAt || new Date()).format('DD/MM/YYYY'), rightColumnX + 30, startY);

  // Received with thanks from
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('Received with thanks from', 50, startY + 30)
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text(student.name || 'Student Name', 50, startY + 45);

  // Amount (In Word)
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('Amount (In Word)', 50, startY + 70);
    
  // Convert amount to words
  const totalInWords = numberToWords(receipt.total || 0);
  const capitalizedWords = totalInWords.charAt(0).toUpperCase() + totalInWords.slice(1);
  
  doc
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text(`${capitalizedWords} Rupees Only`, 50, startY + 85);
  
  // Payment method checkboxes
  const checkboxY = startY + 110;
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('By', 50, checkboxY);

  // Draw checkboxes with proper spacing
  const paymentMethods = [
    { name: 'Cash', x: 80 },
    { name: 'Cheque', x: 130 },
    { name: 'Credit Card', x: 190 },
    { name: 'Money Order', x: 270 }
  ];

  paymentMethods.forEach(method => {
    doc
      .rect(method.x, checkboxY - 2, 8, 8)
      .stroke()
      .fillColor('#000')
      .text(method.name, method.x + 15, checkboxY);
    
    // Mark Cash as selected by default
    if (receipt.paymentMethod === method.name || (!receipt.paymentMethod && method.name === 'Cash')) {
      doc
        .fillColor('#000')
        .fontSize(8)
        .text('✓', method.x + 2, checkboxY - 1);
    }
  });

  // No. and Bank fields on right - Fixed positioning
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('No.', rightColumnX - 50, checkboxY)
    .text('Bank', rightColumnX, checkboxY);

  // For the purpose of
  doc
    .text('For the purpose of', 50, checkboxY + 30)
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text('Tuition Fee Payment', 140, checkboxY + 30);

  // Contact No. - Fixed positioning
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('Contact No.', rightColumnX - 80, checkboxY + 30)
    .fillColor('#000')
    .font('Helvetica-Bold')
    .text(student.parentContact || student.contactNumber || 'N/A', rightColumnX - 20, checkboxY + 30);

  // TK amount box
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('TK', 50, checkboxY + 60)
    .rect(70, checkboxY + 55, 80, 20)
    .stroke()
    .fillColor('#000')
    .fontSize(12)
    .font('Helvetica-Bold')
    .text(receipt.total?.toString() || '0', 75, checkboxY + 62);

  // Received By and Authorized Signature sections
  doc
    .fillColor('#666')
    .fontSize(9)
    .font('Helvetica')
    .text('Received By', 200, checkboxY + 95)
    .text('Authorized Signature', rightColumnX - 30, checkboxY + 95);
}

function generateTable(doc, student, receipt) {
  const tableTop = 330;
  const tableHeaders = ['Student', 'Batch', 'Cycle', 'Base (₹)', 'Fines (₹)', 'Discount (₹)', 'Total (₹)'];
  
  // Calculate table width to fit page properly
  const tableWidth = doc.page.width - 100; // Leave 50px margin on each side
  const colWidths = [
    tableWidth * 0.18, // Student - 18%
    tableWidth * 0.15, // Batch - 15%
    tableWidth * 0.25, // Cycle - 25%
    tableWidth * 0.105, // Base - 10.5%
    tableWidth * 0.105, // Fines - 10.5%
    tableWidth * 0.105, // Discount - 10.5%
    tableWidth * 0.105  // Total - 10.5%
  ];
  
  // Table header background
  doc
    .rect(50, tableTop, tableWidth, 25)
    .fillAndStroke('#f8f9fa', '#000');

  // Table headers
  doc
    .fillColor('#000')
    .fontSize(10)
    .font('Helvetica-Bold');
    
  let currentX = 50;
  tableHeaders.forEach((header, i) => {
    doc.text(header, currentX + 3, tableTop + 8, { 
      width: colWidths[i] - 6, 
      align: 'center' 
    });
    currentX += colWidths[i];
  });

  // Table row
  const rowY = tableTop + 25;
  doc
    .rect(50, rowY, tableWidth, 30)
    .stroke();

  // Table data
  doc
    .fillColor('#000')
    .fontSize(9)
    .font('Helvetica');

  // Format cycle dates
  const cycleText = `${dayjs(receipt.cycleStart).format('DD MMM YYYY')} — ${dayjs(receipt.cycleEnd).format('DD MMM YYYY')}`;
  
  const rowData = [
    student.name || 'N/A',
    student.batch?.name || 'N/A', 
    cycleText,
    (receipt.baseAmount || 0).toString(),
    (receipt.fines || 0).toString(),
    (receipt.discount || 0).toString(),
    (receipt.total || 0).toString()
  ];

  currentX = 50;
  rowData.forEach((data, i) => {
    const align = i >= 3 ? 'center' : 'left';
    doc.text(data, currentX + 3, rowY + 10, { 
      width: colWidths[i] - 6,
      align: align 
    });
    currentX += colWidths[i];
  });

  // Draw vertical lines for table
  currentX = 50;
  colWidths.forEach((width, i) => {
    currentX += width;
    if (i < colWidths.length - 1) {
      doc
        .moveTo(currentX, tableTop)
        .lineTo(currentX, rowY + 30)
        .stroke();
    }
  });
}

function generateSignature(doc, signaturePath) {
  const signY = 480;
  const rightX = doc.page.width - 170; // Fixed right positioning
  
  // Add signature image if available
  if (signaturePath && fs.existsSync(signaturePath)) {
    doc.image(signaturePath, rightX, signY - 40, { width: 100, height: 40 });
  }
  
  // Signature line
  doc
    .moveTo(rightX, signY)
    .lineTo(rightX + 120, signY)
    .stroke();
    
  doc
    .fillColor('#666')
    .fontSize(9)
    .text('Authorized Signature', rightX, signY + 10, { align: 'center', width: 120 });
}

function generateFooter(doc, brandName) {
  const pageHeight = doc.page.height;
  
  // Footer line
  doc
    .lineCap('butt')
    .moveTo(50, pageHeight - 100)
    .lineTo(doc.page.width - 50, pageHeight - 100)
    .strokeColor('#ccc')
    .stroke();

  // Thank you message
  doc
    .fontSize(10)
    .fillColor('#555')
    .text('Thank you for your payment.', 0, pageHeight - 85, {
      align: 'center',
      width: doc.page.width
    });
    
  // Brand name
  doc
    .fontSize(8)
    .text(brandName, 0, pageHeight - 50, { 
      align: 'center',
      width: doc.page.width 
    });
}

// Main export function
export const buildReceiptPDF = async ({
  receipt,
  student,
  logoPath,
  signaturePath,
  brandName = process.env.BRAND_NAME || 'SciencePlus Tuition',
}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 0,
        bufferPages: true 
      });
      
      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Build the receipt
      generateHeader(doc, brandName, logoPath);
      generateReceiptInfo(doc, student, receipt);
      generateTable(doc, student, receipt);
      generateSignature(doc, signaturePath);
      generateFooter(doc, brandName);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
