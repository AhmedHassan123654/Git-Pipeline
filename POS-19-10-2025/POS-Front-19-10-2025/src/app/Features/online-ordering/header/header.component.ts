import { Component, HostListener, OnInit } from "@angular/core";
import { AppService } from "src/app/core/Services/app.service";
import { CartOverviewComponent } from "src/app/shared/cart-overview/cart-overview.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  isBottom: boolean;

  constructor(private router: Router, public appService: AppService) {}
  public sidenavToggle() {
    // this.onMenuIconClick.emit();
  }
  public openCart() {
    this.appService.openCart(CartOverviewComponent);
  }
  public reservation() {
    // this.appService.makeReservation(ReservationDialogComponent, null, true);
  }
  ngOnInit(): void {}
  @HostListener("window:scroll", [])
  onScroll(): void {
    if (window.innerHeight + window.scrollY == document.body.offsetHeight) {
      this.isBottom = true;
    } else {
      this.isBottom = false;
    }
  }
  CheckUrl() {
    let isMenu = this.router.url.toLowerCase().includes("menu");
    return isMenu;
  }
}
