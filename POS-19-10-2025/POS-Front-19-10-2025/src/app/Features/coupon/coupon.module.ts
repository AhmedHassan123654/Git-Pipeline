import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponRoutingModule } from './coupon-routing.module';
import { CouponComponent } from './coupon/coupon.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CouponComponent, CouponListComponent],
  imports: [
    CommonModule,
    CouponRoutingModule,
    SharedModule
  ]
})
export class CouponModule { }
