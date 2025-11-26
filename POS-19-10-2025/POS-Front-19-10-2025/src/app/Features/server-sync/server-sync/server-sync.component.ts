import { DatePipe, Time } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FileInfo, UploaderComponent } from "@syncfusion/ej2-angular-inputs";
import { AnimationModel } from "@syncfusion/ej2-angular-progressbar";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { DatabaseDetailModel } from "src/app/core/Models/Authentication/database-detail-model";
import { ServerSyncService } from "src/app/core/Services/Authentication/server-sync.service";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import Swal from "sweetalert2";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { updateTypePredicateNodeWithModifier } from "typescript";
//import { LoadingBarService } from 'ngx-loading-bar';

@Component({
  selector: "app-server-sync",
  templateUrl: "./server-sync.component.html",
  styleUrls: ["./server-sync.component.css"]
})
export class ServerSyncComponent implements OnInit {
  // databaseDetailobj:DatabaseDetailModel=new DatabaseDetailModel();
  ShowSucceeded: boolean;
  timerInterval: boolean;
  ShowFailed: boolean;
  animation: AnimationModel;
  showProgressValue: boolean;
  showProgressPull = false;
  showProgressPullProducts = false;
  showProgressPush = false;
  time: Time;
  DeleteCountOrder: number = 0;
  DeleteCountReturnOrder: number = 0;
  [key: string]: any;
  pullFromServerAction: boolean = false
  pushToServerAction: boolean = false;
  pullProductsFromServerAction: boolean = false
  pullItemsFromServerAction: boolean = false
  pullCustomersFromServerAction: boolean = false
  pullSettingsAction: boolean = false
  databaseDetailobj: any = {};
  public TimeFlds = { text: "Name", value: "Name" };
  public Flds = { text: "Name", value: "Id" };
  imagesTypes = [
    "tiff",
    "pjp",
    "jfif",
    "gif",
    "svg",
    "bmp",
    "png",
    "jpeg",
    "svgz",
    "jpg",
    "webp",
    "ico",
    "xbm",
    "dib",
    "tif",
    "pjpeg",
    "avif"
  ];
  //height=4;
  //color="#4092F1";
  //runInterval=200;
  public path: Object = {
    saveUrl: this.serverSync.UploadImages(),
    removeUrl: this.serverSync.RemoveImages(),
    chunkSize: 102400
  };
  @ViewChild("defaultupload") uploadObj: UploaderComponent;
  constructor(
    private serverSync: ServerSyncService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    public datepipe: DatePipe,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.responseobj = {};
  }

  ngOnInit() {
    this.databaseDetailobj.AuthenticationType = "1";
    this.databaseDetailobj.IsWithImages = false;
    this.serverfirstOpen();
    this.GetCountsNotSync();

  }
  serverfirstOpen() {
    this.serverSync.Get().subscribe((res) => {
      if (res != null) {
        this.serverSync.GetSettings().subscribe((data) => {
          if (data != null) {
            this.settings = data;
            this.databaseDetailobj.FinancialSystem = this.settings.FinancialSystem;
          }
        });

        this.databaseDetailobj = res as any;

        this.TimeList = [];
        this.databaseDetailobj.Times.forEach((item) => {
          let timeObject: any = {};
          timeObject.Name = item;
          this.TimeList.push(timeObject);
        });
        if (this.databaseDetailobj.Pull == 4) this.showPullMintes = true;
        if (this.databaseDetailobj.Push == 4) this.showMintes = true;
        this.databaseDetailobj.AuthenticationType = this.databaseDetailobj.AuthenticationType?.toString();
      }
    });
  }
  GetCountsNotSync() {
    this.serverSync.GetCountsNotSync().subscribe((res) => {
      if (res != null) {
        this.responseobj = res as any;
      }
    });
  }

