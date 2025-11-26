import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { general, HandlingBackMessages, LanguageSerService, quickAction } from '../../point-of-sale/pointofsaleimports';
import { CustomerMessageService } from 'src/app/core/Services/Transactions/customer-message.service';
import Swal from "sweetalert2";

@Component({
  selector: 'app-customer-message',
  templateUrl: './customer-message.component.html',
  styleUrls: ['./customer-message.component.scss']
})
export class CustomerMessageComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  // responseobj = new CustomerMessage();
   Fld = { text: "Name", value: "DocumentId" };

  //#endregion
  constructor(
    public customerMessageService: CustomerMessageService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: Router,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.responseobj.screenPermission.Edit = false;
      this.responseobj.screenPermission.Update = false;
      this.responseobj.screenPermission.Delete = false;
      this.responseobj.screenPermission.Save = false;
      this.responseobj.screenPermission.Undo = true;
      this.preAddUpdate({});
    });
  }
  //#region product group Methods
  initializeobjects(): void {
    this.responseobj={};
    this.service = this.customerMessageService;
    this.showEdit = false;
    this.showDelete = false;
    this.showView = false;
    this.showPrint = false;
    this.disableFlag = true;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.disableFlag = false;
        this.newButtonFlagStatus(true);
        break;
      case quickAction.beforeAdd:
        break;
      case quickAction.beforeUpdate:
        this.beforeAdd();
        break;
      case quickAction.afterModify:
        this.afterModify();
        break;
      case quickAction.afterAdd:
        break;
      case quickAction.afterUpdate:
        break;
      case quickAction.afterDelete:
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
 

  GetCustomersCount(){
    this.customerMessageService.GetCustomersCount(this.responseobj).subscribe((res:any)=>{
      if(res == 0){
        this.toastr.warning(this.translate.instant("messages.noCustomerLinkedToThisGroup"));
      }
      if(res){
        Swal.fire({
          title: this.translate.instant("Shared.attention"),
          text: `${this.translate.instant("messages.sendToCustomerCountMessage")} : ${res}`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: this.translate.instant("Shared.Ok"),
          cancelButtonText:this.translate.instant("Shared.Cancel"),
        }).then((result) => {
          if (result.isConfirmed) {
            this.sendMessage();
          }
        });
      }
    },(err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err));
      } 
    );
   
  }

  sendMessage(){
    this.customerMessageService.Transactions(this.responseobj,"Post").subscribe((res:any)=>{
      if(res ){
        this.disableFlag = true;
        this.newButtonFlagStatus(false);
      }
      else
        this.toastr.error(this.translate.instant("setting.FaildConnect"));
    },(err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err));
      } 
    );
  }

  private newButtonFlagStatus(disable:boolean = false) {
    let element: any = document.getElementById('addNewButton');
    if (element) element.disabled = disable;
  }
}
