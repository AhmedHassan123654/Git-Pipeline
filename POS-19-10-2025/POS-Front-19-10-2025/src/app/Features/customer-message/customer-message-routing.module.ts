import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerMessageListComponent } from './customer-message-list/customer-message-list.component';
import { CustomerMessageComponent } from './customer-message/customer-message.component';

const routes: Routes = [
  {
    path: "",
    component: CustomerMessageComponent,
    data: ["CustomerMessage", "customerMessagelist"]
  },
  {
    path: "customerMessagelist",
    component: CustomerMessageListComponent,
    data: ["CustomerMessage", "customerMessagelist"]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerMessageRoutingModule { }
