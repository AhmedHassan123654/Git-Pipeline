import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../product-groupimports";
@Component({
  selector: "app-productgroup",
  templateUrl: "./product-group.component.html",
  styleUrls: ["./product-group.component.scss"]
})
export class ProductGroupComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  responseobj = new imp.ProductGroupModel();
  showUploader: boolean = true;
  //#endregion
  constructor(
    public productgroupservice: imp.ProductGroupService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: imp.Router,
    private toastr: imp.ToastrService
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    document.getElementById("uplade_Img").classList.add("d-none");
    document.getElementById("upladDone").classList.remove("d-none");
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.preAddUpdate({});
    });
  }
  //#region product group Methods
  initializeobjects(): void {
    /*   this.responseobj={}; */
    this.service = this.productgroupservice;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.showUploader = false;
        this.responseobj.PicturePath = null;
        break;
      case imp.quickAction.beforeAdd:
        this.beforeAdd();
        break;
      case imp.quickAction.beforeUpdate:
        this.beforeAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.showUploader = false;
        break;
      case imp.quickAction.afterAdd:
        this.saveImage();
        break;
      case imp.quickAction.afterUpdate:
        this.saveImage();
        this.showUploader = true;
        break;
      case imp.quickAction.afterDelete:
        this.responseobj.PicturePath = null;
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
  uploadImage(event: any) {

    if (event.target.files) {
      var reader = new FileReader();
      this.myfile = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.responseobj.PicturePath = event.target.result;
      };
    }
  }
  removeImage() {
    this.responseobj.PicturePath = null;
  }

  uploadFile() {
    let fileToUpload = <File>this.myfile[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);

    this.productgroupservice.UploadImages(formData, this.formGroupId).subscribe((res: any) => {
      if (res == true) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
      }
    });
  }
  beforeAdd() {
    if (
      this.responseobj != undefined &&
      (this.responseobj.PrintInCashierPrinter == null || this.responseobj.PrintInCashierPrinter == undefined)
    ) {
      this.responseobj.PrintInCashierPrinter = false;
    }
    if (
      this.responseobj != undefined &&
      (this.responseobj.IsStopped == null || this.responseobj.IsStopped == undefined)
    ) {
      this.responseobj.IsStopped = false;
    }
    this.lastRecord = this.responseobj;
  }
  saveImage() {
    this.productgroupservice.getGrideList().subscribe((res: any) => {
      this.GrideList = [];
      this.GrideList = res as any;

      this.GrideList.List.forEach((item) => {
        if (item.Name == this.lastRecord.Name) {
          this.Obj = item;
        }
      });
      let fileToUpload = <File>this.myfile[0];
      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);

      this.productgroupservice.UploadImages(formData, this.Obj.DocumentId).subscribe((res: any) => {
        if (res == true) {
          this.productgroupservice.getById(this.Obj.DocumentId).subscribe((data: any) => {
            this.responseobj = data;
            this.preAddUpdate({});
            this.showUploader = true;
          });
          return true;
        }
      });
    });
  }
}
