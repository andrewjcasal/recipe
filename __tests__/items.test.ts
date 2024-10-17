import { createMocks } from 'node-mocks-http';
import handler from '../pages/api/items';
import * as firebase from '../firebase';
import { NextApiRequest, NextApiResponse } from 'next';

describe('/api/items API Endpoint', () => {
    it('should return items on GET', async () => {
        const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
        jest.spyOn(firebase, "getItems").mockResolvedValue(items);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'GET',
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(items);
    });

    it('should add an item on POST', async () => {
        const newItem = { name: 'almonds' };
        const addedItem = { id: 'unique-id', ...newItem };
        jest.spyOn(firebase, "addItem").mockResolvedValue(addedItem);

        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'POST',
            body: newItem,
        });

        await handler(req, res);

        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual(addedItem);
    });

    it('should return 405 on unsupported method', async () => {
        const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
            method: 'PUT',
        });

        await handler(req, res);

        expect(res.statusCode).toBe(405);
        expect(res._getData()).toBe('Method PUT Not Allowed');
    });
});