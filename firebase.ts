import firebase from 'firebase-admin';
import serviceAccount from '@/config/serviceAccountKey.json';
import dotenv from 'dotenv';

dotenv.config();

interface ItemProps {
    name: string;
}

if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert({
            projectId: serviceAccount.project_id,
            clientEmail: serviceAccount.client_email,
            privateKey: serviceAccount.private_key
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