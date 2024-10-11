import {Component, input, output} from '@angular/core';
import {Button} from "primeng/button";

@Component({
  selector: 'app-cart-items-counter',
  standalone: true,
  imports: [
    Button
  ],
  template: `
    <div class="flex flex-row align-items-center justify-content-between">
      <p-button icon="pi pi-minus" [text]="true" severity="primary" (onClick)="decrement.emit()"/>
      <span>{{cartItemCount()}}</span>
      <p-button icon="pi pi-plus" [text]="true" severity="primary" (onClick)="increment.emit()"/>
    </div>
  `,
  styles: ``
})
export class CartItemsCounterComponent {
  cartItemCount = input.required<number>();
  increment = output();
  decrement = output();
}
