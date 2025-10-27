import { app, sequelize } from '../express';
import express, { Express } from 'express';
import request from 'supertest';
import { productRoute } from '../routes/product.route';
import { Sequelize } from 'sequelize-typescript';
import { Umzug } from "umzug";
import ProductModelCatalog from '../../../modules/store-catalog/repository/product.model';
import { ProductModel } from '../../../modules/product-adm/repository/product.model';
import { migrator } from '../../config-migrations/migrator';

describe("E2E test for product", () => {
    const app: Express = express();
    app.use(express.json())
    app.use("/products", productRoute)

    let sequelize: Sequelize

    let migration: Umzug<any>;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ":memory:",
            logging: false
        })

        sequelize.addModels([ProductModel, ProductModelCatalog])
        migration = migrator(sequelize)
        await migration.up()
    })

    afterEach(async () => {
        if (!migration || !sequelize) {
            return
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close()
    })

    it("should create a product", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 1",
                description: "Product 1 description",
                purchasePrice: 100,
                stock: 10
            });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.description).toBe("Product 1 description");
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.stock).toBe(10);
        expect(response.body.id).toBeDefined();
        expect(response.body.createdAt).toBeDefined();
        expect(response.body.updatedAt).toBeDefined();
    });

    it("should create a product with custom id", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                id: "1123",
                name: "Product 2",
                description: "Product 2 description",
                purchasePrice: 200,
                stock: 20
            });

        expect(response.status).toBe(200);
        expect(response.body.id).toBe("1123");
        expect(response.body.name).toBe("Product 2");
        expect(response.body.description).toBe("Product 2 description");
        expect(response.body.purchasePrice).toBe(200);
        expect(response.body.stock).toBe(20);
    });

    it("should not create a product with missing required fields", async () => {
        const response = await request(app)
            .post("/products")
            .send({
                name: "Product 3"
            });

        expect(response).toBe(500);
    });
});
