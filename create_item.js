const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);

const firestore = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});

//if collection does not exist, it will be created
//const jan24 = firestore.collection('metrics').doc('panamcred');
const jan24 = firestore.collection('panamcred');

const createMenuItem = async (record) => {

    try {
        await jan24.add(record);
        console.log('Records created.');
    } catch (error) {
        console.log(`Error at createRecord --> ${error}`);
    }
};

//https://www.convertcsv.com/csv-to-json.htm
let database = require('../resources/panamcred.json');

for (let index = 0; index < database.length; index++) {
    let element = database[index];
    element['isConsolidated'] = false;
    createMenuItem(element);
}