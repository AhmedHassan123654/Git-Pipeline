import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { general } from "../../../core/Helper/general";

@Component({
  selector: "app-search-component",
  templateUrl: "./search-component.component.html",
  styleUrls: ["./search-component.component.scss"]
})
export class SearchComponentComponent implements OnInit {
  value: any;
  @Input() FilterOne;

  @Output() returnedList = new EventEmitter<any[]>();
  returnedArray: any[];

  constructor(private general: general) {}

  ngOnInit(): void {}
  searchInOrders(searchOrders) {
    this.returnedArray = this.general.filterListByKey(this.FilterOne, "Name", searchOrders);
    this.returnedList.emit(this.returnedArray);
  }
}
