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
        expect(result.id).toBedefined();
        expect(result.name).toEqual(input.name);
        expect(result.document).toEqual(input.document);
        expect(result.street).toEqual(input.street);
        expect(result.number).toEqual(input.number);
        expect(result.complement).toEqual(input.complement);
        expect(result.city).toEqual(input.city);
        expect(result.state).toEqual(input.state);
        expect(result.zipCode).toEqual(input.zipCode);
        expect(result.items.length).toEqual(2);
    });
});