import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TabelsHallService } from "src/app/core/Services/order/TabelsHallService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
declare var GetCanvase;
declare var SetCanvase;
@Component({
  selector: "app-tables",
  templateUrl: "./tables.component.html",
  styleUrls: ["./tables.component.css"]
})
export class TablesComponent implements OnInit {
  @Input() canvasId: string;
  @Input() dataTab: any;
  @Input() CurrHall: any;

  constructor(
    public hallServ: TabelsHallService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages
  ) {
    setTimeout(() => {
      this.setTable(this.canvasId);
    }, 300);
  }

  ngOnInit() {}
  ngAfterViewChecked() {}
  saveTable(canvId) {
    let canvas = GetCanvase(canvId.toString());

    let _objects = canvas._objects;
    let json = canvas.toJSON();

    for (let i = 0; i < json.objects.length; i++) {
      json.objects[i].DocumentId = _objects[i].DocumentId;
    }
    console.log("new json:", json);
    this.CurrHall.Canvas = json;
    // this.CurrHall.Canvas = JSON.stringify(json);
    this.UpdateHallCanvas(this.CurrHall);
    // localStorage.setItem('design'+canvId, JSON.stringify(json));
  }
  setTable(canvId) {
    // if (localStorage.getItem("design"+canvId) !== null) {
    //     const json = localStorage.getItem("design"+canvId);
    //     SetCanvase(canvId.toString(),json);
    // }

    if (this.CurrHall.Canvas && this.CurrHall.Canvas != null) {
      const json = this.CurrHall.Canvas;
      SetCanvase(canvId.toString(), JSON.stringify(json));
    }
  }
  UpdateHallCanvas(model: any) {
    // this.hallServ.UpdateHallCanvas(model).subscribe(
    //     res => {
    //         this.toastr.success(this.toastrMessage.GlobalMessages(2),'halls');
    //       } ,
    //     err => {
    //       this.toastr.error(this.toastrMessage.GlobalMessages(err),'halls');
    //     }
    //   );
  }
}
