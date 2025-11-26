import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CouponComponent } from './coupon/coupon.component';
import { CouponListComponent } from './coupon-list/coupon-list.component';

const routes: Routes = [ {
  path: "",
  component: CouponComponent,
  data: ["coupon", "couponsList"],
},
{
  path: "couponsList",
  component: CouponListComponent,
  data: ["coupon", "couponsList"]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponRoutingModule { }
