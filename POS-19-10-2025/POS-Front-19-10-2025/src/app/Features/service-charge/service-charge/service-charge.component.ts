import { Component, OnInit, ViewChild } from "@angular/core";
import * as imp from "../servicechargeimports";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-service-charge",
  templateUrl: "./service-charge.component.html",
  styleUrls: ["./service-charge.component.scss"]
})
export class ServiceChargeComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  constructor(
    public taxSer: imp.ServiceChargeService,
    public translate: TranslateService,
    private languageSerService: LanguageSerService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.FLG = { text: "Name", value: "DocumentId" };
    this.scrFirstOpen().subscribe(() => {
      this.taxFirstOpen();
      this.responseobj.screenPermission.Print = false;
    });
  }
  taxFirstOpen() {
    this.taxSer.taxFirstOpen().subscribe((res) => {
      this.taxes = res["Taxes"];
      this.branches = res["Branches"];
      this.setTaxConfiguration();
    });
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.taxSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.setTaxConfiguration();
  }
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        for (const name in this.frmRef.controls) {
          // if(name == "ValueType")
          //   this.frmRef.controls[name].setValue(1);
          // else
          if (name == "Type") this.frmRef.controls[name].setValue(2);
        }
        this.setTaxConfiguration();
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.taxFirstOpen();
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case imp.quickAction.afterUpdate:
        this.taxFirstOpen();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.setTaxConfiguration();
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
    }
  }
  setTaxConfiguration() {
    if (!this.responseobj.ValueType) this.responseobj.ValueType = 1;
    this.responseobj.Type = 2;
    this.ShowVatTaxDetails();
    this.ShowTaxBranches();
  }
  ShowVatTaxDetails() {
    this.sourcTaxes = this.taxes.filter((x) => x.DocumentId != this.responseobj.DocumentId);

    // show if tax has another vat tax comming from ferp
    if(this.responseobj.HasVATTax && !this.responseobj.VATTaxDocumentId){
      const tax = this.taxes.find(x=>x.Id == this.responseobj.VATTaxId );
      this.responseobj.VATTaxDocumentId = tax.DocumentId;
      this.SetHasVatTax();
    }

    // show if tax has included vat taxs
    this.responseobj.TaxDetails = [];
    if (!this.responseobj.IncludedVATTaxes) this.responseobj.IncludedVATTaxes = [];

    if (this.responseobj.IncludedVATTaxes && this.responseobj.IncludedVATTaxes.length > 0)
      this.responseobj.TaxDetails = this.responseobj.IncludedVATTaxes.map((x) => x.DocumentId);

    this.SetVatTaxDetails();
  }

  SetHasVatTax(){
    const tax = this.taxes.find(x=>x.DocumentId == this.responseobj.VATTaxDocumentId );
    this.responseobj.HasVATTax = tax ?  true : false;
    this.responseobj.VATTaxId = tax?.Id;
    this.responseobj.VATTax = tax;
  }

  SetVatTaxDetails() {
    this.responseobj.IncludedVATTaxes = [];
    if (!this.responseobj.DocumentId && !this.responseobj.Name) this.responseobj.TaxDetails = [];
    // if (this.responseobj.IncludeOtherTaxes) this.responseobj.Value = 0;
    if (this.responseobj.TaxDetails && this.responseobj.TaxDetails.length > 0) {
      // this.responseobj.Value = 0;
      this.responseobj.TaxDetails.forEach((DocumentId) => {
        let tax = this.taxes.find((o) => o.DocumentId == DocumentId);
        if (tax) {
          let vattaxDetail = this.clone(tax);
          vattaxDetail.IncludedVATTaxes = [];
          this.responseobj.IncludedVATTaxes.push(vattaxDetail);
          // this.responseobj.Value += Number(vattaxDetail.Value);
        }
      });
      if (this.responseobj.IncludedVATTaxes && this.responseobj.IncludedVATTaxes.length > 0)
        this.responseobj.IncludeOtherTaxes = true;
      else this.responseobj.IncludeOtherTaxes = false;
    } else this.responseobj.IncludeOtherTaxes = false;
  }
  ShowTaxBranches() {
    this.responseobj.TaxBranchesIds = [];
    if (!this.responseobj.TaxBranches) this.responseobj.TaxBranches = [];

    if (this.responseobj.TaxBranches && this.responseobj.TaxBranches.length > 0)
      this.responseobj.TaxBranchesIds = this.responseobj.TaxBranches.map((x) => x.BranchDocumentId);

    this.SetTaxBranches();
  }
  SetTaxBranches() {
    this.responseobj.TaxBranches = [];
    if (this.responseobj.TaxBranchesIds && this.responseobj.TaxBranchesIds.length > 0) {
      this.responseobj.TaxBranchesIds.forEach((DocumentId) => {
        let branch = this.branches.find((o) => o.DocumentId == DocumentId);
        if (branch) {
          let b = this.clone(branch);
          let taxBranch = {
            BranchId: branch.Id,
            BranchDocumentId: branch.DocumentId,
            TaxId: this.responseobj.Id,
            TaxDocumentId: this.responseobj.DocumentId
          };
          this.responseobj.TaxBranches.push(taxBranch);
        }
      });
    }
  }
}
