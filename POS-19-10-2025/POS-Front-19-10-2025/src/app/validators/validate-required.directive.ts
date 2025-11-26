import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors } from "@angular/forms";
import { validateRequired } from "./validateRequired-fn";

@Directive({
  selector: "[appValidateRequired]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidateRequiredDirective,
      multi: true
    }
  ]
})
export class ValidateRequiredDirective {
  @Input("appValidateRequired") appValidateRequired: number;

  validate(control: AbstractControl): ValidationErrors | null {
    return validateRequired()(control);
  }
}
