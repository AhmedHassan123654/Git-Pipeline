import { Component, OnInit, ViewChild } from "@angular/core";
import { ChangeLanguageService } from "src/app/core/Services/change-language.service";
import { GridComponent, ToolbarItems, ExcelExportProperties } from "@syncfusion/ej2-angular-grids";
import { ClickEventArgs, HandlingBackMessages, ToastrService } from "src/app/shared/Imports/featureimports";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { HttpClient } from "@angular/common/http";
import { BranchService } from "../../branch/branchimport";
@Component({
  selector: "app-change-language",
  templateUrl: "./change-language.component.html",
  styleUrls: ["./change-language.component.scss"]
})
export class ChangeLanguageComponent implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "French " },
    { Id: 4, Name: "Turkish" }
  ];
  public fields = { text: "Name", value: "Id" };
  public Object: PrintDetailModel = new PrintDetailModel();
  public namefile: string = "Uploaded File";
  //#endregion fileUploaded.name

  constructor(
    public service: ChangeLanguageService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private branchService: BranchService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit(): void {
    this.Object.LanguageId = 1;
    this.getdata();
    this.initializeGrid();
    this.responseobj = {};
    this.fullresponseobj = {};
  }
  /*   this.service.deleteArJSON().subscribe(
    res=>{

      }); */

  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["ExcelExport"];
    this.filterOptions = {
      type: "Menu"
    };
  }

  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.excelexportList = [];
      this.gridList.forEach((item) => {
        let key = item.description.toString() + "." + item.key.toString();
        let value = item.value;
        let excelexport = {};
        excelexport = { key, value };
        this.excelexportList.push(excelexport);
      });
      const excelExportProperties: ExcelExportProperties = {
        dataSource: this.excelexportList
      };
      this.grid.excelExport(excelExportProperties);
    }
  }

  getdata() {
    if (this.Object.LanguageId == 1) {
      this.service.getEnJSON().subscribe((res) => {
        this.gridList = [];
        this.data = res as any;
        if (this.data == null || this.data == undefined) {
          return false;
        }
        let keys = Object.keys(this.data);
        keys.forEach((description) => {
          let keys2 = Object.keys(this.data[description]);
          keys2.forEach((key) => {
            let value = this.data[description][key];
            let dataobj = {};
            dataobj = { description, key, value };
            this.gridList.push(dataobj);
          });
        });
      });
    }
    if (this.Object.LanguageId == 2) {
      this.service.getArJSON().subscribe((res) => {
        this.gridList = [];
        this.data = res as any;
        if (this.data == null || this.data == undefined) {
          return false;
        }
        let keys = Object.keys(this.data);
        keys.forEach((description) => {
          let keys2 = Object.keys(this.data[description]);
          keys2.forEach((key) => {
            let value = this.data[description][key];
            let dataobj = {};
            dataobj = { description, key, value };
            this.gridList.push(dataobj);
          });
        });
      });
    }
    if (this.Object.LanguageId == 3) {
      this.service.getFrJSON().subscribe((res) => {
        this.gridList = [];
        this.data = res as any;
        if (this.data == null || this.data == undefined) {
          return false;
        }
        let keys = Object.keys(this.data);
        keys.forEach((description) => {
          let keys2 = Object.keys(this.data[description]);
          keys2.forEach((key) => {
            let value = this.data[description][key];
            let dataobj = {};
            dataobj = { description, key, value };
            this.gridList.push(dataobj);
          });
        });
      });
    }
    if (this.Object.LanguageId == 4) {
      this.service.getTuJSON().subscribe((res) => {
        this.gridList = [];
        this.data = res as any;
        if (this.data == null || this.data == undefined) {
          return false;
        }
        let keys = Object.keys(this.data);
        keys.forEach((description) => {
          let keys2 = Object.keys(this.data[description]);
          keys2.forEach((key) => {
            let value = this.data[description][key];
            let dataobj = {};
            dataobj = { description, key, value };
            this.gridList.push(dataobj);
          });
        });
      });
    }
  }
  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.namefile = this.fileUploaded.name;
    this.readExcel();
  }
  readExcel() {
    let readFile = new FileReader();
    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
    };
    readFile.readAsArrayBuffer(this.fileUploaded);
  }
  /*     readAsJson() {
        this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
        this.jsonData = JSON.stringify(this.jsonData);
        const data: Blob = new Blob([this.jsonData], { type: "application/json" });
        FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + '.json');
      } */
  /*   readAsCSV() {
        this.csvData = XLSX.utils.sheet_to_csv(this.worksheet);
        const data: Blob = new Blob([this.csvData], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(data, "CSVFile" + new Date().getTime() + '.csv');
      } */
  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
    if (!this.jsonData || !this.jsonData.length) {
      this.toastr.warning("Please select file to import !");
      return;
    }
    this.gridList = [];
    this.jsonData.forEach((item) => {
      let ArrayString = item.key.split(".");
      let description = ArrayString[0];
      let key = ArrayString[1];
      let value = item.value;
      let dataobj = {};
      dataobj = { description, key, value };
      this.gridList.push(dataobj);
    });
    this.grid.refresh();
    this.AddData();
  }
  /*    readAsHTML() {
        this.htmlData = XLSX.utils.sheet_to_html(this.worksheet);
        const data: Blob = new Blob([this.htmlData], { type: "text/html;charset=utf-8;" });
        FileSaver.saveAs(data, "HtmlFile" + new Date().getTime() + '.html');
      } */
  /*  readAsText() {
        this.textData = XLSX.utils.sheet_to_txt(this.worksheet);
        const data: Blob = new Blob([this.textData], { type: 'text/plain;charset=utf-8;' });
        FileSaver.saveAs(data, "TextFile" + new Date().getTime() + '.txt');
      } */

  AddData() {
    this.fullresponseobj = {};
    let result = this.groupBy(this.gridList, "description");
    result.forEach((item) => {
      this.description = "";
      this.responseobj = {};
      item.forEach((item2) => {
        this.description = item2.description.toString();
        let key = item2.key.toString();
        this.responseobj[key] = item2.value;
      });
      this.fullresponseobj[this.description] = this.responseobj;
    });
    this.jsonData = JSON.stringify(this.fullresponseobj);
    const data: Blob = new Blob([this.jsonData], { type: "application/json" });
    if (this.Object.LanguageId == 2) this.changeTranslationFile("ar", this.jsonData);
    // FileSaver.saveAs(data, "ar"+ '.json');
    if (this.Object.LanguageId == 1) this.changeTranslationFile("en", this.jsonData);
    // FileSaver.saveAs(data, "en"+ '.json');
    if (this.Object.LanguageId == 3) this.changeTranslationFile("fr", this.jsonData);
    // FileSaver.saveAs(data, "fr"+ '.json');
    if (this.Object.LanguageId == 4) this.changeTranslationFile("tu", this.jsonData);
    // FileSaver.saveAs(data, "tu"+ '.json');
  }
  changeTranslationFile(lang: string, data) {
    let model = {
      Lang: lang,
      Data: data
    };
    this.branchService.ChangeTranslationType(model).subscribe((res) => {
      if (res) this.toastr.success(this.toastrMessage.GlobalMessages(1));
      else this.toastr.error(this.toastrMessage.GlobalMessages(""));
    });
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = item[keyGetter];
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  btnClicked(): void {
    this.excelexportList = [];
    this.gridList.forEach((item) => {
      let key = item.description.toString() + "." + item.key.toString();
      let value = item.value;
      let excelexport = {};
      excelexport = { key, value };
      this.excelexportList.push(excelexport);
    });
    const excelExportProperties: ExcelExportProperties = {
      dataSource: this.excelexportList
    };
    this.grid.excelExport(excelExportProperties);
    // this.grid.excelExport();
  }
}
