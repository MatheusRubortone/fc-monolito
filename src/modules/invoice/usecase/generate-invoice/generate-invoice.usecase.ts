import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceInputDto } from "./generate-invoice.usecase.dto";
import { GenerateInvoiceOutputDto } from "./generate-invoice.usecase.dto";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice";
import Address from "../../../@shared/domain/value-object/address";

export default class GenerateInvoiceUseCase{
    private _invoiceRepository: InvoiceGateway;
    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: GenerateInvoiceInputDto): Promise<GenerateInvoiceOutputDto>{

        const props = {
            id: new Id(input.id),
            name: input.name,
            document: input.document,
            address: new Address(
                input.address.street,
                input.address.number,
                input.address.complement,
                input.address.city,
                input.address.state,
                input.address.zipCode
            ),
            items: input.items
        };

        const invoice = new Invoice(props);
        this._invoiceRepository.generate(invoice);

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            address: {
                 street: invoice.address.street,
                 number: invoice.address.number,
                 complement: invoice.address.complement,
                 city: invoice.address.city,
                 state: invoice.address.state,
                 zipCode: invoice.address.zipCode
            },
            items: invoice.items,
            total: invoice.items.reduce((acc, item) => acc + item.price, 0)
        };
    }
}