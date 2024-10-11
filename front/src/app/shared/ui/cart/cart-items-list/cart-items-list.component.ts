import {Component, inject, input} from '@angular/core';
import {CartItem} from "../../../data-access/cart-item";
import {Button} from "primeng/button";
import {CartService} from "../../../data-access/cart.service";
import {CartItemsCounterComponent} from "../cart-items-counter/cart-items-counter.component";

@Component({
  selector: 'app-cart-items-list',
  standalone: true,
  imports: [
    Button,
    CartItemsCounterComponent
  ],
  template: `
    <div>
      @if(cartItems().length > 0){
        @for (item of cartItems(); track item.id){
          <ul>
            <li>
              <div class="flex flex-row justify-content-between align-items-center gap-2">
                <span>{{item.name}}</span>
                <div class="flex flex-row gap-4 align-items-center">
                  <app-cart-items-counter
                    [cartItemCount]="cartService.getCartItemsCount()"
                    (decrement)="cartService.updateQuantityMinus$.next(item.id)"
                    (increment)="cartService.updateQuantityPlus$.next(item.id)"/>
                  <p-button icon="pi pi-times" [rounded]="true" [text]="true" severity="danger" (onClick)="cartService.removeItem$.next(item.id)"/>
                </div>
              </div>
            </li>
          </ul>
        }
      } @else {
        <span class="font-italic">Panier vide</span>
      }

    </div>
  `,
  styles: ``
})
export class CartItemsListComponent {
  cartItems = input.required<CartItem[]>();
  cartService = inject(CartService);
}
