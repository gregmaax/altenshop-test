import {
  Component, inject,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SplitterModule } from 'primeng/splitter';
import { ToolbarModule } from 'primeng/toolbar';
import { PanelMenuComponent } from "./shared/ui/panel-menu/panel-menu.component";
import {Button} from "primeng/button";
import {CartComponent} from "./shared/ui/cart/cart.component";
import {CartService} from "./shared/data-access/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  standalone: true,
  imports: [RouterModule, SplitterModule, ToolbarModule, PanelMenuComponent, Button, CartComponent],
})
export class AppComponent {
  title = "ALTEN SHOP";
  cartService = inject(CartService);
}
