const pdf2excel = require('pdf-to-excel');
const fs = require('node:fs');
var constants = require('./constants');
const { exec } = require('child_process');
//get month
const d = new Date();
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];


const cestaticketPath = '../resources/Movimientos de Cuenta (1).pdf';
const ticketplusPath = '../resources/Movimientos de Cuenta.pdf';
const panamcredPath = '../resources/Estado de Cuenta de Tarjetas de Crédito_ XXXX-XXXX-XXXX-2819.pdf';
const merdebPath = '../resources/Detalle_de_cuenta_01050614000614308607.xlsx';
const tpagoPath = '../resources/Detalle_Tpago.xlsx';
const panamdebPath = '../resources/Mercantil Banco, Sistema de Banca por Internet.xlsx';

//convert xls to pdf
try { 
  //Check file paths
  if (fs.existsSync(cestaticketPath) &&
  fs.existsSync(ticketplusPath) &&
  fs.existsSync(panamcredPath) &&
  fs.existsSync(merdebPath) &&
  fs.existsSync(tpagoPath) &&
  fs.existsSync(panamdebPath)) {
      // File exists, proceed with your script
      console.log('Files exists:', filePath);
  } else {
      console.error('File does not exist:', filePath);
      // Handle the error, e.g., create the file, exit the script, etc.
      process.exit(1); // Exit the script with an error code
  }
  
  //convert xls to pdf
    //if folder does not exist
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    //if it exists, save xls files there
    pdf2excel.genXlsx('../resources/Movimientos de Cuenta (1).pdf', folderName+'/cestaticket.xlsx'); 
    pdf2excel.genXlsx('../resources/Movimientos de Cuenta.pdf', folderName+'/ticketplus.xlsx'); 
    pdf2excel.genXlsx('../resources/Estado de Cuenta de Tarjetas de Crédito_ XXXX-XXXX-XXXX-2819.pdf', folderName+'/panamcred.xlsx'); 
} catch (err) { 
    console.error(err); 
}

exec(`node exceltojson.js`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('pdftoexcel finalizado correctamente.');
});