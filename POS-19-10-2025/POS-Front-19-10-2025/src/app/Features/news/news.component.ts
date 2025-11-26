import { Component, OnInit } from "@angular/core";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit {
  constructor(private dashboardSer: DashboardService) {}

  openModal() {}

  ngOnInit(): void {
    if (this.dashboardSer.isClicked === true) {
    }
  }
}
