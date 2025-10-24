import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";     

export default class InvoiceFacadeFactory {
    static create() {   
        const invoiceRepository = new InvoiceRepository();
        const generateInvoiceUseCase = new GenerateInvoiceUseCase(invoiceRepository);
        const findInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);  
        const facade = new InvoiceFacade({
            generateInvoiceUseCase: generateInvoiceUseCase,
            findInvoiceUseCase: findInvoiceUseCase, 
        });

        return facade;
    }
}
