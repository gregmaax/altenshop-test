import {computed, Injectable, signal} from '@angular/core';
import {CartItem} from "./cart-item";
import {Subject} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

export interface CartState {
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  //state
  private state = signal<CartState>({
    items: [],
  });

  // selectors
  items = computed(() => this.state().items);

  // sources
  addNewItem$ = new Subject<CartItem>();
  removeItem$ = new Subject<number>();
  updateQuantityPlus$ = new Subject<number>();
  updateQuantityMinus$ = new Subject<number>();

  constructor() {
    // reducers
    this.addNewItem$.pipe(takeUntilDestroyed()).subscribe((newItem) =>
      this.state.update((state) => {
        //we check if this is a new CartItem or not
        const itemIndex = state.items.findIndex(item => item.id === newItem.id);

        if (itemIndex > -1) {
          //this is not a new item => we update the quantity in the cart
          const updatedItems = state.items.map((item, index) =>
            index === itemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );

          return {
            ...state,
            items: updatedItems,
          };
        } else {
          //this is a new item => we add it with a default quantity of 1
          return {
            ...state,
            items: [...state.items, { ...newItem, quantity: 1 }],
          };
        }
      })
    );

    this.removeItem$.pipe(takeUntilDestroyed()).subscribe((itemId) => this.state.update((state) => ({
      ...state,
      items: state.items.filter((item) => item.id !== itemId),
    })));

    this.updateQuantityPlus$.pipe(takeUntilDestroyed()).subscribe((itemId) =>
      this.state.update((state) => ({
        ...state,
        items: state.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      })));

    this.updateQuantityMinus$.pipe(takeUntilDestroyed()).subscribe((itemId) =>
      this.state.update((state) => ({
        ...state,
        items: state.items.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
            : item
        ),
      })));
  }

  getCartItemsCount(): number {
    return this.items().reduce((total, item) => total + item.quantity, 0);
  }

  isItemInCart(id: number): boolean {
    return this.items().some(item => item.id === id);
  }

  getProductCartItems(id: number): number{
    const productCartItem = this.items().find(product => product.id === id);
    return productCartItem ? productCartItem.quantity : 0;
  }

  incrementQuantity(productId: number){
    const productCartItem = this.items().find(product => product.id === productId);

    if(productCartItem){
      this.updateQuantityPlus$.next(productCartItem.id);
    }
  }

  decrementQuantity(productId: number){
    const productCartItem = this.items().find(product => product.id === productId);

    if(productCartItem){
      this.updateQuantityMinus$.next(productCartItem.id);
    }
  }


}
