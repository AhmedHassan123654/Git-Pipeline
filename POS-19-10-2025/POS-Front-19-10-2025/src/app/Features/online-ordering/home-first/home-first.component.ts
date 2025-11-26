import { FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-home-first",
  templateUrl: "./home-first.component.html",
  styleUrls: ["./home-first.component.scss"]
})
export class HomeFirstComponent implements OnInit {
  [key: string]: any;
  complate = true;
  constructor(public router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.TableDocumentId = params.TableDocumentId;
    });
  }

  ngOnInit(): void {}
  routTo(route: string) {
    this.router.navigateByUrl("/" + route + "?TableDocumentId=" + this.TableDocumentId);
  }
}
