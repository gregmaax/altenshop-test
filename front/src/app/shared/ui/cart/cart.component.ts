import {ChangeDetectionStrategy, Component, inject, input, signal} from '@angular/core';
import {Button} from "primeng/button";
import {CartService} from "../../data-access/cart.service";
import {Product} from "../../../products/data-access/product.model";
import {DialogModule} from "primeng/dialog";
import {ProductFormComponent} from "../../../products/ui/product-form/product-form.component";
import {CartItemsListComponent} from "./cart-items-list/cart-items-list.component";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    Button,
    DialogModule,
    ProductFormComponent,
    CartItemsListComponent
  ],
  template: `
    <p-button
      label="Panier"
      icon="pi pi-shopping-cart"
      severity="primary"
      [badge]="cartCountInput()"
      (onClick)="showCartItems()"
    />

    <p-dialog [(visible)]="isDialogVisible"
              [style]="{ width: '30vw' }"
              header="Panier">
        <app-cart-items-list [cartItems]="cartService.items()"/>
    </p-dialog>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  cartCountInput = input.required<string>();
  cartService = inject(CartService);

  public isDialogVisible = false;

  showCartItems(){
    this.isDialogVisible = true;
  }
}
