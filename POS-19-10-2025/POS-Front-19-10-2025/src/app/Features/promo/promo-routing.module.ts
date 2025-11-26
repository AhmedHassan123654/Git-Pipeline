import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { PromoComponent } from "./promo/promo.component";
import { PromoListComponent } from "./promo-list/promo-list.component";
const routes: Routes = [
  { path: "", component: PromoComponent, data: ["promo", "promolist"] },
  {
    path: "promolist",
    component: PromoListComponent,
    data: ["promo", "promolist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PromoRoutingModule {}
