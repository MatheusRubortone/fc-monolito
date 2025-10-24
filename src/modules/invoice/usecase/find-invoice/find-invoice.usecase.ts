import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from "./find-invoice.usecase.dto";
import InvoiceGateway from "../../gateway/invoice.gateway";
import Address from "../../../@shared/domain/value-object/address";


export default class FindInvoiceUseCase{
    private _invoiceRepository: InvoiceGateway;
    constructor(invoiceRepository: InvoiceGateway){
        this._invoiceRepository = invoiceRepository;
    }

    async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO>{

        const result =  await this._invoiceRepository.find(input.id);

        return {
            id: result.id.id,
            name: result.name,
            document: result.document,
            address: new Address(
                result.address.street,
                result.address.number,
                result.address.complement,
                result.address.city,
                result.address.state,
                result.address.zipCode
            ),
            items: result.items,
            total: result.items.reduce((acc, item) => acc + item.price, 0),
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        };
    }
}