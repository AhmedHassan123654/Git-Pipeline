import { Component, OnInit, ViewChild } from "@angular/core";
import { general } from "src/app/core/Helper/general";
import { NoteModel } from "src/app/core/Models/Transactions/note-model";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { ComboService } from "src/app/core/Services/Transactions/combo.service";
import { quickAction, Router, ToastrService } from "../../customer/customerimport";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";
import { TranslateService } from "@ngx-translate/core";
import { VolumeService } from "../../volume/volume-imports";
import { sumByKey } from "src/app/core/Helper/objectHelper";

export interface Task {
  name: string;
  completed: boolean;
  color: string;
  subtasks?: Task[];
}

declare let $: any;

@Component({
  selector: "app-compo-details",
  templateUrl: "./compo-details.component.html",
  styleUrls: ["./compo-details.component.scss"]
})
export class CompoDetailsComponent extends general implements OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;

  //#region f

  allComplete: boolean = false;
  public increment(product) {
    product.Quantity = Number(product.Quantity) + 1;
  }

  public decrement(product) {
    if (Number(product.Quantity) > 1) product.Quantity = Number(product.Quantity) - 1;
  }
  public keyPress(event: any) {
    if (event.target.value.length == 0 && event.which == 48) {
      event.preventDefault();
      return false;
    }
    var verified = String.fromCharCode(event.which).match(/[^0-9]/g);
    if (verified) {
      event.preventDefault();
      return false;
    }

    return true;
  }
  updateAllComplete(product) {
    // check if product exist in another level
    let ComboDetails = this.deepCopy(this.responseobj.ComboDetails.filter((x) => x.Type == 1));
    if (ComboDetails && ComboDetails.length) {
      ComboDetails.splice(this.index, 1);
      let productIds = ComboDetails.map((g) => g.ComboDetailDetails)
        .reduce(function (a, b) {
          return a.concat(b);
        }, [])
        .map((x) => x.DetailDocumntId);
      if (productIds.includes(product.DetailDocumntId))
        this.toastr.warning(
          "(" + product.DetailName + " ) " + this.translate.instant("messages.IsUsedForAnotherLevel")
        );
    }

    this.responseobj.ComboDetails[this.index].ComboDetailDetails.every((t) => t.completed);
  }
  //#endregion
  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: Router,
    private ComboService: ComboService,
    private volumeService: VolumeService,
    public orderSer: OrderService,
    public toastr: ToastrService
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.comboFirstOpen();
      this.getVolumes();
      this.responseobj.screenPermission.Print = false;
      this.enableChiled = false;
    });
  }
  getVolumes() {
    this.volumeService.getGrideList().subscribe((res:any) => {
      this.volumes = res?.List;
    });
  }
  comboFirstOpen() {
    this.ComboService.comboFirstOpen().subscribe((res) => {
      this.compoTypes = res["CompoTypes"];
      this.combos = res["Combos"];
      // this.sideDishs = res["SideDishs"];
      this.originalSideDishs = this.deepCopy(res["Combos"].filter(x => x.IsSubItem));
      this.sideDishs = this.deepCopy(this.originalSideDishs);
      this.notes = res["Notes"];
      this.filterNotes = this.deepCopy(this.notes);
    });
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.ComboService;
    this.request = this.router.getCurrentNavigation().extras as unknown;

    this.FLGDocument = { text: "Name", value: "DocumentId" };
    this.FLG = { text: "Name", value: "Id" };
    this.FLGVolume = { text: "VolumeName", value: "VolumeDocumentId" };

    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        this.enableChiled = true;
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        this.enableChiled = false;
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case quickAction.afterUpdate:
        this.enableChiled = false;
        break;
      case quickAction.afterUndo:
        this.enableChiled = false;
        break;
      case quickAction.beforeAdd:
        this.checkRequiredFeildsBeforeSave();
        break;
      case quickAction.beforeUpdate:
        this.checkRequiredFeildsBeforeSave();
        break;
    }
  }
  checkRequiredFeildsBeforeSave() {
      // Mark all form controls as touched to show validation messages
      Object.keys(this.frmRef.controls).forEach(key => {
        const control = this.frmRef.controls[key];
        control.markAsTouched();
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      
      if(!this.frmRef.form.invalid) {

        if(this.responseobj.MandatoryLoadingOfSideDishes){
          this.responseobj.ComboDetails?.forEach(x=>{
            const  qty =  sumByKey(x.ComboDetailDetails , 'Quantity');
            if(qty > x.Quantity){
              this.toastr.info("(" + x.Name + " ) " + this.translate.instant("products.NumberOfSideDishesAllowed") + " : " + x.Quantity);
              this.frmRef.form.setErrors({ 'invalid': true });
            }
          })
        }
        
        // let subItem = this.responseobj.ComboDetails?.flatMap(x => x.ComboDetailDetails).find(x => x.ProductVolumes?.length && !x.VolumeDocumentId);
        // if(subItem) {
        //   this.toastr.info(this.translate.instant("messages.MainProductVolumeIsRquired"));
        //   this.frmRef.form.setErrors({ 'invalid': true });
        // }
      }
      
    }
  addComboDetail() {
    if (!this.responseobj.ComboDetails) this.responseobj.ComboDetails = [];
    this.responseobj.ComboDetails.push({});
  }
  deleteComboDetail(index) {
    if (!this.responseobj.ComboDetails) this.responseobj.ComboDetails = [];
    this.responseobj.ComboDetails.splice(index, 1);
  }
  openNoteModel(index) {
    this.index = index;
    if (
      this.responseobj.ComboDetails[this.index].ComboDetailDetails &&
      this.responseobj.ComboDetails[this.index].ComboDetailDetails.length
    ) {
      this.responseobj.ComboDetails[this.index].ComboDetailDetails.forEach((d) => {
        let note = this.filterNotes.filter((n) => n.DocumentId == d.DetailDocumntId)[0];
        if (note) note.NoteChecked = true;
      });
    }
    $("#modal-Notes").modal("show");
  }
  prepareSideList(){
    const sidesWithVolumes = this.originalSideDishs.filter((s) => s.ProductVolumes?.length);
    const sidesWithVolumesIds = sidesWithVolumes.map((s) => s.DocumentId);
    this.sideDishs = this.originalSideDishs.filter((s) => !sidesWithVolumesIds.includes(s.DocumentId));
    let sidesSeparateVolumes = [];
    sidesWithVolumes.forEach((s) => {
      s.ProductVolumes.forEach((pv) => {
        const volume = this.volumes?.find(v => (pv.VolumeId && v.Id == pv.VolumeId) || (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId));
        if (volume) {
          let newSide = {...s};
          newSide.Name = s.Name + "/" + volume.Name;
          newSide.VolumeName = volume.Name;
          newSide.VolumeDocumentId = volume.DocumentId;
          newSide.VolumeId = volume.Id;
          sidesSeparateVolumes.push(newSide);
        }
      });
    });
    this.sideDishs = [...this.sideDishs, ...sidesSeparateVolumes];
  }
  openSideDishesModel(index) {
    this.prepareSideList();
    this.index = index;
    if (!this.responseobj.ComboDetails[this.index].ComboDetailDetails)
      this.responseobj.ComboDetails[this.index].ComboDetailDetails = [];
    this.sideDishs.forEach((s) => {
      let comboDetailDetail = this.responseobj.ComboDetails[this.index].ComboDetailDetails.find((x) => x.DetailDocumntId == s.DocumentId &&
         ((s.VolumeId && x.VolumeId == s.VolumeId) || (s.VolumeDocumentId && x.VolumeDocumentId == s.VolumeDocumentId)));
      if (!comboDetailDetail)
      {
        comboDetailDetail = {
          DetailName: s.Name,
          DetailDocumntId: s.DocumentId,
          Quantity: 1,
          VolumeName: s.VolumeName,
          VolumeDocumentId: s.VolumeDocumentId,
          VolumeId: s.VolumeId,
          // ProductVolumes: s.ProductVolumes
        }
        this.responseobj.ComboDetails[this.index].ComboDetailDetails.push(comboDetailDetail);
      }
      // comboDetailDetail.ProductVolumes = s.ProductVolumes;
      // comboDetailDetail.ProductVolumes.forEach(pv =>  {
      //   const volume = this.volumes?.find(v => (pv.VolumeId && v.Id == pv.VolumeId) || (pv.VolumeDocumentId && v.DocumentId == pv.VolumeDocumentId));
      //   if (volume) {
      //     pv.VolumeName = volume.Name;
      //     pv.VolumeDocumentId = volume.DocumentId;
      //     pv.VolumeId = volume.Id;
      //   }
      // });
      // this.setProductVolume(comboDetailDetail);
    });
    $("#modal-1").modal("show");
  }
  closeSideDishesModel() {
    if (!this.responseobj.ComboDetails[this.index].ComboDetailDetails)
      this.responseobj.ComboDetails[this.index].ComboDetailDetails = [];
    this.responseobj.ComboDetails[this.index].ComboDetailDetails = this.responseobj.ComboDetails[
      this.index
    ].ComboDetailDetails.filter((x) => x.Checked == true);
    $("#modal-1").modal("hide");
  }

  //#region Notes
  addNewNote(noteName: string) {
    if (!noteName) this.shownoteerror = true;
    else {
      this.shownoteerror = false;
      if (this.notes && this.notes.length)
        this.checknoteexist = this.notes.filter((n) => n.Name == noteName)[0] ? true : false;
      if (this.checknoteexist == true) this.toastr.error("Note already exist");
      else {
        let noteobj = new NoteModel();
        noteobj.Name = noteName;
        this.orderSer.PostNote(noteobj).subscribe((res) => {
          if (res == 1) {
            this.toastr.success("Saved successfully");
            this.getAllNotes(this.responseobj.ComboDetails[this.index], true);
            //this.getAllNotes(null,true);
          } else {
            this.toastr.error("Failed to complete the process");
          }
        });
      }
    }
  }
  notesChecked(event: any, note: any) {
    if (event) {
      if (note.NoteChecked) note.NoteChecked = false;
      else note.NoteChecked = true;
    }
    this.ComboDetailDetails = {};
    if (!this.responseobj.ComboDetails[this.index].ComboDetailDetails)
      this.responseobj.ComboDetails[this.index].ComboDetailDetails = [];
    if (note.NoteChecked) {
      this.ComboDetailDetails.DetailDocumntId = note.DocumentId;
      this.ComboDetailDetails.DetailName = note.Name;
      note.NoteChecked = true;
      this.responseobj.ComboDetails[this.index].ComboDetailDetails.push(this.ComboDetailDetails);
    } else {
      let index = this.responseobj.ComboDetails[this.index].ComboDetailDetails.findIndex(
        (p) => p.DetailName === note.Name
      );
      this.responseobj.ComboDetails[this.index].ComboDetailDetails.splice(index, 1);
    }
  }
  getAllNotes(ComboDetails: any, isFromAdd = false) {
    this.orderSer.GetAllNotes().subscribe((res) => {
      this.notes = res as NoteModel[];
      this.filterNotes = this.deepCopy(this.notes);
      if (
        this.filterNotes &&
        this.filterNotes.length &&
        ComboDetails.ComboDetailDetails &&
        ComboDetails.ComboDetailDetails.length != 0
      ) {
        this.filterNotes.forEach((element) => {
          let checknoteexist = ComboDetails.ComboDetailDetails.find((p) => p.NoteId == element.Id);
          if (checknoteexist) element.NoteChecked = true;
        });
      }
      if (isFromAdd) {
        let note = this.filterNotes.find((n) => n.Name.toLowerCase() == this.noteName.toLowerCase());
        note.NoteChecked = true;
        if (note) this.notesChecked("", note);
      }
    });
  }
  deleteDetailDetail(detailDetail: any, index: any) {
    if (!this.responseobj.ComboDetails[this.index].ComboDetailDetails)
      this.responseobj.ComboDetails[this.index].ComboDetailDetails = [];
    let note = this.filterNotes.filter((element) => element.Name == detailDetail.DetailName)[0];
    if (note) note.NoteChecked = false;
    this.responseobj.ComboDetails[this.index].ComboDetailDetails.splice(index, 1);
  }
  findNotes() {
    if (this.noteName)
      this.filterNotes = this.deepCopy(
        this.notes.filter((x) => x.Name.toLocaleLowerCase().indexOf(this.noteName.toLocaleLowerCase()) !== -1)
      );
    else this.filterNotes = this.deepCopy(this.notes);
  }
  //#endregion
  setComboName() {
    if (this.combos && this.combos.length) {
      let combo = this.combos.filter((x) => x.DocumentId == this.responseobj.ProductDocumentId)[0];
      if (combo) this.responseobj.ProductName = combo.Name;
    }
  }
  setDetailType(i) {
    if (
      this.responseobj.ComboDetails &&
      this.responseobj.ComboDetails.length > 1 &&
      this.responseobj.ComboDetails[i].Type == 2
    ) {
      let existIndex = this.responseobj.ComboDetails.findIndex((d) => d.Type == this.responseobj.ComboDetails[i].Type);
      if (existIndex != -1 && existIndex != i) {
        this.responseobj.ComboDetails[i].Type = undefined;
        this.toastr.warning("You can not select the same type twice!");
      }
    }
  }
  setAll(completed: boolean) {
    if (this.responseobj.ComboDetails[this.index].ComboDetailDetails) {
      if (this.searchSides)
        this.responseobj.ComboDetails[this.index].ComboDetailDetails.filter((x) =>
          x.DetailName.toLowerCase().includes(this.searchSides.toLowerCase())
        ).forEach((t) => {
          t.Checked = completed;
        });
      else
        this.responseobj.ComboDetails[this.index].ComboDetailDetails.forEach((t) => {
          t.Checked = completed;
        });
    }
  }
  searchInSides(search) {
    if (search)
      return this.responseobj.ComboDetails[this.index]?.ComboDetailDetails?.filter((x) =>
        x.DetailName.toLowerCase().includes(search.toLowerCase())
      );
    else return this.responseobj.ComboDetails[this.index]?.ComboDetailDetails;
  }
  // setProductVolume(product:any){
  //   let productVolume = product.ProductVolumes.find((x) => x.VolumeDocumentId == product.VolumeDocumentId);
  //   product.VolumeId = productVolume?.VolumeId;
  //   product.VolumeDocumentId = productVolume?.VolumeDocumentId;
  //   product.VolumeName = productVolume?.VolumeName;
  // }
}
