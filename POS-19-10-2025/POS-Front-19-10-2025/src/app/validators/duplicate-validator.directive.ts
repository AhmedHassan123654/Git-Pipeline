import { Directive, Input } from "@angular/core";
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from "@angular/forms";
import { validateDuplicate } from "./validateDuplicate-fn";

@Directive({
  selector: "[appDuplicateValidator]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DuplicateValidatorDirective,
      multi: true
    }
  ]
})
export class DuplicateValidatorDirective implements Validator {
  @Input("appDuplicateValidator") appDuplicateValidator: { stockData: any[]; index: number };

  validate(control: AbstractControl): ValidationErrors | null {
    return validateDuplicate(this.appDuplicateValidator)(control);
  }
}
