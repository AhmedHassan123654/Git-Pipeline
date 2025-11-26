import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedServiceService } from "src/app/core/Services/Shared/shared-service.service";
import { EndOfDayService } from "src/app/core/Services/Transactions/end-of-day.service";
import * as localForage from "localforage";
import { Location } from "@angular/common";
declare let Stimulsoft: any;

@Component({
  selector: "app-view-reports",
  templateUrl: "./view-reports.component.html",
  styleUrls: ["./view-reports.component.scss"]
})
export class ViewReportsComponent implements OnInit {
  [key: string]: any;

  // data:any;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  constructor(
    public router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private sharedService: SharedServiceService,
    private EndOfDayService: EndOfDayService
  ) {
    // this.data=JSON.parse(localStorage.getItem('Report'))
    /*   this.sharedService.GetReport.subscribe((Report) => {
      this.data=Report;
  }); */
    //  this.data= this.router.getCurrentNavigation().extras as any;
  }

  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.PreviewReport();
    /*  if(this.objdata != undefined)
     {
      this.EndOfDayService.PrintFirst(this.objdata).subscribe((data: Response) => {
          this.result = data;
          this.Reportdata = data;
          this.viewer.renderHtml(this.report.loadDocument(this.Reportdata));
          this.viewer.report = this.report;

        });
     } */
  }
  backClicked() {
    this.location.back();
  }
  /* ngOnChanges(): void {
    let x =this.Reportdata;

    } */

  PreviewReport() {
    localForage.getItem("Reportdata").then((Reportdata: Response) => {
      this.report.loadDocument(Reportdata);
      this.viewer.report = this.report;
      this.viewer.renderHtml("viewer");
    });

    // var html = this.ReportDiv.nativeElement;
    // window.open(html, '_blank');
  }
}

/*   this._service.print(this.model).subscribe((data: Response) => {


      this.result = data;
      localStorage.setItem('Report', JSON.stringify(this.result));
   //   this.sharedService.GetReport.next(this.result);
 //     this.router.navigateByUrl('/viewReport');
   //  const link = this.router.navigateByUrl('/viewReport');
   // let param=this._service;
    const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
      window.open(link, '_blank');
      this.ifPerview=false;
      $('#modal-1').modal('hide');
      return false;
    }); */
