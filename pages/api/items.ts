import { addItem, getItems } from '@/firebase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'GET':
            const items = await getItems();
            res.status(200).json(Object.values(items));
            break;
        case 'POST':
            const item = await addItem(req.body);
            res.status(200).json(item);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
