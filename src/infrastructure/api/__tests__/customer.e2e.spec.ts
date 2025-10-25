import Address from '../../../modules/@shared/domain/value-object/address';
import { app, sequelize } from '../express';
import request from 'supertest';

describe("E2E test for customer", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "John Doe",
                email: "john@email.com ",
                document: "12345678900",
                address: {
                    street: "Street 1",
                    number: "123",
                    complement: "Apt 4",
                    city: "City",
                    state: "State",
                    zipCode: "12345-678"
                }
            });
            
        expect(response.status).toBe(200);
        expect(response.body.name).toBe("John Doe");
        expect(response.body.email).toBe("john@email.com ");
        expect(response.body.document).toBe("12345678900");
        expect(response.body.address._street).toBe("Street 1");
        expect(response.body.address._number).toBe("123");
        expect(response.body.address._complement).toBe("Apt 4");
        expect(response.body.address._city).toBe("City");
        expect(response.body.address._state).toBe("State");
        expect(response.body.address._zipCode).toBe("12345-678");
    });

    it("should not create a customer", async () => {
        const response = await request(app)
            .post("/clients")
            .send({
                name: "John Doe"
            });
        expect(response.status).toBe(500);
    });
});