import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import FindAllProductsUsecase from "../../store-catalog/usecase/find-all-products/find-all-products.usecase";
import Address from "../../@shared/domain/value-object/address";

@Table({
    tableName: "invoices",
    timestamps: false
})
export class InvoiceModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string;
    @Column({ allowNull: false })
    name: string;
    @Column({ allowNull: false })
    document: string;
    @Column({ allowNull: false })
    address: Address;
    @Column({ allowNull: false, type: 'TEXT' })
    items: string; // Stored as JSON string
    @Column({ allowNull: false })
    createdAt: Date;    
    @Column({ allowNull: false })
    updatedAt: Date;
}