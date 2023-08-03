const fs = require("fs");
const path = require("path");
const { jsPDF } = require("jspdf");

const { fontTimes } = require("../fonts/times/times-normal");
const { fontTimesBold } = require("../fonts/times/times-bold");

const createMessagePdf = async (messageData) => {
  const {
    senderName,
    senderEmail = null,
    senderAddress = null,
    senderPhone = null,
    recieverLevel,
    recieverDistrict = null,
    recieverHromada = null,
    recieverName = null,
    recieverEmail = null,
    title = null,
    text,
    isAnswerByEmail,
  } = messageData;

  const doc = new jsPDF({ fontSize: 12, lineHeight: 1 });

  doc.addFileToVFS("times.ttf", fontTimes());
  doc.addFont("times.ttf", "times", "normal");

  doc.addFileToVFS("times-bold.ttf", fontTimesBold());
  doc.addFont("times-bold.ttf", "times-bold", "bold");

  doc.setFont("times-bold", "bold");

  // Розмір сторінки A4 (ширина x висота)
  const pageWidth = 210;
  const pageHeight = 297;

  // Розбиваємо довгий текст на кілька рядків
  const marginLeft = 20;
  const marginRight = 10;
  const textX = marginLeft;
  let textY = 115;

  const splittedText = doc.splitTextToSize(
    text,
    pageWidth - marginLeft - marginRight
  );

  // шапка
  doc.text("____________ № ______________", 20, 20);
  doc.text("На №_______від __________", 110, 20);

  // одержувач
  if (recieverLevel === "oda") {
    doc.text("Депутату Закарпатської обласної ради", 110, 40);
  }

  if (recieverLevel === "district" && recieverDistrict) {
    doc.text(
      `Депутату ${recieverDistrict.slice(0, -2) + "ої"} районної ради`,
      110,
      40
    );
  }

  if (recieverLevel === "hromada" && recieverHromada) {
    doc.text(`Депутату ТГ ${recieverHromada}`, 110, 40);
  }

  doc.text(recieverName, 110, 45);
  doc.text(`e-mail: ${recieverEmail}`, 110, 50);

  // відправник
  doc.text("від:", 110, 60);
  doc.text(senderName, 110, 65);

  if (senderEmail) {
    doc.text(`e-mail: ${senderEmail}`, 110, 70);
  }

  if (senderAddress) {
    doc.text(senderAddress, 110, 75);
  }

  if (senderPhone) {
    doc.text(senderPhone, 110, 85);
  }

  // основний текст
  doc.text("Заява", 100, 105, { align: "justify" });

  doc.setFont("times", "normal");

  doc.text(splittedText, textX, textY);
  // lines.forEach((line) => {
  //   doc.text(line, textX, textY);
  //   textY += lineHeight;
  // });

  if (isAnswerByEmail) {
    doc.text("Бажаю отримати відповідь на email.", 20, 265);
  }

  doc.setFont("times-bold", "bold");
  doc.text(new Date().toLocaleDateString(), 20, 275);
  doc.text(senderName, 110, 275);

  // Збереження PDF файлу
  const filePath = path.join(__dirname, "e-message.pdf");
  doc.save(filePath);

  return filePath;
};

module.exports = { createMessagePdf };
