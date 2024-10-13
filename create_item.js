const { Firestore } = require('@google-cloud/firestore');
var constants = require('./constants');
const fs = require('fs');
const { isNumberObject } = require('util/types');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

// Inicializa Firebase Admin
const firestore = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});

//TODO: import this as a parameter when removing manual steps
const d = new Date();
//TODO:Choose month based on files
let month = d.getMonth();
const folderName = '../resources/'+constants.MONTHS[month];

const backupFilePath = './firestoreBackup3.json';

//1.- download 6 files on Resources
//2.- node pdftoexcel.js

//get data to compare references
//TODO: modularize this as a service
    // Crea un objeto para almacenar los datos de backup
    let backupData = {};
try {

    // Obtén la fecha actual y el primer día del mes
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth()-1, 1);

    // Obtén todos los documentos de la base de datos
    firestore.listCollections().then(async collections => {
        for (let collection of collections) {
          console.log(`Found collection with id: ${collection.id}`);

        // Obtén todos los documentos de la colección
        const documentRefs = await collection.listDocuments();
        const documentSnapshots = await firestore.getAll(...documentRefs);

        // Crea un array para almacenar los datos de la colección
        const collectionData = [];

        for (let documentSnapshot of documentSnapshots) {
            if (documentSnapshot.exists) {
                //if(documentSnapshot.data().No) to filter
                // Agrega los datos del documento al array de la colección
                collectionData.push(documentSnapshot.data());
                //console.log(`Found document with data: ${documentSnapshot.ref.path}`);
            } else {
                console.log(`Found missing document: ${documentSnapshot.id}`);
            }
        }

        // Agrega el array de la colección al objeto de backup
        backupData[collection.id] = collectionData;

        }
        // Guarda los datos de backup en el archivo JSON
        await fs.promises.writeFile(backupFilePath, JSON.stringify(backupData));
        // Extraer las referencias
        const panamcredReferencias = backupData.panamcred.map(item => item.Referencia);
        const merdebReferencias = backupData.merdeb.map(item => item.Referencia);
        const tpagoReferencias = backupData.tpago.map(item => item.Referencia);
        const panamdebReferencias = backupData.panamdeb.map(item => item.Referencia);
        const cestaticketReferencias = backupData.panamcrcestaticketed.map(item => item.Transacción);
        const ticketplusReferencias = backupData.ticketplus.map(item => item.Transacción);
        
        //if collection does not exist, it will be created
        
        const incomes = [];
        
        const payments = [];

        //count variables
         let countExistences = 0;
         let countWrites = 0;
        
        //--------------panamcred update
        
        const panamcred = firestore.collection('panamcred');
        
        const createPanamcredItem = async (record) => {
        
            try {
                await panamcred.add(record);
                countWrites++;
            } catch (error) {
                console.log(`Error at createRecord panamcred --> ${error}`);
            }
        };
        
        //https://www.convertcsv.com/csv-to-json.htm
        let panamcredDatabase = require(folderName+'/panamcred.json');
        
        for (let index = 0; index < panamcredDatabase.length; index++) {
            let element = panamcredDatabase[index];
            element['isConsolidated'] = false;
            const fecha = new Date(element['Transacción']);
            if(isNaN(fecha.getTime())){
                if(!panamcredReferencias.includes(element['Referencia'])){
                    createPanamcredItem(element);
                }else{
                    countExistences++;
                }
            }
            //TODO: If its a buy item, add its information to a revenue or waste list with consolidated columns, save it on firebase and do it with all files
            if(element['Descripción'] != 'ABONO A SU CUENTA .... GRACIAS'){
                incomes.push(panamcredDatabase[index]);
                payments.push(panamcredDatabase[index]);
            }
        }
        
        console.log('panamcred items existentes:', countExistences);
        console.log('panamcred items inexistentes:', countWrites);
        //--------------merdeb update

         countExistences = 0;
         countWrites = 0;

        const merdeb = firestore.collection('merdeb');

        const createmerdebItem = async (record) => {

            try {
                await merdeb.add(record);
                countWrites++;
            } catch (error) {
                console.log(`Error at createRecord merdeb --> ${error}`);
            }
        };

        //https://www.convertcsv.com/csv-to-json.htm
        let merdebDatabase = require(folderName+'/merdeb.json');

        for (let index = 0; index < merdebDatabase.length; index++) {
            let element = merdebDatabase[index];
            element['isConsolidated'] = false;
            if(!merdebReferencias.includes(element['Referencia'])){
                createmerdebItem(element);
            }else{
                countExistences++;
            }
            if(element['Tipo'] == 'ND'){
                payments.push(merdebDatabase[index]);
            }else if(element['Referencia'] != '000000000000000'){
                incomes.push(merdebDatabase[index]);
            }
        }
        console.log('merdeb items existentes:', countExistences);
        console.log('merdeb items inexistentes:', countWrites);

        //--------------tpago update

         countExistences = 0;
         countWrites = 0;

        const tpago = firestore.collection('tpago');

        const createtpagoItem = async (record) => {

            try {
                await tpago.add(record);
                countWrites++;
            } catch (error) {
                console.log(`Error at createRecord tpago --> ${error}`);
            }
        };

        //https://www.convertcsv.com/csv-to-json.htm
        let tpagoDatabase = require(folderName+'/tpago.json');

        for (let index = 0; index < tpagoDatabase.length; index++) {
            let element = tpagoDatabase[index];
            if(!tpagoReferencias.includes(element['Referencia'])){
                createtpagoItem(element);
            }else{
                countExistences++;
            }
            if(element['Tipo'] == 'ND'){
                payments.push(tpagoDatabase[index]);
            }else {
                incomes.push(tpagoDatabase[index]);
            }
        }
        console.log('tpago items existentes:', countExistences);
        console.log('tpago items inexistentes:', countWrites);


        //--------------panamdeb update

         countExistences = 0;
         countWrites = 0;


        const panamdeb = firestore.collection('panamdeb');

        const createPanamdebItem = async (record) => {

            try {
                await panamdeb.add(record);
                countWrites++;
            } catch (error) {
                console.log(`Error at createRecord panamdeb --> ${error}`);
            }
        };

        //https://www.convertcsv.com/csv-to-json.htm
        let panamdebDatabase = require(folderName+'/panamdeb.json');

        for (let index = 0; index < panamdebDatabase.length; index++) {
            let element = panamdebDatabase[index];
            element['isConsolidated'] = false;
            if(!panamdebReferencias.includes(element['No'][' de Referencia'])){
                element['Referencia'] = element['No'][' de Referencia'];
                createPanamdebItem(element);
            }else{
                countExistences++;
            }
            if(element['Débito'] != ''){
                payments.push(element);
            }else{
                incomes.push(element);
            }
        }
        console.log('panamdeb items existentes:', countExistences);
        console.log('panamdeb items inexistentes:', countWrites);

        //--------------cestaticket update

         countExistences = 0;
         countWrites = 0;
        const cestaticket = firestore.collection('panamcrcestaticketed');

        const createcestaticketItem = async (record) => {

            try {
                await cestaticket.add(record);
                countWrites++;
            } catch (error) {
                console.log(`Error at createRecord cestaticket --> ${error}`);
            }
        };

        //https://www.convertcsv.com/csv-to-json.htm
        let cestaticketDatabase = require(folderName+'/cestaticket.json');

        for (let index = 0; index < cestaticketDatabase.length; index++) {
            let element = cestaticketDatabase[index];
            element['isConsolidated'] = false;
            if(!cestaticketReferencias.includes(element['Transacción'])){
                createcestaticketItem(element);
            }else{
                countExistences++;
            }
            if(element['Movimiento'] == 'COMPRA'){
                payments.push(element);
            }else{
                incomes.push(element);
            }
        }
        console.log('cestaticket items existentes:', countExistences);
        console.log('cestaticket items inexistentes:', countWrites);

        //--------------ticketplus update

         countExistences = 0;
         countWrites = 0;

        const ticketplus = firestore.collection('ticketplus');

        const createticketplusItem = async (record) => {
            // Especifica la ruta del archivo de backup
            const incomesFilePath = './incomesBackup.json';
            
            // Especifica la ruta del archivo de backup
            const paymentsFilePath = './paymentsBackup.json';

            try {
                await ticketplus.add(record);
                countWrites++;
                // Guarda los datos de backup en el archivo JSON
                await fs.promises.writeFile(incomesFilePath, JSON.stringify(incomes));
                // Guarda los datos de backup en el archivo JSON
                await fs.promises.writeFile(paymentsFilePath, JSON.stringify(payments));
            } catch (error) {
                console.log(`Error at createRecord ticketplus --> ${error}`);
            }
        };

        //https://www.convertcsv.com/csv-to-json.htm
        let ticketplusDatabase = require(folderName+'/ticketplus.json');

        for (let index = 0; index < ticketplusDatabase.length; index++) {
            let element = ticketplusDatabase[index];
            element['isConsolidated'] = false;
            if(!ticketplusReferencias.includes(element['Transacción'])){
                createticketplusItem(element);
            }else{
                countExistences++;
            }
            if(element['Movimiento'] == 'RECARGA'){
                incomes.push(ticketplusDatabase[index]);
            }else{
                payments.push(ticketplusDatabase[index]);
            }
        }
        console.log('ticketplus items existentes:', countExistences);
        console.log('ticketplus items inexistentes:', countWrites);
        console.log('create_item finalizado correctamente.'); 
         
    });
    // Filtra las referencias de la colección 'panamcred' para el mes actual
    //.filter(doc => doc.fecha >= firstDayOfMonth && doc.fecha <= now)
} catch (error) {
    console.error('Error al realizar el backup:', error);
}

//TODO: once two consolidated lists are filled, order them and add them to consolidated gsheet
//console.log(incomes);
//console.log(payments);
