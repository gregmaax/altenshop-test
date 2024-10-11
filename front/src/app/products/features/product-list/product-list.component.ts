import {ChangeDetectionStrategy, Component, inject, OnInit, signal} from "@angular/core";
import {Product} from "app/products/data-access/product.model";
import {ProductsService} from "app/products/data-access/products.service";
import {ProductFormComponent} from "app/products/ui/product-form/product-form.component";
import {ButtonModule} from "primeng/button";
import {CardModule} from "primeng/card";
import {DataViewModule} from 'primeng/dataview';
import {DialogModule} from 'primeng/dialog';
import {TagModule} from "primeng/tag";
import {AsyncPipe, DatePipe} from "@angular/common";
import {CartItem} from "../../../shared/data-access/cart-item";
import {CartService} from "../../../shared/data-access/cart.service";
import {CartItemsCounterComponent} from "../../../shared/ui/cart/cart-items-counter/cart-items-counter.component";

const emptyProduct: Product = {
  id: 0,
  code: "",
  name: "",
  description: "",
  image: "",
  category: "",
  price: 0,
  quantity: 0,
  internalReference: "",
  shellId: 0,
  inventoryStatus: "INSTOCK",
  rating: 0,
  createdAt: 0,
  updatedAt: 0,
};

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  standalone: true,
  imports: [DataViewModule, CardModule, ButtonModule, DialogModule, ProductFormComponent, TagModule, DatePipe, AsyncPipe, CartItemsCounterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);

  public addedToCart = false;

  public readonly products = this.productsService.products;

  public isDialogVisible = false;
  public isCreation = false;
  public readonly editedProduct = signal<Product>(emptyProduct);

  ngOnInit() {
    this.productsService.get().subscribe();
  }

  public onCreate() {
    this.isCreation = true;
    this.isDialogVisible = true;
    this.editedProduct.set(emptyProduct);
  }

  public onUpdate(product: Product) {
    this.isCreation = false;
    this.isDialogVisible = true;
    this.editedProduct.set(product);
  }

  public onDelete(product: Product) {
    this.productsService.delete(product.id).subscribe();
  }

  public onSave(product: Product) {
    if (this.isCreation) {
      this.productsService.create(product).subscribe();
    } else {
      this.productsService.update(product).subscribe();
      console.log(product.inventoryStatus)
    }
    this.closeDialog();
  }

  public onAddToCart(productId: number, productName: string){
    this.cartService.addNewItem$.next({id: productId, name: productName, quantity: 1});
  }

  public onDeleteFromCart(productId: number){
    this.cartService.removeItem$.next(productId);
  }

  isItemInCart(id: number){
    return this.cartService.isItemInCart(id);
  }

  incrementQuantity(id: number){
    this.cartService.incrementQuantity(id);
  }

  decrementQuantity(id: number){
    this.cartService.decrementQuantity(id);
  }

  getProductCartItem(id: number){
    return this.cartService.getProductCartItems(id);
  }

  public onCancel() {
    this.closeDialog();
  }

  private closeDialog() {
    this.isDialogVisible = false;
  }
}
