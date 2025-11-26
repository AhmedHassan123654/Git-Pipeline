"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.SharedModule = exports.HttpLoaderFactory = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var app_layout_component_1 = require("./app-layout/app-layout.component");
var only_number_directive_1 = require("./Directives/only-number.directive");
var pagetransactions_component_1 = require("./Directives/pagetransactions/pagetransactions.component");
var language_component_1 = require("./Directives/language/language.component");
var not_authorized_component_1 = require("./not-authorized/not-authorized.component");
var router_1 = require("@angular/router");
var http_loader_1 = require("@ngx-translate/http-loader");
var http_1 = require("@angular/common/http");
var core_2 = require("@ngx-translate/core");
var ej2_angular_dropdowns_1 = require("@syncfusion/ej2-angular-dropdowns");
var ej2_angular_grids_1 = require("@syncfusion/ej2-angular-grids");
var ej2_angular_calendars_1 = require("@syncfusion/ej2-angular-calendars");
var ej2_angular_inputs_1 = require("@syncfusion/ej2-angular-inputs");
var ej2_angular_progressbar_1 = require("@syncfusion/ej2-angular-progressbar");
var default_img_pipe_1 = require("../default-img.pipe");
var ej2_angular_buttons_1 = require("@syncfusion/ej2-angular-buttons");
var filterWithCondition_pipe_1 = require("../core/Helper/filterWithCondition.pipe");
var forms_1 = require("@angular/forms");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var ngx_perfect_scrollbar_2 = require("ngx-perfect-scrollbar");
var stimulsoft_viewer_angular_1 = require("stimulsoft-viewer-angular");
var PrintPreview_component_1 = require("./Directives/PrintPreview/PrintPreview.component");
var ej2_angular_buttons_2 = require("@syncfusion/ej2-angular-buttons");
function HttpLoaderFactory(http) {
  return new http_loader_1.TranslateHttpLoader(http);
}
exports.HttpLoaderFactory = HttpLoaderFactory;
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
  suppressScrollX: true
};
var SharedModule = /** @class */ (function () {
  function SharedModule() {}
  SharedModule = __decorate(
    [
      core_1.NgModule({
        declarations: [
          app_layout_component_1.AppLayoutComponent,
          pagetransactions_component_1.PagetransactionsComponent,
          language_component_1.LanguageComponent,
          PrintPreview_component_1.PrintPreviewComponent,
          not_authorized_component_1.NotAuthorizedComponent,
          only_number_directive_1.OnlyNumberDirective,
          default_img_pipe_1.DefaultImgPipe,
          filterWithCondition_pipe_1.FilterWithConditionPipe
        ],
        exports: [
          app_layout_component_1.AppLayoutComponent,
          pagetransactions_component_1.PagetransactionsComponent,
          language_component_1.LanguageComponent,
          PrintPreview_component_1.PrintPreviewComponent,
          core_2.TranslateModule,
          ej2_angular_dropdowns_1.ComboBoxModule,
          only_number_directive_1.OnlyNumberDirective,
          ej2_angular_inputs_1.UploaderModule,
          ej2_angular_progressbar_1.ProgressBarModule,
          ej2_angular_calendars_1.CalendarModule,
          ej2_angular_calendars_1.DatePickerModule,
          ej2_angular_dropdowns_1.MultiSelectAllModule,
          ej2_angular_buttons_1.CheckBoxAllModule,
          forms_1.FormsModule,
          forms_1.ReactiveFormsModule,
          ej2_angular_grids_1.GridModule,
          common_1.CommonModule,
          default_img_pipe_1.DefaultImgPipe,
          filterWithCondition_pipe_1.FilterWithConditionPipe,
          stimulsoft_viewer_angular_1.StimulsoftViewerModule,
          ej2_angular_buttons_2.ButtonModule
        ],
        imports: [
          common_1.CommonModule,
          router_1.RouterModule,
          ej2_angular_dropdowns_1.ComboBoxModule,
          ej2_angular_inputs_1.UploaderModule,
          ej2_angular_progressbar_1.ProgressBarModule,
          ej2_angular_calendars_1.CalendarModule,
          ej2_angular_calendars_1.DatePickerModule,
          ej2_angular_dropdowns_1.MultiSelectAllModule,
          ej2_angular_buttons_1.CheckBoxAllModule,
          forms_1.FormsModule,
          stimulsoft_viewer_angular_1.StimulsoftViewerModule,
          ngx_perfect_scrollbar_1.PerfectScrollbarModule,
          forms_1.ReactiveFormsModule,
          ej2_angular_grids_1.GridModule,
          stimulsoft_viewer_angular_1.StimulsoftViewerModule,
          core_2.TranslateModule.forRoot({
            loader: {
              provide: core_2.TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [http_1.HttpClient]
            }
          })
        ],
        providers: [
          {
            provide: ngx_perfect_scrollbar_2.PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
          },
          core_2.TranslateService,
          ej2_angular_grids_1.PageService,
          ej2_angular_grids_1.SortService,
          ej2_angular_grids_1.FilterService,
          ej2_angular_grids_1.GroupService,
          ej2_angular_grids_1.EditService,
          ej2_angular_grids_1.ToolbarService,
          ej2_angular_grids_1.CommandColumnService,
          ej2_angular_grids_1.PdfExportService,
          ej2_angular_grids_1.ExcelExportService
        ]
      })
    ],
    SharedModule
  );
  return SharedModule;
})();
exports.SharedModule = SharedModule;
