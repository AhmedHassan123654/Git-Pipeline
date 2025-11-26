import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TabelsHallService } from "src/app/core/Services/order/TabelsHallService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";

@Component({
  selector: "app-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.css"]
})
export class TabsComponent implements OnInit {
  // tabs = [
  //   {id: 5656, name: 'tab'}
  // ];
  tabs: any = [];
  //selectedTab = this.tabs[this.tabs.length - 1].name || '';
  selectedTab: string;
  hall: any;
  halls: any = [];
  popupOpen: boolean = false;
  pricingClasses: any = [];
  Tables: any = [];
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public hallServ: TabelsHallService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages
  ) {
    // if (localStorage.getItem("tabs") != null && JSON.parse(localStorage.getItem("tabs")).length > 0) {
    //   this.tabs = JSON.parse(localStorage.getItem("tabs"));
    //   this.selectedTab = this.tabs[this.tabs.length - 1].name || '';
    // } else {
    //   localStorage.setItem('tabs', JSON.stringify(this.tabs));
    // }

    this.GetAllHalls();
  }
  manageorderlink(e) {
    //this.router.navigate(["/order", { 'data': e}]);
  }

  ngOnInit() {
    this.GetAllPricingClasses();
    // this.GetAllTables();
  }

  listClick(tab) {
    this.selectedTab = tab;
  }

  addNewTab() {
    if (this.hall && this.hall.Name) {
      // let unique = Date.now();
      // this.tabs.push({id: unique, name: this.hall.Name});
      // localStorage.setItem('tabs', JSON.stringify(this.tabs));
      this.InsertHall(this.hall);
      this.popupOpen = false;
      //location.reload();
    } else {
      this.popupOpen = false;
    }
  }

  removeMe(tab) {
    if (confirm("Are you sure to Remove")) {
      let curTab = this.tabs.filter((x) => x.Name == tab.Name)[0];
      if (curTab) this.DeleteHall(curTab.DocumentId);
    }
  }
  DeleteHall(model: any) {
    this.hallServ.DeleteHall(model).subscribe(
      (res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(3), "halls");
        this.GetAllHalls();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "halls");
      }
    );
  }
  InsertHall(model: any) {
    this.hallServ.InsertHall(model).subscribe(
      (res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(1), "halls");
        this.GetAllHalls();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "halls");
      }
    );
  }
  GetAllHalls() {
    this.hallServ.GetAllHalls().subscribe((res) => {
      this.halls = res;
      if (this.halls && this.halls.length > 0) {
        this.tabs = this.halls;
        this.selectedTab = this.tabs[this.tabs.length - 1].Name || "";
      }
      let script = document.createElement("script");
      script.setAttribute("src", "./assets/js/index.js");
      document.body.appendChild(script);
    });
  }
  GetAllPricingClasses() {
    this.hallServ.GetAllPricingClasses().subscribe((res) => {
      this.pricingClasses = res;
    });
  }
  GetAllTables() {
    this.hallServ.GetAllTables().subscribe((res) => {
      this.Tables = res;
    });
  }
}
