import Address from "../../@shared/domain/value-object/address";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import Invoice from "../domain/invoice";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class InvoiceRepository implements InvoiceGateway {
  async generate(entity: Invoice): Promise<void> {

    await InvoiceModel.create({
        id: entity.id.id,
        name: entity.name,
        document: entity.document,
        street: entity.address.street,
        number: entity.address.number,
        complement: entity.address.complement,
        city: entity.address.city,
        state: entity.address.state,
        zipCode: entity.address.zipCode,
        items: JSON.stringify(entity.items),
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt
    });
  }
    async find(id: string): Promise<Invoice> {

        const invoice = await InvoiceModel.findOne({ where: { id } });

        if (!invoice) {
            throw new Error("Invoice not found");
        }

        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipCode
            ),
            items: [],
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        });
    }
}