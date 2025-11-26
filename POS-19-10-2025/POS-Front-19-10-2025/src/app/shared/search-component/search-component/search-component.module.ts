import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SearchComponentRoutingModule } from "./search-component-routing.module";
import { SearchComponentComponent } from "./search-component.component";
import { general } from "../../../core/Helper/general";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  declarations: [SearchComponentComponent],
  imports: [CommonModule, SearchComponentRoutingModule, SharedModule, FormsModule],
  exports: [SearchComponentComponent]
})
export class SearchComponentModule {}
