import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceUseCaseOutputDTO, GenerateInvoiceInputDto } from "./invoice.facade.interface";

export interface UseCaseProps {
    findInvoiceUseCase: FindInvoiceUseCase;
    generateInvoiceUseCase: GenerateInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateInvoiceUseCase: GenerateInvoiceUseCase
    private _findInvoiceUseCase: FindInvoiceUseCase

    constructor(props: UseCaseProps) {
        this._generateInvoiceUseCase = props.generateInvoiceUseCase;
        this._findInvoiceUseCase = props.findInvoiceUseCase;   
    }

    async generate(input: GenerateInvoiceInputDto): Promise<void> {
        await this._generateInvoiceUseCase.execute(input);
    }
    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        return await this._findInvoiceUseCase.execute(input);
    }
}