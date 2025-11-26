import { Component, DoCheck, OnInit, ViewChild } from "@angular/core";
import {
  PageSettingsModel,
  EditSettingsModel,
  FilterSettingsModel,
  ToolbarItems,
  CommandModel,
  GridComponent,
  SaveEventArgs
} from "@syncfusion/ej2-angular-grids";
import { BiometricService } from "src/app/core/Services/Biometric/Biometric";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-biometric",
  templateUrl: "./biometric.component.html",
  styleUrls: ["./biometric.component.css"]
})
export class BiometricComponent implements OnInit {
  [key: string]: any;
  BiometricConfigList: any = [];
  LogDataList: any = [];
  employees: any = [];
  pageSettings: PageSettingsModel;
  editOptions: EditSettingsModel;
  filterOptions: FilterSettingsModel;
  toolbarOptions: ToolbarItems[];
  commands: CommandModel[];
  pageSettings2: PageSettingsModel;
  editOptions2: EditSettingsModel;
  filterOptions2: FilterSettingsModel;
  toolbarOptions2: ToolbarItems[];
  commands2: CommandModel[];
  BioConfig: any = {};
  Connected: boolean = false;
  ConfigDocument: any;
  @ViewChild("grid") grid: GridComponent;
  @ViewChild("grid") grid2: GridComponent;
  public DateFormat: any = { type: "date", format: "dd/MM/yyyy" };
  public TimeFormat: any = { type: "date", format: "HH:mm:ss" };
  constructor(
    public Biometricser: BiometricService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    private toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.GetAllConfigs();
    this.GetAllEmployess();
    this.initializeGrid();
    this.initializeGrid2();
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
    };
    this.filterOptions = {
      type: "Menu"
    };
    this.commands = [
      {
        type: "Edit",
        buttonOption: { cssClass: "e-flat", iconCss: "e-edit e-icons" }
      },
      {
        type: "Delete",
        buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" }
      },
      {
        type: "Save",
        buttonOption: { cssClass: "e-flat", iconCss: "e-update e-icons" }
      },
      {
        type: "Cancel",
        buttonOption: { cssClass: "e-flat", iconCss: "e-cancel-icon e-icons" }
      }
    ];
  }
  initializeGrid2() {
    this.pageSettings2 = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions2 = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions2 = {
      showDeleteConfirmDialog: false,
      allowEditing: false,
      allowDeleting: false
    };
    this.filterOptions2 = {
      type: "Menu"
    };
    this.commands2 = [];
  }

  actionBegin(args: SaveEventArgs) {
    if (args.requestType === "beginEdit") {
    }
    if (args.requestType === "save") {
      let data = args.data as any;
      this.BioConfig = data;
      if (data.DocumentId) this.UpdateBioConfig();
      else this.InsertBioConfig();
    }
    if (args.requestType === "delete") {
      let data = args.data[0] as any;
      this.DeleteBioConfig(data.DocumentId);
    }
  }

  GetAllEmployess() {
    this.Biometricser.GetAllEmployess().subscribe((res) => {
      this.employees = res;
      this.employees = this.employees.filter((x) => x.NumberFingerprint > 0);
    });
  }
  GetAllConfigs() {
    this.Biometricser.GetBioConfigs().subscribe((res) => {
      this.BiometricConfigList = res;
      this.grid.refresh();
    });
  }
  UpdateBioConfig() {
    this.Biometricser.UpdateBioConfig(this.BioConfig).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.info(this.toastrMessage.GlobalMessages(res), "biometrics");
        } else {
          this.toastr.info(this.toastrMessage.GlobalMessages(res), "biometrics");
        }
        this.GetAllConfigs();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  InsertBioConfig() {
    this.Biometricser.InsertBioConfig(this.BioConfig).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res), "biometrics");
        } else {
          this.toastr.success(this.toastrMessage.GlobalMessages(res), "biometrics");
        }
        this.GetAllConfigs();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  DeleteBioConfig(Id: string) {
    this.Biometricser.DeleteBioConfig(Id).subscribe(
      (res) => {
        if (res == 3) {
          this.toastr.warning(this.toastrMessage.GlobalMessages(res), "biometrics");
          this.GetAllConfigs();
        } else {
          this.toastr.warning(this.toastrMessage.GlobalMessages(res), "biometrics");
        }
        this.GetAllConfigs();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  AddNewBioConfig() {
    this.BiometricConfigList.push({ Name: "", Ip: "" });
    this.grid.refresh();
  }
  PingBiometricDevice() {
    let BioConfigModel = {
      IP: this.ConfigDocument.Ip,
      PORT: this.ConfigDocument.Port,
      MNumber: this.ConfigDocument.MachineNo
    };
    this.Biometricser.PingBiometricDevice(BioConfigModel).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(8), "biometrics");
        } else {
          this.toastr.success(this.toastrMessage.GlobalMessages(8), "biometrics");
        }
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  ConnectDevice() {
    let BioConfigModel = {
      IP: this.ConfigDocument.Ip,
      PORT: this.ConfigDocument.Port,
      MNumber: this.ConfigDocument.MachineNo
    };
    this.Biometricser.ConnectBiometricDevice(BioConfigModel).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(9), "biometrics");
          this.Connected = true;
        } else {
          this.toastr.success(this.toastrMessage.GlobalMessages(10), "biometrics");
          this.Connected = false;
        }
      },
      (err) => {
        this.Connected = false;
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  GetData() {
    let BioConfigModel = {
      IP: this.ConfigDocument.Ip,
      PORT: this.ConfigDocument.Port,
      MNumber: this.ConfigDocument.MachineNo
    };
    this.Biometricser.GetBiometricLogData(BioConfigModel).subscribe(
      (res) => {
        this.LogDataList = res;
        this.LogDataList.forEach((x) => {
          let employee = this.employees.filter((e) => e.NumberFingerprint == x.IndRegID)[0];
          if (employee) {
            x.EmployeeId = employee.Id;
            x.Employee = employee;
          }
        });
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
  SaveBiometricLogData() {
    this.Biometricser.SaveBiometricLogData(this.LogDataList).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res), "biometrics");
        } else {
          this.toastr.success(this.toastrMessage.GlobalMessages(1), "biometrics");
        }
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "biometrics");
      }
    );
  }
}
