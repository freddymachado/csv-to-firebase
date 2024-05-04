const pdf2excel = require('pdf-to-excel');
const fs = require('node:fs');

//get month
const d = new Date();
let month = d.getMonth();
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const folderName = '../resources/'+months[month];

//convert xls to pdf
try { 
    //if folder does not exist
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
    pdf2excel.genXlsx('../resources/cestaticket.pdf', folderName+'/cestaticket.xlsx'); 
    pdf2excel.genXlsx('../resources/ticketplus.pdf', folderName+'/ticketplus.xlsx'); 
    pdf2excel.genXlsx('../resources/panamcred.pdf', folderName+'/panamcred.xlsx'); 
} catch (err) { 
    console.error(err); 
}