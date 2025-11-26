import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { CustomerModel, ToastrService, HandlingBackMessages } from "../../customer/customerimport";
import { OrderService } from "src/app/core/Services/Transactions/order.service";

@Component({
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.scss"]
})
export class ReservationComponent implements OnInit {
  [key: string]: any;
  constructor(
    private location: Location,
    public router: Router,
    private route: ActivatedRoute,
    public orderSer: OrderService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    this.route.queryParams.subscribe((params) => {
      this.TableDocumentId = params.TableDocumentId;
    });
  }
  GoBack() {
    this.location.back();
  }
  ngOnInit(): void {}
  routTo(route: string) {
    this.router.navigateByUrl(
      "/" + route + "?TableDocumentId=" + this.TableDocumentId + "&CustomerDocumentId=" + this.CustomerDocumentId
    );
  }
  logInCustomer(form) {
    if (!form.form.valid) return false;
    this.orderSer
      .GetCustomerByMobileOrName({ Phone: this.Phone } as CustomerModel)
      .subscribe((res: CustomerModel[]) => {
        if (res && res.length && res.filter((x) => x.Phone == this.Phone)[0]) {
          this.CustomerDocumentId = res.filter((x) => x.Phone == this.Phone)[0].DocumentId;
          this.routTo("firstHome/menu");
        } else {
          this.toastr.warning("Your phone is not registerd!");
        }
      });
  }
}
