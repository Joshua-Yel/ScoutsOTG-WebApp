// paymentService.js
import jsPDF from "jspdf";

export const processMockPayment = (amount, tourName, paymentMethod) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `${paymentMethod} payment processed successfully`,
      });
    }, 1000);
  });
};

export const generateInvoice = (tour) => {
  const doc = new jsPDF();
  doc.text(`Invoice for ${tour.name}`, 10, 10);
  doc.text(`Price: ${tour.price}`, 10, 20);
  doc.text(`Duration: ${tour.duration} days`, 10, 30);
  doc.save("invoice.pdf");
};
