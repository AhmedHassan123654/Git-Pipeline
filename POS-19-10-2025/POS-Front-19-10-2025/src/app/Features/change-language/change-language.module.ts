import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ChangeLanguageRoutingModule } from "./change-language-routing.module";
import { ChangeLanguageComponent } from "./change-language/change-language.component";

@NgModule({
  declarations: [ChangeLanguageComponent],
  imports: [
    CommonModule,
    ChangeLanguageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ChangeLanguageModule {}
