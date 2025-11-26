import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PromoRoutingModule } from "./promo-routing.module";
import { PromoComponent } from "./promo/promo.component";
import { SharedModule } from "src/app/shared/shared.module";
import { PromoListComponent } from "./promo-list/promo-list.component";
import { PaginationModule } from "ngx-bootstrap/pagination";

// import { BreadcrumbsComponent } from 'src/app/shared/breadcrumbs/breadcrumbs.component';

@NgModule({
  declarations: [PromoComponent, PromoListComponent],
  imports: [CommonModule, PromoRoutingModule, SharedModule, PaginationModule.forRoot()]
})
export class PromoModule {}
