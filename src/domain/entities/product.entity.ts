export class Product {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly price: number,
        public readonly imageUrl: string,
        public readonly isAddToCartButton?: boolean,
        public readonly actionButtonText?: string,
        public readonly priceRawString?: string
    ) {}
}
