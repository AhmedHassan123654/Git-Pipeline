import { Directive, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from "@angular/forms";
import { MustMatch } from "./mustmatchvalidator";

@Directive({
  selector: "[mustMatch]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: MustMatchDirectiveResetPass,
      multi: true
    }
  ]
})
export class MustMatchDirectiveResetPass implements Validator {
  @Input("mustMatch") mustMatch: string[] = [];

  validate(formGroup: FormGroup): ValidationErrors {
    return MustMatch(this.mustMatch[0], this.mustMatch[1])(formGroup);
  }
}
