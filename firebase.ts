import firebase from 'firebase-admin';
import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('.env file loaded successfully');
    console.log('Available environment variables:', result.parsed);
}

interface ItemProps {
    name: string;
}

console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('FIREBASE_DATABASE_URL:', process.env.FIREBASE_DATABASE_URL);
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY);

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
}

// Export Firebase database reference
export const db = firebase.database();

// Export Firebase functions
export const addItem = async (item: { name: string }) => {
    try {
        const newItemRef = await db.ref('items').push(item);
        return { id: newItemRef.key, ...item };
    } catch (error) {
        console.error('Error adding item:', error);
        throw new Error('Failed to add item');
    }
};

export const getItems = async () => {
    const snapshot = await db.ref('items').once('value');
    return snapshot.val();
};

export const updateItem = async (id: string, item: ItemProps) => {
    await db.ref(`items/${id}`).update(item);
};

export const deleteItem = async (id: string) => {
    await db.ref(`items/${id}`).remove();
};