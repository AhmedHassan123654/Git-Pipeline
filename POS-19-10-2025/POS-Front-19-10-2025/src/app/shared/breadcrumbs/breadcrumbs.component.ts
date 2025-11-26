import { Component, DoCheck, Input, OnInit } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfigService } from "src/app/core/Services/Shared/config.service";
@Component({
  selector: "app-breadcrumbs",
  templateUrl: "./breadcrumbs.component.html",
  styleUrls: ["./breadcrumbs.component.scss"]
})
export class BreadcrumbsComponent implements OnInit, DoCheck {
  AllRetrunRoutes: string[];
  SetRouterLink: string;
  selectedIndex: any;
  currentroutes: any;
  Activated: boolean;
  @Input() Allroutes: any[];
  constructor(private languageSerService: LanguageSerService, 
    private router: Router, private Router: ActivatedRoute, private configService : ConfigService) {}
  ngDoCheck(): void {
    this.Router.data.subscribe((data) => {
      this.languageSerService.setcurrentsetRoute(data);
    });
    this.languageSerService.setRoute.subscribe((rout) => (this.Allroutes = rout));
    this.AllRetrunRoutes = Object.values(this.Allroutes);

    this.currentroutes = this.router.url.split("/").slice(1);
    if (this.currentroutes.length == 1) {
      this.currentroutes = this.router.url.split("/").slice(1);
    } else if (this.currentroutes.length == 2) {
      this.currentroutes = this.router.url.split("/").slice(2);
    } else if (this.currentroutes.length == 3) {
      this.currentroutes = this.router.url.split("/").slice(3);
    }
  }

  ngOnInit(): void {}
  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }
  clickedRoute(index) {
    this.selectedIndex = index;
    this.AllRetrunRoutes = Object.values(this.Allroutes);
    if (index == 0) {
      this.router.navigate(["/" + this.AllRetrunRoutes[0]]);
    } else if (index == 1) {
      this.router.navigate(["/" + this.AllRetrunRoutes[0] + "/" + this.AllRetrunRoutes[1]]);
    } else if (index == 3) {
      this.router.navigate(["/" + this.AllRetrunRoutes[0] + "/" + this.AllRetrunRoutes[1]]);
    } else if (index == 2) {
      this.router.navigate(["/" + this.AllRetrunRoutes[0] + "/" + this.AllRetrunRoutes[2]]);
    }
  }
  get helpPath(){
    return `${this.trimTrailingSlash(this.configService.helpPath)}/${this.currentroutes} `;
  }
  trimTrailingSlash(url: string): string {
    if(!url) return '';
    return url.replace(/\/+$/, '');
  }
}
