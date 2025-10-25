import Address from "../../@shared/domain/value-object/address"
import Invoice from "../domain/invoice";
import InvoiceItem from "../domain/invoice-items";

export interface FindInvoiceFacadeInputDTO {
  id: string;
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string;
  name: string;
  document: string;
  address: Address
  items: InvoiceItem[];
  total: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface GenerateInvoiceInputDto { 
  id?: string;
  name: string;
  document: string;
  email?: string;
  address: Address;
  items: InvoiceItem[];
}

export default interface InvoiceFacadeInterface {
  generate(input: GenerateInvoiceInputDto): Promise<void>;
  find(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceUseCaseOutputDTO>;
}