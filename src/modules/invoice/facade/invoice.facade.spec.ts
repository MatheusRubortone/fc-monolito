import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "../../client-adm/repository/client.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import { InvoiceModel } from "../repository/invoice.model"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItem from "../domain/invoice-items"
import Id from "../../@shared/domain/value-object/id.value-object"

describe("Invoice Facade test", () => {

  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true }
    })

    sequelize.addModels([ClientModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

    it("should generate a invoice", async () => {
        const repository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: undefined,
        });

        const input = {
            Id: "1",
            name: "Invoice 1",
            document: "123456789",
            address: new Address(
                "Street 1",
                "123",
                "Complement 1",
                "City 1",
                "State 1",
                "12345-678"
            ),
            items: [
                new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 }),
                new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 })    
            ]
        };
        await facade.generate(input);

        const invoice = await InvoiceModel.findOne({ where: { id: "1" } });

        expect(invoice).toBeDefined();
        expect(invoice.id).toBe(input.Id);
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.street).toBe(input.street);
        expect(invoice.number).toBe(input.number);
        expect(invoice.complement).toBe(input.complement);
        expect(invoice.city).toBe(input.city);
        expect(invoice.state).toBe(input.state);
        expect(invoice.zipCode).toBe(input.zipCode);
    });
    

    it("should find a invoice", async () => {
        const repository = new InvoiceRepository();
        const findInvoiceUseCase = new FindInvoiceUseCase(repository);
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(repository);
        const facade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: findInvoiceUseCase,
        });

       const input = {
            Id: "1",
            name: "Invoice 1",
            document: "123456789",
            address: new Address(
                "Street 1",
                "123",
                "Complement 1",
                "City 1",
                "State 1",
                "12345-678"
            ),
            items: [
                new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 }),
                new InvoiceItem({ id: new Id("2"), name: "Item 2", price: 200 })    
            ]
        };
        await facade.generate(input);

        const result = await facade.find({ id: "1" });

        expect(result.id).toBe(input.Id);
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.address.street).toBe(input.address.street);
        expect(result.address.number).toBe(input.address.number);
        expect(result.address.complement).toBe(input.address.complement);
        expect(result.address.city).toBe(input.address.city);
        expect(result.address.state).toBe(input.address.state);
        expect(result.address.zipCode).toBe(input.address.zipCode);
        expect(result.items.length).toBe(2);
    }
})