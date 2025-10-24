import Address from "../../../@shared/domain/value-object/address";
import InvoiceItem from "../../domain/invoice-items";

export interface FindInvoiceUseCaseInputDTO {
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