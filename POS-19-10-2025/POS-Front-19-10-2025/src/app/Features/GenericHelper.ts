import { OnInit, Directive } from "@angular/core";
import { MouseEventArgs } from "@syncfusion/ej2-base";

@Directive()
export class GenericHelper implements OnInit {
  //constructor() {}
  NameAndForeignName: string;
  priceLang = JSON.parse(localStorage.getItem('langs')) == 'fr'? 'fr-FR' : 'en-US'
  ngOnInit() {}
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
  oldDeepCopy(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.deepCopy(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopy(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }
  clearAllIntervals() {
    const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
  }
  filterList(list: any[], searchVal: string) {
    let resultList: any = [];
    if (list && list.length > 0) {
      if (searchVal && searchVal != "") {
        let keys = Object.keys(list[0]);
        keys.forEach((k) => {
          let ob = list[0][k];
          if (typeof ob != "object") {
            let t = list.filter(
              (o) => o[k] && o[k].toString().toLowerCase().includes(searchVal.toString().toLowerCase())
            );
            t.forEach((element) => {
              if (resultList.indexOf(element) === -1) resultList.push(element);
            });
            // resultList.push.apply(resultList ,t);
          }
        });
        return resultList;
      } else return this.deepCopy(list);
    }
    return resultList;
  }
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
      } else return this.deepCopy(list);
    }
    return resultList;
  }
  filterListByKeys(list: any[], keys: string[], searchVal: string) {
    let resultList: any = [];
    if (list && list.length > 0) {
      if (searchVal && searchVal != "") {
        keys.forEach((k) => {
          let ob = list[0][k];
          if (typeof ob != "object") {
            let t = list.filter(
              (o) => o[k] && o[k].toString().toLowerCase().includes(searchVal.toString().toLowerCase())
            );
            t.forEach((element) => {
              if (resultList.indexOf(element) === -1) resultList.push(element);
            });
            // resultList.push.apply(resultList ,t);
          }
        });
        return resultList;
      } else return this.deepCopy(list);
    }
    return resultList;
  }
  distinct(array: any[], key: string) {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  }
  // getNamePlusForeignName(ob) {
  //   if (this.defaultLanguage && this.settingobj && this.currentUserLanguage) {
  //     if(this.settingobj.ShowBothNameAndForeignName && ob.ForeignName && ob.ForeignName != ''){
  //         return ob.Name +' , '+ ob.ForeignName ;
  //     }
  //     if (this.settingobj.NamesOfProductsBasedOnMainUserLang) {
  //       if (!this.currentUserLanguage.includes(this.defaultLanguage) && ob.ForeignName && ob.ForeignName != "")
  //         return ob.ForeignName;
  //       else return ob.Name;
  //     }
  //     return ob.Name;
  //   }
  //   return ob.Name;
  // }
  getDecodedToken(token: string): any {
    return JSON.parse(atob(token.split('.')[1]));
  }

  clamp(input:number , min:number , max:number) : number{
    return Math.min(Math.max(input, min), max);
  }
}
