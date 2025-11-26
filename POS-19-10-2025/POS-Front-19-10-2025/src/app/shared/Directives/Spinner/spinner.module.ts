import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SpinnerComponent } from "./Spinner.component";
import { SharedModule } from "../../shared.module";

@NgModule({
  declarations: [SpinnerComponent],
  imports: [CommonModule, SharedModule],
  exports: [SpinnerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SpinnerModule {}
