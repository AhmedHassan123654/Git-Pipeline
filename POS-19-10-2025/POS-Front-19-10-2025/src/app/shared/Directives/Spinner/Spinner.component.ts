import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { SpinnerService } from "src/app/core/Services/Shared/Spinner/SpinnerService";

@Component({
  selector: "app-Spinner",
  templateUrl: "./Spinner.component.html",
  styleUrls: ["./Spinner.component.css"]
})
export class SpinnerComponent implements OnInit {
  showSpinner = false;
  constructor(private spinnerSer: SpinnerService, private cdRef: ChangeDetectorRef, private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.spinnerSer.ShowSpinnerInThisComponent = !(
          event.url.toLowerCase().includes("/order") || event.url.toLowerCase().includes("/followorder")
        );
      }
    });
  }

  ngOnInit() {
    this.init();
  }
  init() {
    this.spinnerSer.getSpinnerObserver().subscribe((status) => {
      this.showSpinner = status === "start";
      this.cdRef.detectChanges();
    });
  }
}
