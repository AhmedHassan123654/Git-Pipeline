import { Observable } from "rxjs";
import { Subscriber } from "rxjs";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
declare var Stimulsoft: any;
declare let $: any;

@Component({
  selector: "app-print-cashir",
  templateUrl: "./print-cashir.component.html",
  styleUrls: ["./print-cashir.component.scss"]
})
export class PrintCashirComponent implements OnInit {
  [key: string]: any;
  printDetailobj: PrintDetailModel = new PrintDetailModel();

  reprtresult: Response;
  @Output() printCashirPerviewEvent = new EventEmitter();
  @Input("reportData") reportData;
  @Input("service") _service;
  @Input("formobj") _responseobj;
  constructor() {}

  ngOnInit(): void {
    this.printDetailobj.DestinationId = 1;
    this.printDetailobj.LanguageId = 2;
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
  }
  print() {
    // Step 1: event emit
    this.printCashirPerviewEvent.emit(this.printCashirPerview);
    //  .subscribe(()=>{
    //   // debugger
    //   this.printCashirPerview();
    //  });
  }
  printPriview() {
    this.model = [];
    this.printDetailobj.LanguageId = 1;
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(this._responseobj.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(this._responseobj.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(this._responseobj.DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(this._responseobj.DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId && this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }

    this._service.print(this.model).subscribe((data: Response) => {
      //  this.reportData= data;
      //  printCashirPerview(data);
      let options: any = new Stimulsoft.Viewer.StiViewerOptions();
      let viewer: any = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
      let report = new Stimulsoft.Report.StiReport();
      report.loadDocument(data);
      viewer.report = report;
      viewer.renderHtml("priviewViewer");
      $("#modal-2").modal("show");
    });
  }
  printCashirPerview(data: any) {
    let options: any = new Stimulsoft.Viewer.StiViewerOptions();
    let viewer: any = new Stimulsoft.Viewer.StiViewer(options, "StiViewer", false);
    let report = new Stimulsoft.Report.StiReport();
    report.loadDocument(data);
    viewer.report = report;
    viewer.renderHtml("viewer");
    $("#modal-2").modal("show");
    //  let order=this.getReportTranslationObj(this.reportData);
    //  var report = new Stimulsoft.Report.StiReport();
    //   this.reprtresult=data;//this.reportData;
    //   this.report.loadDocument(data);
    //   // Render report
    //   this.report.renderAsync();
    //      // Create an HTML settings instance. You can change export settings.
    // var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
    //    // Create an HTML service instance.
    //    var service = new Stimulsoft.Report.Export.StiHtmlExportService();
    //       // Create a text writer objects.
    // var textWriter = new Stimulsoft.System.IO.TextWriter();
    // var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
    //    // Export HTML using text writer.
    //    service.exportTo(this.report, htmlTextWriter, settings);
    //   //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
    //     var frame1 = document.createElement('iframe');
    //     frame1.name = "frame1";
    //     frame1.style.position = "absolute";
    //     frame1.style.top = "-1000000px";
    //     document.body.appendChild(frame1);
    //     var frameDoc = (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document
    //     frameDoc.open();
    //     frameDoc.write('</head><body>');
    //     frameDoc.write(textWriter.getStringBuilder().toString());
    //     frameDoc.write('</body></html>');
    //     frameDoc.close();
    //     setTimeout(function () {
    //      window.frames["frame1"].focus();
    //      window.frames["frame1"].print();
    //      document.body.removeChild(frame1);
    //  }, 500);
    //  return false;
  }
  getReportTranslationObj(data: any) {
    throw new Error("Method not implemented.");
  }
}
