XLSX = require('xlsx');
var constants = require('./constants');
const { exec } = require('child_process');
var mv = require('mv');

const d = new Date();
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];

//----------begin merdeb convertion
const merdeb = XLSX.readFile('../resources/Detalle_de_cuenta_01050614000614308607.xlsx');

// read the worksheet
const savingsAccount = merdeb.Sheets["Cuenta de Ahorro"];

//depure savingsAccount data
delete_rows(savingsAccount, 0,8);

//convert to csv
XLSX.writeFile(merdeb, folderName+'/merdeb.csv', { bookType: "csv" });

//convert to json
let fileInputNamemerdeb = folderName+'/merdeb.csv'; 
let fileOutputNamemerdeb = folderName+'/merdeb.json';

exec(`csvtojson ${fileInputNamemerdeb} > ${fileOutputNamemerdeb}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV merdeb convertido a JSON correctamente.');
});

//-----------begin tpago convertion
const tpago = XLSX.readFile('../resources/Detalle_Tpago.xlsx');

// read the worksheet
const tpagoPage = tpago.Sheets["Tpago"];

//depure tpagoPage data
delete_rows(tpagoPage, 0,3);

//convert to csv
XLSX.writeFile(tpago, folderName+'/tpago.csv', { bookType: "csv" });

//convert to json
let fileInputNametpago = folderName+'/tpago.csv'; 
let fileOutputNametpago = folderName+'/tpago.json';

exec(`csvtojson ${fileInputNametpago} > ${fileOutputNametpago}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV tpago convertido a JSON correctamente.');
});


//---------------begin panamdeb convertion
const panamdeb = XLSX.readFile('../resources/Mercantil Banco, Sistema de Banca por Internet.xlsx');

// read the worksheet
const panamDebAccount = panamdeb.Sheets["Sheet1"];

//depure panamDebAccount data
delete_rows(panamDebAccount, 0,1);

//convert to csv
XLSX.writeFile(panamdeb, folderName+'/panamdeb.csv', { bookType: "csv" });

//convert to json
let fileInputNamepanamdeb = folderName+'/panamdeb.csv'; 
let fileOutputNamepanamdeb = folderName+'/panamdeb.json';

exec(`csvtojson ${fileInputNamepanamdeb} > ${fileOutputNamepanamdeb}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV panamdeb convertido a JSON correctamente.');
});


//---------------begin cestaticket convertion

const cestaticket = XLSX.readFile(folderName+'/cestaticket.xlsx');

depure_bonus(cestaticket, 0);
        
//convert to csv
XLSX.writeFile(cestaticket, folderName+'/cestaticket.csv', { bookType: "csv" });

//convert to json
let fileInputNamecestaticket = folderName+'/cestaticket.csv'; 
let fileOutputNamecestaticket = folderName+'/cestaticket.json';

exec(`csvtojson ${fileInputNamecestaticket} > ${fileOutputNamecestaticket}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV cestaticket convertido a JSON correctamente.');
});


//----------------begin ticketplus convertion

const ticketplus = XLSX.readFile(folderName+'/ticketplus.xlsx');

depure_bonus2(ticketplus, 0);
        
//convert to csv
XLSX.writeFile(ticketplus, folderName+'/ticketplus.csv', { bookType: "csv" });

//convert to json
let fileInputNameticketplus = folderName+'/ticketplus.csv'; 
let fileOutputNameticketplus = folderName+'/ticketplus.json';