  onFileSelect(args: any) {
    let index = [];
    let existingFiles: FileInfo[] = this.uploadObj.getFilesData();
    for (let i: number = 0; i < args.filesData.length; i++) {
      if (this.imagesTypes.indexOf(args.filesData[i].type) == -1) {
        index.push(i);
      } else {
        for (let j: number = 0; j < existingFiles.length; j++) {
          if (!isNullOrUndefined(args.filesData[i])) {
            if (existingFiles[j].name == args.filesData[i].name) {
              index.push(i);
            }
          }
        }
      }
    }
    for (let i = index.length - 1; i >= 0; i--) {
      args.filesData.splice(index[i], 1);
    }
    existingFiles = existingFiles.concat(args.filesData);
    args.modifiedFilesData = existingFiles;
    args.isModified = true;
  }

  downloadImages() {
    this.serverSync.DownloadImages().subscribe((res: boolean) => {
      if (res == true) {
        this.toastr.success("Pull And Download Images Succeed", "ServerSync");
      } else {
        this.toastr.error("Pull Succeed But Failed In Download Images", "ServerSync");
      }
    });
  }

  testConnection() {
    this.clearShowing();

    this.serverSync.TestConnection(this.databaseDetailobj).subscribe((res: boolean) => {
      this.ShowSucceeded = res;
      if (res == false) this.ShowFailed = true;
    });
  }
  CheckValidation(Form) {
    // for (const key of Object.keys(Form.controls)) {
    //   if (Form.controls[key].invalid) {
    //     const invalidControl = Form.controls[key];
    //     let eleName = invalidControl.constructor.name;
    //     const invalidControl2 = document.querySelector('[formcontrolname="' + key + '"]');
    //     this.toastr.info(eleName+" IsInValid","ServerSync");
    //     return true;
    //  }
    // }
    let invalidElement = Form.form.controls.filter((x) => x.status.toLowerCase() == "invalid")[0];
    if (invalidElement) {
      let eleName = invalidElement.constructor.name;
      this.toastr.info(eleName + " IsInValid", "ServerSync");
      return true;
    }
    return false;
  }
  submitData(frmServerSync, event) {
    if (!frmServerSync.form.valid) {
      // this.toastr.info("Field IsInValid","ServerSync");
      return false;
    }
    let v = frmServerSync.form.valid;
    let v2 = frmServerSync.form.controls;
    let v3 = frmServerSync.controls;
    this.clearShowing();
    if (event.submitter.name == "save") {
      this.serverSync.SaveConnectionString(this.databaseDetailobj).subscribe((res) => {
        if (res == 1) this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
        else if (res == 2) this.toastr.info(this.toastrMessage.GlobalMessages(res), "ServerSync");
      });
    }
  }

  pullAll = () => {
    this.pullItemsFromServerAction=false
    this.pullProductsFromServerAction= false
    this.pullFromServerAction= false;
    this.pullCustomersFromServerAction= false;
    this.pushToServerAction = false;
    this.pullSettingsAction = true    
    this.pullItemsFromServer();
    this.pullProductsFromServer();
    this.pullFromServer();
    // this.pullCustomersFromServer();
  };

