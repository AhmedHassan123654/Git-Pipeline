import { element } from "protractor";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ReturnInsuranseService } from "src/app/core/Services/order/ReturnInsuranseService";
import { CalendarComponent } from "@syncfusion/ej2-angular-calendars";
import { Router } from "@angular/router";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { ToastrService } from "ngx-toastr";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
declare var $: any;
@Component({
  selector: "app-returninsurance",
  templateUrl: "./returninsurance.component.html",
  styleUrls: ["./returninsurance.component.css"]
})
export class ReturninsuranceComponent implements OnInit {
  @ViewChild("calendar")
  public calendar: CalendarComponent;
  returnInsuranceObj: any = {};
  calenderValue: Date;
  insurenceDetailList: any;
  insurencesList: any;
  language: string;
  constructor(
    private returnInsuranceService: ReturnInsuranseService,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: Router
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);

    this.returnInsuranceObj = this.router.getCurrentNavigation().extras as OrderModel;
    if (this.returnInsuranceObj && this.returnInsuranceObj.OrderDetails) {
      //let detailsInsurances = this.returnInsuranceObj.OrderDetails.fo.map(x=>x.OrderDetailInsuranceModels);
      //if (detailsInsurances.some(this.checkAny)) {
      //this.insurenceDetailList = this.returnInsuranceObj.OrderDetails.map(c=>c.OrderDetailInsuranceModels)[0];
      //this.insurenceDetailList=this.insurenceDetailList.filter(n=>n!==undefined)
      this.insurenceDetailList = [];
      this.returnInsuranceObj.OrderDetails.forEach((element) => {
        if (element.OrderDetailInsuranceModels != null && element.OrderDetailInsuranceModels.length > 0) {
          element.OrderDetailInsuranceModels.forEach((insurance) => {
            this.insurenceDetailList.push(insurance);
          });
        }
      });
    }
  }
  ngOnInit() {
    this.GetAllInsurances();
  }
  GetAllInsurances() {
    this.returnInsuranceService.GetAllInsurances().subscribe((res) => {
      this.insurencesList = res;
      if (
        this.insurenceDetailList &&
        this.insurenceDetailList.length > 0 &&
        this.insurencesList &&
        this.insurencesList.length > 0
      ) {
        this.insurenceDetailList.forEach((i) => {
          this.returnInsuranceService
            .GetSumOfReturnedQty(this.returnInsuranceObj.DocumentId, i.DocumentId)
            .subscribe((res) => {
              i.OldReturnedQuantity = res;
            });
          let insurance = this.insurencesList.filter((x) => x.Id == i.InsuranceId)[0];
          i.InsuranceName = insurance ? insurance.Name : "";
          i.ReturnedQuantity = 0;
        });
      }
    });
  }
  Save(event: any) {
    if (event.submitter.name == "save") {
      if (
        this.insurenceDetailList.filter((x) => Number(x.ReturnedQuantity) == 0).length ==
        this.insurenceDetailList.length
      ) {
        this.toastr.error("Please Enter Return Quantity", "Return Insurance");
        return;
      } else if (this.insurenceDetailList.find((x) => Number(x.ReturnedQuantity) > x.Quantity) != null) {
        this.toastr.error("Return Quantity is not Correct", "Return Insurance");
        return;
      } else {
        var POSReturnedInsuranceDetails = [];
        this.insurenceDetailList.forEach((element) => {
          POSReturnedInsuranceDetails.push({
            OrderDetailInsuranceId: element.DocumentId,
            ReturnedQuantity: element.ReturnedQuantity
          });
        });
        var model = {
          OrderId: this.returnInsuranceObj.DocumentId,
          ReturnDate: new Date(),
          BranchId: this.returnInsuranceObj.BranchId,
          POSReturnedInsuranceDetails: POSReturnedInsuranceDetails
        };

        this.returnInsuranceService.Save(model).subscribe((res) => {
          if (res == 1) {
            this.insurenceDetailList.forEach((i) => {
              this.returnInsuranceService
                .GetSumOfReturnedQty(this.returnInsuranceObj.DocumentId, i.DocumentId)
                .subscribe((res) => {
                  i.OldReturnedQuantity = res;
                  if (i.OldReturnedQuantity == i.Quantity) {
                    const index: number = this.insurenceDetailList.indexOf(i);
                    if (index !== -1) {
                      this.insurenceDetailList.splice(index, 1);
                    }
                  }
                });
            });
            this.toastr.success("Saved successfully", "Return Insurance");
          } else {
            this.toastr.error("Failed to complete the process", "Return Insurance");
          }
        });
      }
    }
  }
  checkAny(list) {
    if (list[0]) return true;
    return false;
  }
}