exec(`csvtojson ${fileInputNameticketplus} > ${fileOutputNameticketplus}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV ticketplus convertido a JSON correctamente.');
});

//----------------begin panamcred convertion

const panamcred = XLSX.readFile(folderName+'/panamcred.xlsx');

depure_panamcred(panamcred, 0);
        
//convert to csv
XLSX.writeFile(panamcred, folderName+'/panamcred.csv', { bookType: "csv" });

//convert to json
let fileInputNamepanamcred = folderName+'/panamcred.csv'; 
let fileOutputNamepanamcred = folderName+'/panamcred.json';

exec(`csvtojson ${fileInputNamepanamcred} > ${fileOutputNamepanamcred}`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log('Archivo CSV panamcred convertido a JSON correctamente.');
  
exec(`node create_item.js`, (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('exceltojson finalizado correctamente.'+stdout);

});
});

//archive_files();



//delete a specific row
function ec(r, c){
    return XLSX.utils.encode_cell({r:r,c:c});
}
function delete_row(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    for(var R = row_index; R < variable.e.r; ++R){
        for(var C = variable.s.c; C <= variable.e.c; ++C){
            ws[ec(R,C)] = ws[ec(R+1,C)];
        }
    }
    variable.e.r--
    ws['!ref'] = XLSX.utils.encode_range(variable.s, variable.e);
}
function row_to_column(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    if(ws[ec(R-1,C+1)]==null){
        ws[ec(R-1,C+1)] = ws[ec(R,C)];
        //console.log('trx');
    }else if(ws[ec(R-1,C+2)]==null){
        ws[ec(R-1,C+2)] = ws[ec(R,C)];
        //console.log('desc');
    }else{
        ws[ec(R-1,C+3)] = ws[ec(R,C)];
        //console.log('mov');
    }
    delete_row(ws, R);
    //console.log('finish row_to_column');
}
function add_header(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    //add columns
    variable.e.c++
    variable.e.c++
    variable.e.c++
    var C = variable.s.c
    ws["!ref"] = XLSX.utils.encode_range(variable);
    //add header
    ws[ec(R,C+1)] = ws[ec(R+2,C)];
    ws[ec(R,C+2)] = ws[ec(R+3,C)];
    ws[ec(R,C+3)] = ws[ec(R+5,C)];
    ws[ec(R,C+4)] = ws[ec(R+6,C)];
    ws[ec(R,C+5)] = ws[ec(R+7,C+1)]; 
    var cellValue = ws[XLSX.utils.encode_cell({c: C+5, r: R})] ? ws[XLSX.utils.encode_cell({c: C+1, r: R})].v : 'null';
    //console.log(cellValue);
       
    //console.log('finish add_header');
}
function add_header2(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    //add columns
    variable.e.c++
    variable.e.c++
    variable.e.c++
    variable.e.c++
    var C = variable.s.c
    ws["!ref"] = XLSX.utils.encode_range(variable);
    //add header
    ws[ec(R,C+1)] = ws[ec(R+1,C)];
    ws[ec(R,C+2)] = ws[ec(R+2,C)];
    ws[ec(R,C+3)] = ws[ec(R+3,C)];
    ws[ec(R,C+4)] = ws[ec(R+4,C)];
    ws[ec(R,C+5)] = ws[ec(R+4,C+1)]; 
    var cellValue = ws[XLSX.utils.encode_cell({c: C+5, r: R})] ? ws[XLSX.utils.encode_cell({c: C+1, r: R})].v : 'null';
    //console.log(cellValue);
       
    //console.log('finish add_header');
}
function delete_rows(ws, row_index,final_index){
    for (var i = row_index;i<final_index;i++){
        delete_row(ws, row_index);
    }
}
function move_type(ws, row_index) {
    var variable = XLSX.utils.decode_range(ws["!ref"]);
    var R = row_index;
    var C = variable.s.c;
  
    // Get cell value with error handling
    var cellValue = ws[XLSX.utils.encode_cell({c: C, r: R})] ? ws[XLSX.utils.encode_cell({c: C, r: R})].v : 'null';
    //console.log(cellValue);
  
    // Check if cell value exists in constants.TRX_TYPE (consider loose equality)
    if (constants.TRX_TYPE.includes(cellValue)) {
      if (cellValue === 'DEBITO' || cellValue === 'DEBITO AJUSTE') {
        row_to_column(ws, row_index);
        delete_row(ws, row_index);
        //console.warn(`finish DEBITO move type`);
      } else {
        row_to_column(ws, row_index);
        //console.warn(`finish move type`);
      }
    } else {
      // Handle empty or non-existent cell (optional: log error or delete row)
      //console.warn(`Cell(${R}, ${C}) is empty or not found.`);
      delete_row(ws, row_index);
      move_type(ws,row_index);
    }
  }
  function move_type2(ws, row_index) {
      var variable = XLSX.utils.decode_range(ws["!ref"]);
      var R = row_index;
      var C = variable.s.c;
    
      // Get cell value with error handling
      var cellValue = ws[XLSX.utils.encode_cell({c: C, r: R})] ? ws[XLSX.utils.encode_cell({c: C, r: R})].v : 'null';
      //console.log(cellValue);
    
      // Check if cell value exists in constants.TRX_TYPE (consider loose equality)
      if (constants.TRX_TYPE.includes(cellValue)) {
        if (cellValue === 'DEBITO' || cellValue === 'DEBITO AJUSTE') {
          row_to_column(ws, row_index);
          //delete_row(ws, row_index);
          //console.warn(`finish DEBITO move type`);
        } else {
          row_to_column(ws, row_index);
          //console.warn(`finish move type`);
        }
      } else {
        // Handle empty or non-existent cell (optional: log error or delete row)
        //console.warn(`Cell(${R}, ${C}) is empty or not found.`);
        delete_row(ws, row_index);
        move_type(ws,row_index);
      }
    }
function move_amount(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R-1,C+4)] = ws[ec(R,C)];
    var cellValue = ws[XLSX.utils.encode_cell({c: C+1, r: R})] ? ws[XLSX.utils.encode_cell({c: C+1, r: R})].v : 'null';
    //console.log(cellValue);
    if(cellValue==='Bs. -' || cellValue==='Bs.'){
        ws[ec(R-1,C+5)] = ws[ec(R,C+1)];
    }else{
        ws[ec(R-1,C+5)] = ws[ec(R,C+1)];
    }
    delete_row(ws, row_index);
    //console.log(`finish move_amount on row ${row_index} of ${variable.e.r}`);
    if(row_index+1<variable.e.r){
        
        //move reference
        row_to_column(ws,R+1);
        
        //move description
        row_to_column(ws,R+1);
        
        //move type
        move_type(ws,R+1);
        
        //move status & amount
        move_amount(ws,R+1);
    }
}
function move_amount2(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    ws[ec(R-1,C+4)] = ws[ec(R,C)];
    var cellValue = ws[XLSX.utils.encode_cell({c: C, r: R})] ? ws[XLSX.utils.encode_cell({c: C, r: R})].v : 'null';
    console.log(cellValue);
    ws[ec(R-1,C+5)] = ws[ec(R,C+1)];
    delete_row(ws, row_index);
    //console.log(`finish move_amount on row ${row_index} of ${variable.e.r}`);
    if(row_index+1<variable.e.r){
        
        
        //move reference
        row_to_column(ws,R+1);
        
        //move description
        row_to_column(ws,R+1);
        
        //move type
        move_type2(ws,R+1);
        
        //move status & amount
        move_amount2(ws,R+1);
    } 
}
function depure_bonus(ws,row_index){     
    // read the worksheet
    const bonus = ws.Sheets["Sheet1"];
    var R = row_index

    //for(var R = row_index; R < variable.e.r; ++R){
        
        //depure bonus data
        delete_rows(bonus, R,11);
        
        add_header(bonus,R);
        
        //depure bonus header
        delete_rows(bonus,R+1,8);
        
        //move reference
        row_to_column(bonus,R+2);
        
        //move description
        row_to_column(bonus,R+2);
        
        //move type
        move_type(bonus,R+2);
        
        //move status & amount
        move_amount(bonus,R+2);
    //}    
}
function depure_bonus2(ws,row_index){     
    // read the worksheet
    const bonus = ws.Sheets["Sheet1"];
    var R = row_index

    //for(var R = row_index; R < variable.e.r; ++R){
        
        //depure bonus data
        delete_rows(bonus, R,11);
        
        add_header2(bonus,R);
        
        //depure bonus header
        delete_rows(bonus,R+1,5);
        
        //move reference
        row_to_column(bonus,R+2);
        
        //move description
        row_to_column(bonus,R+2);
        
        //move type
        move_type2(bonus,R+2);
        
        //move status & amount
        move_amount2(bonus,R+2);
    //}    
}
function add_panamcredheader(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
   
    var C = variable.s.c
    ws["!ref"] = XLSX.utils.encode_range(variable);
    //add header
    ws[ec(R,C+1)] = ws[ec(R+2,C)];
    ws[ec(R,C+2)] = ws[ec(R+3,C)];
    ws[ec(R,C+3)] = ws[ec(R+3,C+1)];
    ws[ec(R,C+4)] = ws[ec(R+3,C+2)];
    var cellValue = ws[XLSX.utils.encode_cell({c: C+5, r: R})] ? ws[XLSX.utils.encode_cell({c: C+1, r: R})].v : 'null';
    //console.log(cellValue);
       
    //console.log('finish add_header');
}
function move_description(ws, row_index){
    var variable = XLSX.utils.decode_range(ws["!ref"])
    var R = row_index
    var C = variable.s.c
    //add description
    ws[ec(R-1,C+3)] = ws[ec(R,C)];
    //add amount
    ws[ec(R-1,C+4)] = ws[ec(R,C+1)];
    delete_row(ws, R);
    //console.log(`finish move_amount on row ${row_index} of ${variable.e.r}`);
    if(row_index+7<variable.e.r){
        
        //move date
        row_to_column(ws,R+1);
        
        //move reference
        row_to_column(ws,R+1);
        
        //move type
        move_description(ws,R+1);
    }
}
function depure_panamcred(ws,row_index){     
    // read the worksheet
    const bonus = ws.Sheets["Sheet1"];
    var R = row_index

        //depure bonus data
        delete_rows(bonus, R,16);
        
        add_panamcredheader(bonus,R);
        
        //depure bonus header
        delete_rows(bonus,R+1,5);
        
        //move date
        row_to_column(bonus,R+2);
        
        //move reference
        row_to_column(bonus,R+2);
        
        //move type
        move_description(bonus,R+2);
}
function archive_files(){

mv('../resources/Movimientos de Cuenta (1).pdf', folderName+'/Movimientos de Cuenta (1).pdf', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});

mv('../resources/Movimientos de Cuenta.pdf', folderName+'/Movimientos de Cuenta.pdf', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});

mv('../resources/Estado de Cuenta de Tarjetas de Crédito_ XXXX-XXXX-XXXX-2819.pdf', folderName+'/Estado de Cuenta de Tarjetas de Crédito_ XXXX-XXXX-XXXX-2819.pdf', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});

mv('../resources/Detalle_de_cuenta_01050614000614308607.xlsx', folderName+'/Detalle_de_cuenta_01050614000614308607.xlsx', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});

mv('../resources/Detalle_Tpago.xlsx', folderName+'/Detalle_Tpago.xlsx', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});

mv('../resources/Mercantil Banco, Sistema de Banca por Internet.xlsx', folderName+'/Mercantil Banco, Sistema de Banca por Internet.xlsx', function(err) {
  // done. it tried fs.rename first, and then falls back to
  // piping the source file to the dest file and then unlinking
  // the source file.
  console.log('Error moving files'+err);
});
}