import { Injectable } from "@angular/core";
import { quickAction } from "src/app/core/Enums/quick";
import {
  afterNewParams,
  fillFormParams,
  formPagingParams,
  beforeAddParams,
  preAddUpdateParams
} from "../Models/Shared/function-named-paramaters";
import { res } from "../Models/Shared/res";
import { Subject } from "rxjs-compat/Subject";
import { MouseEventArgs } from "@syncfusion/ej2-base";

@Injectable({
  providedIn: "root"
})
export class general {
  //#region Declartions
  [key: string]: any;
  frmRef: any;
  dateOnlyFormat = "yyyy-MM-dd";
  //#endregion
  /**
   *
   */

  constructor() {}
  //#region General Methods
  scrFirstOpen(): any {
    const subject = new Subject();
    if (this.request.currentAction == "View") {

      this.service.getById(this.request.DocumentId).subscribe((res) => {
        // this.responseobj = {}
        this.responseobj = res as res;
        this.responseobj.screenPermission = this.request.screenPermission;
        this.gridAfterEdit();
        for (const name in this.frmRef.controls) {
          this.frmRef.controls[name].disable();
        }
        subject.next();
      });
    } else if (this.request.currentAction == "Add") {
      this.service.firstOpen().subscribe((res) => {
        this.responseobj = res as res;
        this.frmRef.resetForm();
        this.gridAfterEdit();
        subject.next();
      });
    } else if (this.request.currentAction == "Edit") {
      this.service.getById(this.request.DocumentId).subscribe((res) => {
        this.responseobj = res as res;
        this.gridAfterEdit();
        subject.next();
      });
    } else {
      this.service.firstOpen().subscribe(
        (res) => {
          this.responseobj = res as res;

          this.fillCombo({ formObj: this.responseobj });
          subject.next();
        },
        (err) => {}
      );
    }

    return subject;
  }
  langSet() {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  formPaging({ formObj }: formPagingParams): void {
    this.actionFromParnt = quickAction.query;
    this.responseobj = formObj;
    this.fillCombo({ formObj: formObj });
  }

  afterNew({ dateFields }: afterNewParams): any {
    const subject = new Subject();
    this.actionFromParnt = quickAction.afterNew;
    this.responseobj = {};
    this.isRequired = true;
    this.dateFields = dateFields;
    this.dateFields?.forEach((element) => {
      this.responseobj[element] = new Date();
    });
    this.preAddUpdate({ subject: subject });
    return subject;
  }

  afterModify(): any {
    this.currentAction = quickAction.afterModify;
    this.actionFromParnt = quickAction.afterModify;
    const subject = new Subject();
    this.preAddUpdate({ subject: subject });
    return subject;
  }
  afterAdd(): any {
    const subject = new Subject();
    //this.request=undefined;
    this.scrFirstOpen().subscribe(() => {
      // this.firstOpenSubject();
    });

    return subject;
  }

  afterUndo(): void {
    this.actionFromParnt = quickAction.afterUndo;
  }
  gridAfterEdit(): any {
    const subject = new Subject();
    this.preAddUpdate({ subject: subject });
    for (const name in this.frmRef.controls) {
      this.frmRef.controls[name].enable();
    }
    return subject;
  }

  preAddUpdate({ subject }: preAddUpdateParams): any {
    this.service.preAddUpdate().subscribe((res) => {
      this.responsedata = res as res;
      this.fillCombo({ formObj: this.responsedata });
      subject?.next();
    });
  }

  fillCombo({ formObj }: fillFormParams): void {
    Object.keys(formObj).forEach((key) => {
      if (key.length > 4) {
        const chkList = key.slice(key.length - 4);
        if (chkList == "List") {
          this[key] = [];
          this[key] = formObj[key];
          const orgName = key.slice(0, key.length - 4);
          this[orgName + "Flds"] = {
            text: "FlagName",
            value: "FlagValue"
          };
        }
      }
    });
  }
  //#endregion
  ///////// functions from GenericHelper //////////////////////////////////
  gridLoad(args: any, gridno: any) {
    gridno.element.addEventListener("mousedown", (e: MouseEventArgs) => {
      if ((e.target as HTMLElement).classList.contains("e-rowcell")) {
        if (gridno.isEdit) gridno.endEdit();
        let index: number = parseInt((e.target as HTMLElement).getAttribute("Index"));
        gridno.selectRow(index);
        gridno.startEdit();
      }
    });
  }
  // SetLang(SETlang){
  //   this.LanguageSerService.LangSetN.next(SETlang);
  // }
  // getLang(){
  //   return this.LanguageSerService.currentLang.subscribe();
  // }
  gridCheckBoxBind(args: any, gridno: any, indexer: string, field: string) {
    let currentRowObject: any = gridno.getRowObjectFromUID(args.event.target.closest("tr").getAttribute("data-uid"));
    let currentRowData: Object = currentRowObject.data;

    let rowIndex: any = args.event.target.closest("td").getAttribute("index");
    gridno.setCellValue(currentRowData[indexer], field, args.checked);
  }
  clone(obj) {
    return Object.assign({}, obj);
  }
  cloneList(list: any[]) {
    return Object.assign([], list);
  }
  deepCopy(obj: any): any {
    if (obj === null || typeof obj !== "object") {
      return obj; // Return primitives or null directly
    }
  
    // Handle Date
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
  
    // Handle Array and Object using JSON methods for faster deep copy
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (error) {
      console.error("Deep copy failed for object:", obj, error);
      throw new Error("Unable to deep copy object!");
    }
  }
  clearAllIntervals() {
    const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
  }
  distinct(array: any[], key: string) {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  }
  filterList(list: any[], searchVal: string) {
    let resultList: any = [];
    if (list && list.length > 0) {
      if (searchVal && searchVal != "") {
        let keys = Object.keys(list[0]);
        keys.forEach((k) => {
          let ob = list[0][k];
          if (typeof ob != "object") {
            let t = list.filter((o) => o[k] && o[k].toString().includes(searchVal));
            t.forEach((element) => {
              if (resultList.indexOf(element) === -1) resultList.push(element);
            });
            // resultList.push.apply(resultList ,t);
          }
        });
        return resultList;
      } else return this.cloneList(list);
    }
    return resultList;
  }

  // list: any[] ===> the main array that we need to search inside of it
  //  key: string ===> property to search with the name and see if it includes the search term from the searchVal
  // searchVal: string ===> the search term that we're looking for inside the list array
  filterListByKey(list: any[], key: string, searchVal: string) {
    let resultList: any = [];
    if (list && list.length > 0) {
      if (searchVal && searchVal != "") {
        let ob = list[0][key];
        if (typeof ob != "object") {
          let t = list.filter(
            (o) => o[key] && o[key].toString().toLowerCase().includes(searchVal.toString().toLowerCase())
          );
          t.forEach((element) => {
            if (resultList.indexOf(element) === -1) resultList.push(element);
          });
          // resultList.push.apply(resultList ,t);
        }
        return resultList;
      } else return this.cloneList(list);
    }
    return resultList;
  }
  checkRequiredValid(frmRef: any, fieldName: any) {
    if (frmRef && fieldName && ((frmRef.submitted && fieldName.invalid) || (fieldName.invalid && fieldName.touched))) {
      if (fieldName.errors?.required) return true;
    }
    return false;
  }
}
