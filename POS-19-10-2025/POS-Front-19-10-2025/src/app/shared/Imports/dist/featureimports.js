"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          }
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
exports.__esModule = true;
var sti_viewer_service_1 = require("src/app/core/Services/Shared/sti-viewer.service");
__createBinding(exports, sti_viewer_service_1, "StiViewerService");
var handling_back_messages_1 = require("src/app/core/Helper/handling-back-messages");
__createBinding(exports, handling_back_messages_1, "HandlingBackMessages");
var router_1 = require("@angular/router");
__createBinding(exports, router_1, "Router");
__createBinding(exports, router_1, "ActivatedRoute");
var ngx_toastr_1 = require("ngx-toastr");
__createBinding(exports, ngx_toastr_1, "ToastrService");
var forms_1 = require("@angular/forms");
__createBinding(exports, forms_1, "FormGroup");
__createBinding(exports, forms_1, "FormBuilder");
__createBinding(exports, forms_1, "Validators");
var general_1 = require("src/app/core/Helper/general");
__createBinding(exports, general_1, "general");
var dynamic_combo_1 = require("src/app/core/Models/Transactions/dynamic-combo");
__createBinding(exports, dynamic_combo_1, "DynamicCombo");
var quick_1 = require("src/app/core/Enums/quick");
__createBinding(exports, quick_1, "quickAction");
__createBinding(exports, quick_1, "quickMode");
var ej2_angular_grids_1 = require("@syncfusion/ej2-angular-grids");
__createBinding(exports, ej2_angular_grids_1, "GridComponent");
