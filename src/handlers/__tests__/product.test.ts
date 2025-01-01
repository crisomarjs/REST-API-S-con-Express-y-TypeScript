import request from "supertest";
import server from "../../server";

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const res = await request(server).post('/api/products').send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(4);

        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(2);
    })

    it('should validate that the price is greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: 'Monitor Curvo - Testing',
            price: 0
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);

        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(2);
    })

    it('should validate that the price is a number and greater than 0', async () => {
        const res = await request(server).post('/api/products').send({
            name: 'Monitor Curvo - Testing',
            price: "Hola"
        });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(2);

        expect(res.status).not.toBe(404);
        expect(res.body.errors).not.toHaveLength(4);
    })


    it('should create a new product', async () => {
        const res = await request(server).post('/api/products').send({
        name: 'Monitor - Testing',
        price: 100
        });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('data');
        
        expect(res.status).not.toBe(404);
        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('errors');
    });
})

describe('GET /api/products', () => {

    it('Should check if api/products url exists', async () => {
        const res = await request(server).get('/api/products');
        expect(res.status).not.toBe(404);
    })

    it('should get all products', async () => {
        const res = await request(server).get('/api/products');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveLength(1);
        
        expect(res.status).not.toBe(404);
        expect(res.body).not.toHaveProperty('errors');
    });
})

describe('GET /api/products/:id', () => {
        it('should return 404 if product is not found', async () => {
            const productId = 200
            const res = await request(server).get(`/api/products/${productId}`);
            expect(res.status).toBe(404);
            expect(res.body).toHaveProperty('error');
            expect(res.body.error).toBe('Producto no encontrado');
        });

        it('Should check valid ID in the url', async () => {
            const res = await request(server).get('/api/products/not-a-valid-id');
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('errors');
            expect(res.body.errors).toHaveLength(1);
            expect(res.body.errors[0].msg).toBe('ID no valido');
        })

    it('should get a single product', async () => {
        const res = await request(server).get('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
    });

    
})

describe('PUT /api/products/:id', () => {

    it('Should check valid ID in the url', async () => {
        const res = await request(server).put('/api/products/not-valid-url').send(
            {
                name: "Monitor Curvo - Actualizado",
                price: 540,
                availability: true
            }
        );
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].msg).toBe('ID no valido');
    })

    it('Should validate that the price is greater than 0', async () => {
        const res = await request(server).put('/api/products/1').send(
            {
                name: "Monitor Curvo - Actualizado",
                price: -540,
                availability: true
            }
        );
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors).toBeTruthy();
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].msg).toBe('Precio no valido');

        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('data');
    })

    it('Should return a 404 response for a non-existent', async () => {
        const productId = 2000
        const res = await request(server).put(`/api/products/${productId}`).send(
            {
                name: "Monitor Curvo - Actualizado",
                price: 540,
                availability: true
            }
        );
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');

        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('data');
    })

    it('Should update an existing product with valid data', async () => {
        const res = await request(server).put(`/api/products/1`).send(
            {
                name: "Monitor Curvo - Actualizado",
                price: 540,
                availability: true
            }
        );
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');

        expect(res.status).not.toBe(404);
        expect(res.body).not.toHaveProperty('erors');
    })
})

describe('PATCH /api/products/:id', () => {

    it('Should return a 404 response for a non-existent', async () => {
        const productId = 2000
        const res = await request(server).patch(`/api/products/${productId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');

        expect(res.status).not.toBe(200);
        expect(res.body).not.toHaveProperty('data');
    })

    it('Should update availability of an existing product', async () => {
        const res = await request(server).patch('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.availability).toBe(false);

        expect(res.status).not.toBe(404);
        expect(res.status).not.toBe(400);
        expect(res.body).not.toHaveProperty('errors');
    })
})

describe('DELETE /api/products/:id', () => {
    it('Should check valid ID', async () => {
        const res = await request(server).delete('/api/products/not-valid-url');
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('errors');
        expect(res.body.errors[0].msg).toBe('ID no valido');
    })

   it('Should return a 404 response for a non-existent', async () => {
        const productId = 2000
        const res = await request(server).delete(`/api/products/${productId}`);
        expect(res.status).toBe(404);
        expect(res.body.error).toBe('Producto no encontrado');

        expect(res.status).not.toBe(200);
    })

   it('Should delete an existing product', async () => {
        const res = await request(server).delete('/api/products/1');
        expect(res.status).toBe(200);
        expect(res.body.data).toBe('Producto eliminado');

        expect(res.status).not.toBe(404);
        expect(res.status).not.toBe(400);
    })
})