  pullItemsFromServer() {
    this.clearShowing();
    this.showProgressPullItems = true;
    this.progressBarLoading(50000);
    this.serverSync.PullItemsFromServer(this.databaseDetailobj).subscribe((res) => {
      if (res == true) {
        this.progressBarEnd();
        this.pullItemsFromServerAction=true
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        this.showProgressPullItems = false;
        this.pullItemsFromServerAction=false;
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "ServerSync");
      }
    });
  }
  pullProductsFromServer() {
    this.clearShowing();
    this.showProgressPullProducts = true;
    this.progressBarLoading(50000);
    this.serverSync.PullProductsFromServer(this.databaseDetailobj).subscribe((res) => {
      if (res == true) {
        this.progressBarEnd();
        this.pullProductsFromServerAction= true
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        this.pullProductsFromServerAction= false
        this.showProgressPullProducts = false;
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "ServerSync");
      }
    });
  }
  pullFromServer() {
    this.clearShowing();
    this.showProgressPull = true;
    this.progressBarLoading(60000);
    //this.loadingBarService.start();
    this.serverSync.PullFromServer(this.databaseDetailobj).subscribe((res: boolean) => {
      // this.loadingBarService.complete();
      if (res == true) {
        this.progressBarEnd();
        // if(this.databaseDetailobj.IsWithImages == true){
        //   this.downloadImages();
        // }
        // else
        this.pullFromServerAction= true
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        this.showProgressPull = false;
        this.pullFromServerAction= false
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "Disable to ServerSync");
      }
    });
  }
  pullCustomersFromServer() {
    this.pullItemsFromServerAction=false
    this.pullProductsFromServerAction= false
    this.pullFromServerAction= false
    this.pullSettingsAction = false
    this.pushToServerAction = false;

    this.clearShowing();
    this.showProgressPullCustomers = true;
    this.progressBarLoading(100000);
    this.serverSync.PullCustomersFromServer(this.databaseDetailobj).subscribe((res) => {
      if (res == true) {
        this.progressBarEnd();
        this.pullCustomersFromServerAction= true
        this.showProgressPullCustomers = false;
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        this.pullCustomersFromServerAction= false
        this.showProgressPullCustomers = false;
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "ServerSync");
      }
    });
  }

  pushFromServer() {
    this.pullItemsFromServerAction=false
    this.pullProductsFromServerAction= false
    this.pullFromServerAction= false
    this.pullSettingsAction = false
    this.clearShowing();
    this.showProgressPush = true;
    this.progressBarLoading(500000);
    //this.loadingBarService.start();
    this.serverSync.PushToServer(this.databaseDetailobj).subscribe((res: boolean) => {
      //this.loadingBarService.complete();
      if (res == true) {
        this.GetCountsNotSync();
        this.progressBarEnd();
        this.showProgressPush = false;
        this.pushToServerAction = true
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        this.pushToServerAction = false;
        this.showProgressPull = false;
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "ServerSync");
      }
    });
  }
  backup() {
    this.serverSync.backup().subscribe((res) => {
      if (res == true) {
        // this.progressBarEnd();
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "ServerSync");
      } else {
        // this.showProgressPullProducts=false;
        this.toastr.error(this.toastrMessage.GlobalMessages(res), "ServerSync");
      }
    });
  }
  clearUserData() {
    this.databaseDetailobj.UserName = undefined;
    this.databaseDetailobj.Password = undefined;
  }

  clearShowing() {
    this.showProgressPull =
      this.showProgressPullProducts =
      this.showProgressPullCustomers =
      this.showProgressPullItems =
      this.showProgressPush =
      this.showProgressValue =
        false;
    this.ShowSucceeded = this.ShowFailed = false;
  }

  progressBarLoading(duration: number) {
    this.showProgressValue = true;
   
    this.animation = { enable: true, duration: duration, delay: 0 };
  }

  progressBarEnd() {
    this.animation = { enable: false };
  }
  setpushvalue(data) {
    if (data == 4) {
      this.showMintes = true;
    } else {
      this.showMintes = false;
      this.databaseDetailobj.PushMintes = 0;
    }
  }
  setPullvalue(data) {
    if (data == 4) {
      this.showPullMintes = true;
    } else {
      this.showPullMintes = false;
    }
  }

  DeleteOrdersAfterSync() {
    // check settings is ture 
    if (this.settings.ShowButtonDeleteOrdersAfterSync) {
      this.serverSync.DeleteOrdersAfterSync().subscribe({
        next: (res: any) => {
          // debugger
          // check you have data CountOrder or CountReturnOrder 
          if(res.DeletedCountOrder > 0 || res.DeletedCountReturnOrder > 0){
            this.DeleteCountOrder = res.DeletedCountOrder;
            this.DeleteCountReturnOrder = res.DeletedCountReturnOrder;
            this.toastr.success("success");
          }
          // check don't have data CountOrder or CountReturnOrder 
          if(res.DeletedCountOrder === 0 && res.DeletedCountReturnOrder === 0){
            this.toastr.info("No Data to Delete");
          }
        }
      });
    }
  }
  hideProgressBar: boolean = true;
  cancelProgressBar(){
    this.showProgressPull= false;
    this.showProgressPullProducts = false
    this.showProgressPullCustomers = false
    this.showProgressPullItems = false
  }
}
