import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { 
    FindInvoiceFacadeInputDTO, 
    FindInvoiceUseCaseOutputDTO, 
    GenerateInvoiceInputDto 
} from "./invoice.facade.interface";

export interface UseCaseProps {
    findInvoiceUseCase: UseCaseInterface;
    generateInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    private _generateInvoiceUseCase: UseCaseInterface
    private _findInvoiceUseCase: UseCaseInterface

    constructor(usecaseProps: UseCaseProps) {
        this._generateInvoiceUseCase = usecaseProps.generateInvoiceUseCase;
        this._findInvoiceUseCase = usecaseProps.findInvoiceUseCase;   
    }

    async generate(input: GenerateInvoiceInputDto): Promise<void> {
        await this._generateInvoiceUseCase.execute(input);
    }
    async find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
        return await this._findInvoiceUseCase.execute(input);
    }
}