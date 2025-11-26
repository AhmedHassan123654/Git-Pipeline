import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { quickAction } from "src/app/core/Enums/quick";
import { general } from "src/app/core/Helper/general";
import { EmployeeService } from "src/app/core/Services/Transactions/employee.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { BranchModel, BranchService } from "../../branch/branchimport";
import { BehaviorSubject } from "rxjs";
// import * as imp from "../emp-imports";

@Component({
  selector: "app-employees",
  templateUrl: "./employees.component.html",
  styleUrls: ["./employees.component.scss"]
})
export class EmployeesComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  Flds = { text: "Name", value: "Id" };
  BranchFlds = { text: "Name", value: "DocumentId" };
  ViewInActive: boolean = false;
  showdInActiveReason: boolean = true;
  showUploader: boolean = true;
  disabledFlag: BehaviorSubject<boolean> = new BehaviorSubject(false);
  branches: BranchModel = new BranchModel();
  //#endregion

  constructor(
    public EmployeeSer: EmployeeService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public router: Router,
    public toastr: ToastrService,
    private _BranchService: BranchService
  ) {
    super();
    this.initializeobjects();
    this._BranchService.getGrideList().subscribe({
      next: (res: any) => {
        this.branches = res.List;
      }
    });
  }

  ngOnInit() {
    document.getElementById("uplade_Img")?.classList.add("d-none");
    document.getElementById("upladDone")?.classList.remove("d-none");
    this.UserTypesList();
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      if (this.responseobj.InActive == true) {
        this.ViewInActive = true;
      } else {
        this.ViewInActive = false;
      }
    });
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.EmployeeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({}).subscribe(() => {
          // let x = this.responsedata;
          this.ViewInActive = false;
          this.showUploader = false;
          this.disabledFlag.next(true);
        });
        break;
      case quickAction.afterUpdate:
        this.saveImage();
        this.showUploader = true;
        this.disabledFlag.next(false);
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        this.saveImage();
        this.disabledFlag.next(false);
        break;
      case quickAction.afterModify:
        this.afterModify();
        this.showUploader = false;
        this.disabledFlag.next(true);
        break;
      case quickAction.afterDelete:
        this.responseobj.PictureName = null;
        this.disabledFlag.next(false);
        break;
      case quickAction.beforeAdd:
        this.beforeAdd();
        this.disabledFlag.next(false);
        break;
      case quickAction.beforeUpdate:
        this.beforeAdd();
        this.disabledFlag.next(false);
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.responseobj = event;
    if (this.responseobj.InActive == true) {
      this.ViewInActive = true;
    } else {
      this.ViewInActive = false;
    }
  }
  // UserTypesList() {
  //   this.EmployeeSer.UserTypesList().subscribe((res :any) => {
      
  //     // Assuming res is an object { userType1: 'Type 1', userType2: 'Type 2', ... }
  //     this.UserTypesLists = res.map(key => {
  //       return {
  //         name: this.translate.instant(key.Name), // or name: res[key] if the value itself should be displayed
  //         value: res[key.Id] // or value: key if the key itself is the value
  //       };
  //     });
  //   });
  // }
  UserTypesList() {
    this.EmployeeSer.UserTypesList().subscribe((res:any) => {
      this.UserTypesLists = res.map((userType: any) => {
        return {
          ...userType,
          translatedName: this.translate.instant(userType.Name),
        };
      });
    });
  }
  //#endregion
  //#endregio
  uploadImage(event: any) {
    if (event.target.files) {
      var reader = new FileReader();
      this.myfile = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.responseobj.PictureName = event.target.result;
      };
    }
  }
  uploadFile() {

    let fileToUpload = <File>this.myfile[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);

    /*  this.EmployeeSer.UploadImages(formData,this.formGroupId).subscribe(
    (res: any) => {
     if(res == true){
      this.toastr.success(
        this.toastrMessage.GlobalMessages(res)
      )
     }

   },
 ); */
  }
  beforeAdd() {
    if (
      this.responseobj != undefined &&
      (this.responseobj.InActive == null || this.responseobj.InActive == undefined)
    ) {
      this.responseobj.InActive = false;
    }
    if (
      this.responseobj != undefined &&
      (this.responseobj.ShouldHaveMeal == null || this.responseobj.ShouldHaveMeal == undefined)
    ) {
      this.responseobj.ShouldHaveMeal = false;
    }
    this.lastRecord = this.responseobj;
  }
  saveImage() {
    this.EmployeeSer.getGrideList().subscribe((res: any) => {
      this.GrideList = [];
      this.GrideList = res as any;

      this.GrideList.List.forEach((item) => {
        let name = this.lastRecord.FirstName + " " + this.lastRecord.LastName;
        if (item.Name == name) {
          this.Obj = item;
        }
      });
      let fileToUpload = <File>this.myfile[0];
      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);

      this.EmployeeSer.UploadImages(formData, this.Obj.DocumentId).subscribe((res: any) => {
        if (res == true) {
          this.EmployeeSer.getById(this.Obj.DocumentId).subscribe((data: any) => {
            this.responseobj = data;
            this.showUploader = true;
          });
          return true;
        }
      });
    });
  }
  removeImage() {
    this.responseobj.PictureName = null;
  }
  ViewInActiveReason(e) {
    this.ViewInActive = e.target.checked;
    if (this.ViewInActive == true) {
      this.responseobj.InActiveDate = new Date();
      this.showdInActiveReason = false;
    } else {
      this.responseobj.InActiveDate = null;
    }
  }

  selectedBranch: BranchModel = new BranchModel();

  selectBranch(branch: BranchModel) {
    console.log("Selected Branch : ", branch);
  }
}
