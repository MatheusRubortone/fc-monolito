import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  generate(invoice: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}