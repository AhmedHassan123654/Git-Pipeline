import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerMessageRoutingModule } from './customer-message-routing.module';
import { CustomerMessageComponent } from './customer-message/customer-message.component';
import { CustomerMessageListComponent } from './customer-message-list/customer-message-list.component';
import { SharedModule } from "src/app/shared/shared.module";


@NgModule({
  declarations: [CustomerMessageComponent, CustomerMessageListComponent],
  imports: [
    CommonModule,
    CustomerMessageRoutingModule,
    SharedModule
  ]
  
})
export class CustomerMessageModule { }
