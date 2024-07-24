const pdf2excel = require('pdf-to-excel');
const fs = require('node:fs');
var constants = require('./constants');
const { exec } = require('child_process');
//get month
const d = new Date();
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];

//convert xls to pdf
try { 
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