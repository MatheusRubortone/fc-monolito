import InvoiceItem from "../../domain/invoice-items";

export interface GenerateInvoiceInputDto { 
  id?: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: InvoiceItem[];
}

export interface GenerateInvoiceOutputDto {
  id: string;
  name: string;
  document: string;
  address: {
    street: string;
    number: string;
    complement: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: InvoiceItem[];
  total: number;
}