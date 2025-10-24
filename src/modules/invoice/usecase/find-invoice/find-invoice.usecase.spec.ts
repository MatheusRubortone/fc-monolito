import Address from "../../../@shared/domain/value-object/address";
import Invoice from "../../domain/invoice";
import FindInvoiceUseCase from "./find-invoice.usecase";
import Id from "../../../@shared/domain/value-object/id.value-object";

const invoice = new Invoice({
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

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn().mockReturnValue(Promise.resolve(invoice))
    };
};

describe("Find Invoice use case unit test", () => {
    it("should find a invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {
            id: new Id("1")
        };

        const result = await usecase.execute(input.id);
        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(invoice.id.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address.street).toEqual(invoice.address.street);
        expect(result.address.number).toEqual(invoice.address.number);
        expect(result.address.complement).toEqual(invoice.address.complement);  
        expect(result.address.city).toEqual(invoice.address.city);
        expect(result.address.state).toEqual(invoice.address.state);
        expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    });
});
