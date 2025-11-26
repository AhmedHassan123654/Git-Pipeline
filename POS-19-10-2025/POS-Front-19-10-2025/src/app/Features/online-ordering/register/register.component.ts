import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CustomerModel, ToastrService, HandlingBackMessages } from "../../customer/customerimport";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  [key: string]: any;
  customerToAdd: CustomerModel = new CustomerModel();
  constructor(
    public orderSer: OrderService,
    public router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    this.route.queryParams.subscribe((params) => {
      this.TableDocumentId = params.TableDocumentId;
    });
  }

  ngOnInit(): void {}
  submitCustomer(form) {
    if (!form.form.valid) return false;
    this.orderSer.GetCustomerByPhone(this.customerToAdd.Phone).subscribe((res) => {
      if ((res as boolean) == true) {
        this.toastr.warning("Your phone already registerd an account before");
      } else {
        this.customerToAdd.UseCredit = true;
        this.orderSer.PostCustomer(this.customerToAdd).subscribe((res) => {
          if (res == 1) {
            this.orderSer.GetCustomerByMobileOrName(this.customerToAdd).subscribe((res) => {
              if (res && res[0]) this.CustomerDocumentId = res[0].DocumentId;
              this.routTo("firstHome/menu");
            });
          } else this.toastr.error(this.toastrMessage.GlobalMessages(res));
        });
      }
    });
  }
  routTo(route: string) {
    this.router.navigateByUrl(
      "/" + route + "?TableDocumentId=" + this.TableDocumentId + "&CustomerDocumentId=" + this.CustomerDocumentId
    );
  }
}
