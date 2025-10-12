import { SortOption } from "../../infrastructure/pages/product/product.content";
import { Product } from "../entities/product.entity";

export interface IProductService {
    getAllProducts(): Promise<Product[]>;

    sortProductsBy(sortOption: SortOption): Promise<Product[]>;
}

export interface IProductValidation {
    verifyProductsDisplayed(products: Product[]): Promise<void>;

    verifyProductDetails(product: Product): Promise<void>;

    verifySorting(sortOption: SortOption, products: Product[]): Promise<void>;

    verifyCartItemCount(count: number): Promise<void>;
}
