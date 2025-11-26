import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CompoDetailListComponent } from "./compo-detail-list/compo-detail-list.component";
import { CompoDetailsComponent } from "./compo-details/compo-details.component";

const routes: Routes = [
  {
    path: "",
    component: CompoDetailsComponent,
    data: ["comboProducts", "comboProductslist"]
  },
  {
    path: "comboProductslist",
    component: CompoDetailListComponent,
    data: ["comboProducts", "comboProductslist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompoDetailsRoutingModule {}
