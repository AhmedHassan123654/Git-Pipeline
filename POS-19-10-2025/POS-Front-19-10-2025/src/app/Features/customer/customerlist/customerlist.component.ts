import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../customerimport";
import * as XLSX from "xlsx";
@Component({
  selector: "app-customerlist",
  templateUrl: "./customerlist.component.html",
  styleUrls: ["./customerlist.component.css"]
})
export class CustomerlistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid") grid: imp.GridComponent;
  @ViewChild("excelGrid") excelGrid: imp.GridComponent;
  //#endregion

  constructor(
    public customerSer: imp.CustomerService,
    public toster: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    public Rout: imp.Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super(toster, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#region Angular Life Cycle
  ngOnInit() {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew)
        this.toolbarList.push({
          text: "",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      // if (this.showPrint)
      //   this.toolbarList.push({
      //     text: "",
      //     tooltipText: "Print",
      //     prefixIcon: "e-print",
      //     id: "Print"
      //   });
      this.toolbarList.push('ExcelExport');
      this.toolbarOptions = this.toolbarList;
      setTimeout(() => {
        this.DisabledGridButton();
      }, 300);
    });
    this.initializeGrid();
  }

  //#endregion
  //#region Customer Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.customerSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/customer";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion

  //#region excel
  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    // this.namefile = this.fileUploaded?.name;
    this.readExcel();
  }
  readExcel() {
    this.requestStarted = true;
    const readFile = new FileReader();
    try {
      readFile.onload = (e) => {
        this.storeData = readFile.result;
        var data = new Uint8Array(this.storeData);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        this.worksheet = workbook.Sheets[first_sheet_name];
        this.requestStarted = false;
      };
      readFile.readAsArrayBuffer(this.fileUploaded);
    } catch (error) {
      this.requestStarted = false;

    }


  }

  readAsJson() {
    this.requestStarted = true;
    try {


      this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
      
      if(this.jsonData?.length){
        this.gridList = this.distinct(this.jsonData , 'Phone') ;
        let totalCount = this.gridList?.length;
        if(totalCount < this.jsonData.length)
          this.toastr.warning((this.jsonData.length - totalCount) + ' ' + this.translate.instant("messages.duplicatedRemoved"));

        this.gridList = this.gridList.filter(x=> x.Name && x.Phone);
        if(this.gridList?.length < totalCount)
          this.toastr.warning((totalCount - this.gridList.length) + ' ' + this.translate.instant("messages.NotValidRemoved"));
      } 

      this.excelGrid.refresh();
      this.requestStarted = false;

    } catch (error) {
      this.requestStarted = false;
    }
  }

  saveCustomers(){
    this.requestStarted = true;

    this.customerSer.insertCustomersFromExcel(this.gridList).subscribe(res=>{
      this.toastr.success(this.toastrMessage.GlobalMessages(res));
      this.requestStarted = false;
    },err=>{
      this.requestStarted = false;
    });
  }

  distinct(array: any[], key: string) {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  }
  //#endregion
}
