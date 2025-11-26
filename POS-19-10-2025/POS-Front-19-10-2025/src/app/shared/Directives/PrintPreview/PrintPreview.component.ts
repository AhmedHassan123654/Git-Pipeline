import { Component, OnInit, Input } from "@angular/core";
import { ReportInputs } from "src/app/core/Models/Shared/ReportInputs";
import { HttpClient } from "@angular/common/http";
declare var Stimulsoft;
@Component({
  selector: "app-PrintPreview",
  templateUrl: "./PrintPreview.component.html",
  styleUrls: ["./PrintPreview.component.css"]
})
export class PrintPreviewComponent implements OnInit {
  reportParams: any;
  ReportDate: Date = new Date();
  url: string;
  @Input() isPreview: boolean;
  @Input() reportName: string;
  @Input() reportInputs: ReportInputs[];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.url = "http://localhost:56740/api/StiViewer/{action}";
    this.reportInputs = [];
    this.reportInputs.push({
      IsDate: true,
      Value: this.ReportDate,
      Key: "date"
    });
    var indexedArray = {
      Key: "date",
      Value: this.ReportDate,
      IsDate: true
    };
    this.reportParams = {
      ReportName: this.reportName,
      Inputs: this.reportInputs,
      IsPreview: this.isPreview
    };
    // this.printPerview();
  }
  // back(){
  //   return this.http.get(this.common.rooturl+'/StiViewer/PrintReport');
  // }
  // printPerview(){
  //   var report = new Stimulsoft.Report.StiReport();
  //   this.http.get<any>("http://localhost:56740/api/StiViewer/PrintReport").subscribe(res => {
  //     console.log(res);
  //       report.load(JSON.parse(res));
  //     });

  //     var options = new Stimulsoft.Viewer.StiViewerOptions();

  //     options.width = "1000px";

  //     options.height = "1000px";

  //     options.appearance.scrollbarsMode = true;

  //     options.appearance.backgroundColor = Stimulsoft.System.Drawing.Color.dodgerBlue;

  //     options.appearance.showTooltips = false;

  //     options.toolbar.showPrintButton = false;

  //     options.toolbar.showDesignButton = false;

  //     options.toolbar.showAboutButton = false;

  //     options.exports.showExportToPdf = true;

  //     options.exports.ShowExportToWord2007 = true;

  //     var viewer = new Stimulsoft.Viewer.StiViewer(options);

  //     viewer.report = report;
  // }
}
