import  request  from "supertest";
import server, {connectDB} from "../server";
import db from "../config/db";

jest.mock('../config/db');

describe('Connect to the database', () => {
    test('It should connect to the database', async () => {
        jest.spyOn(db, 'authenticate')
            .mockRejectedValue(new Error('Unable to connect to the database'));
        const consoleSpy = jest.spyOn(console, 'log');
        await connectDB();

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Unable to connect to the database')
        );
    })
})



