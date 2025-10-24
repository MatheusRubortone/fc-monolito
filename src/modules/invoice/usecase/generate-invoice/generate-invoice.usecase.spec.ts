import Id from "../../../@shared/domain/value-object/id.value-object";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-items";

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    };
};

describe("Generate Invoice Usecase unit tests", () => {
    it("should generate a invoice", async () => { 
        const Repository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(Repository);

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
        const result = await usecase.execute(input);

        expect(Repository.generate).toHaveBeenCalled();
        expect(result.id).toBeDefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.address.street).toEqual(input.address.street);
        expect(result.address.number).toEqual(input.address.number);
        expect(result.address.complement).toEqual(input.address.complement);
        expect(result.address.city).toEqual(input.address.city);
        expect(result.address.state).toEqual(input.address.state);
        expect(result.address.zipCode).toEqual(input.address.zipCode);
        expect(result.total).toEqual(300);
        expect(result.items.length).toEqual(2);
    });
});