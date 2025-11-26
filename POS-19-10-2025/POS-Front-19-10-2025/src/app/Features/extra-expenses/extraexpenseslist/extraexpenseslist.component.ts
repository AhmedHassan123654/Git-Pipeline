import { Component, ViewChild } from "@angular/core";
import * as imp from "../extraexpensis";

@Component({
  selector: "app-extraexpenseslist",
  templateUrl: "./extraexpenseslist.component.html",
  styleUrls: ["./extraexpenseslist.component.css"]
})
export class ExtraexpenseslistComponent extends imp.GenericGridList implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion

  constructor(public extraExpensesSerice: imp.ExtraExpensesService, public shared: imp.ISharedGridList) {
    super(shared);
    this.initializeobjects();
  }
  ngOnInit() {
    super.initializeGrid();
    this.updateGrid();
  }

  initializeobjects(): void {
    this.filterobj = {};
    this.filterobj.FromDate = new Date();
    this.filterobj.ToDate = new Date();
    super.setServiceAndRouteName(this.extraExpensesSerice, "/extraexpenses");
    //super.setCustomButton1ToolTipAndIcon('Sync','e-sync');
  }

  updateGrid(){
    super.getGrideList(this.filterobj).subscribe(() => {});
  }
  // deleteButtonAction(){
  //   if(this.rowData.Amount == 645){
  //     this.shared.toastr.error(
  //       this.shared.toastrMessage.GlobalMessages(19),);
  //       return;
  //   }
  //   else
  //       super.deleteButtonAction();
  // }
  editButtonAction() {
    if (this.rowData.IsSync == true) {
      this.shared.toastr.error(this.shared.toastrMessage.GlobalMessages(29));
      return;
    } else super.editButtonAction();
  }
  // onRowSelectedEvent(){
  //   if(this.rowData.Amount == 645)
  //      super.showActionButton('Edit',false);
  //       else
  //       super.showActionButton('Edit',true);
  // }
}
