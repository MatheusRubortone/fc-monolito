import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { CreatedAt, UpdatedAt } from "sequelize-typescript";
import { or } from "sequelize";

const mockdate = new Date(2000, 1, 1); // 10 March 2022 10:00:00

describe("Place Order Usecase unit tests", () => {
    describe("validateProducts method", () => {
        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when no products are selected", async () => {
            const input: PlaceOrderInputDto = { clientId: "0", products: [] };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(
                new Error("No products selected")
            );
        });

        it("should throw an error when product is out of stock", async () => {
            const mockProductFacade = {
                checkStock: jest.fn(({ productId }: { productId: string }) =>
                    Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1,
                    }),
                ),
            };

            //@ts-expect-error - force set productFacade
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            let input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "1" }],
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }],
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

            input = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
            };

            await expect(
                placeOrderUseCase["validateProducts"](input)
            ).rejects.toThrow(new Error("Product 1 is not available in stock"));
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
        });
    });

    describe("getProduct method", () => {
        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockdate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        //@ts-expect-error - no params in constructor
        const placeOrderUseCase = new PlaceOrderUseCase();

        it("should throw an error when product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
                new Error("Product not found"));
        });

        it("should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({
                    id: "0",
                    name: "Product 0",
                    description: "Description 0",
                    salesPrice: 100,
                }),
            }

            //@ts-expect-error - force set catalogFacade
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
                new Product({
                    id: new Id("0"),
                    name: "Product 0",
                    description: "Description 0",
                    salesPrice: 100,
                })
            );
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
        });

    });

    describe("execute method", () => {

        beforeAll(() => {
            jest.useFakeTimers("modern")
            jest.setSystemTime(mockdate);
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("should throw an error when client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };
            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();
            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: "0", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
        });

        it("should throw an error when product are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
            };

            //@ts-expect-error - no params in constructor
            const placeOrderUseCase = new PlaceOrderUseCase();

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - not return never
                .mockRejectedValue(new Error("No products selected"));

            //@ts-expect-error - force set clientFacade
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = { clientId: "1", products: [] };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );

            expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        });

        describe("place an oder", () => {
            const clientProps = {
                id: "1",
                name: "Client 1",
                email: "client@user.com",
                street: "Street",
                number: "123",
                complement: "Complement",
                city: "City",
                state: "State",
                zipCode: "00000-000",
            };

            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(clientProps),
            };

            const mockPaymentFacade = {
                process: jest.fn(),
            };

            const mockChegckoutRepository = {
                addOrder: jest.fn(),
            };

            const mockInvoiceFacade = {
                create: jest.fn().mockResolvedValue({ id: "1i" }),
            };

            const placeOrderUseCase = new PlaceOrderUseCase(
                mockClientFacade as any,
                null,
                null,
                mockChegckoutRepository as any,
                mockInvoiceFacade as any,
                mockPaymentFacade
            );

            const products = {
                "1": new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Description 1",
                    salesPrice: 100,
                }),
                "2": new Product({
                    id: new Id("2"),
                    name: "Product 2",
                    description: "Description 2",
                    salesPrice: 200,
                }),
            };

            const mockValidateProducts = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "validateProducts")
                //@ts-expect-error - spy on private method
                .mockResolvedValue(null);

            const mockGetProduct = jest
                //@ts-expect-error - spy on private method
                .spyOn(placeOrderUseCase, "getProduct")
                //@ts-expect-error - spy on private method
                .mockImplementation((productId: keyof typeof products) => {
                    return products[productId];
                });

            it("should not be approved", async () => {
                mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                    transactionId: "1t",
                    orderId: "1o",
                    amount: 300,
                    status: "error",
                    createdAt: new Date(),
                    UpdatedAt: new Date()
                });

                const input: PlaceOrderInputDto = {
                    clientId: "1c",
                    products: [{ productId: "1" }, { productId: "2" }]
                };

                let output = await placeOrderUseCase.execute(input);

                expect(output.invoiceId).toBe(null);
                expect(output.total).toBe(300);
                expect(output.products).toStrictEqual([{ productId: "1"}, { productId: "2"}]);
                expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
                expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
                expect(mockValidateProducts).toHaveBeenCalledTimes(1);
                expect(mockValidateProducts).toHaveBeenCalledWith(input);
                expect(mockGetProduct).toHaveBeenCalledTimes(2);
                expect(mockChegckoutRepository.addOrder).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
                expect(mockPaymentFacade.process).toHaveBeenCalledWith({
                    orderId: output.id,
                    amount: output.total,
                });

                expect(mockInvoiceFacade.create).not.toHaveBeenCalled();
            });
        });
    });
});