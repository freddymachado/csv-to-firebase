const { Firestore } = require('@google-cloud/firestore');
const fs = require('fs');
require('dotenv').config();

const CREDENTIALS = JSON.parse(process.env.CREDENTIALS2);

// Inicializa Firebase Admin

const db = new Firestore({
    projectId: CREDENTIALS.project_id,
    credentials: {
        client_email: CREDENTIALS.client_email,
        private_key: CREDENTIALS.private_key
    }
});

// Obtén la referencia a la base de datos Firestore

// Especifica la ruta del archivo de backup
const backupFilePath = './firestoreBackup3.json';

// Función para realizar el backup
async function backupFirestore() {
  try {
    // Crea un documento de backup vacío
    const backupDocRef = db.collection('backups').doc('latest');

    // Crea un objeto para almacenar los datos de backup
    const backupData = {};

    // Obtén todos los documentos de la base de datos
    db.listCollections().then(async collections => {
        for (let collection of collections) {
          console.log(`Found collection with id: ${collection.id}`);

          collection.listDocuments().then(documentRefs => {
            return db.getAll(...documentRefs);
         }).then(async documentSnapshots => {
            for (let documentSnapshot of documentSnapshots) {
               if (documentSnapshot.exists) {
                const collectionPath = documentSnapshot.ref.path.toString();
                const collectionData = documentSnapshot.data();

                // Agrega los datos de la colección al objeto de backup
                backupData[collectionPath] = collectionData;
                 console.log(`Found document with data: ${collectionPath}`);
                 // Guarda los datos de backup en el archivo JSON
                 await fs.promises.writeFile(backupFilePath, JSON.stringify(backupData));
               } else {
                 console.log(`Found missing document: ${documentSnapshot.id}`);
               }
            }
         });

        }
        
    });


  } catch (error) {
    console.error('Error al realizar el backup:', error);
  }
}

// Ejecuta la función de backup
backupFirestore();
