import { InvoiceModel } from "../repository/invoice.model";
import { Sequelize } from "sequelize-typescript";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice"
import Address from "../../@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-items";
import Id from "../../@shared/domain/value-object/id.value-object";
import { InvoiceItemsModel } from "./invoice-items.model";

describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel])
        sequelize.addModels([InvoiceItemsModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a invoice", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "Invoice 1",
            document: "12345678900",
            address: new Address(
                "Street 1",
                "123",
                "Apt 1",
                "City 1",
                "State 1",
                "12345-678"
            ),
            items: []
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1"} });
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.id).toEqual(invoice.id.id);
        expect(invoiceDb.name).toEqual(invoice.name);
        expect(invoiceDb.document).toEqual(invoice.document);
        expect(invoiceDb.street).toEqual(invoice.address.street);
        expect(invoiceDb.number).toEqual(invoice.address.number);
        expect(invoiceDb.complement).toEqual(invoice.address.complement);
        expect(invoiceDb.city).toEqual(invoice.address.city);
        expect(invoiceDb.state).toEqual(invoice.address.state);
        expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);
        expect(invoiceDb.createdAt).toStrictEqual(invoice.createdAt);
        expect(invoiceDb.updatedAt).toStrictEqual(invoice.updatedAt);
    });

    it("should find a invoice", async () => {
        const invoice = await InvoiceModel.create({
            id: "1",
            name: "Invoice 1",
            document: "12345678900",
            street: "Street 1",
            number: "123",
            complement: "Apt 1",
            city: "City 1",
            state: "State 1",
            zipCode: "12345-678",
            items: [],
            createdAt: new Date(),
            updatedAt: new Date()
        });

        const repository = new InvoiceRepository();
        const result = await repository.find(invoice.id);
        expect(result.id.id).toEqual(invoice.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.street);
        expect(result.address.number).toEqual(invoice.number);
        expect(result.address.complement).toEqual(invoice.complement);
        expect(result.address.city).toEqual(invoice.city);
        expect(result.address.state).toEqual(invoice.state);
        expect(result.address.zipCode).toEqual(invoice.zipCode);
        expect(result.createdAt).toStrictEqual(invoice.createdAt);
        expect(result.updatedAt).toStrictEqual(invoice.updatedAt);
    });
});