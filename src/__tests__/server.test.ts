import  request  from "supertest";
import server, {connectDB} from "../server";
import db from "../config/db";


describe("GET /api", () => {
    test("It should response the GET method", async () => {
        const res = await request(server).get("/api");

        expect(res.status).toBe(200);
        expect(res.headers["content-type"]).toMatch(/json/);
        expect(res.body.msg).toBe('Desde API');

        expect(res.status).not.toBe(404);
        expect(res.body.msg).not.toBe('desde api');

    });
});

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



