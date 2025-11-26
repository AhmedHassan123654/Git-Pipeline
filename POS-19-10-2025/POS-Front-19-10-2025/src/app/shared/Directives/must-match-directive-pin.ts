import { Directive, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, ValidationErrors, FormGroup } from "@angular/forms";
import { MustMatch } from "./mustmatchvalidator";

@Directive({
  selector: "[mustMatchPin]",
  providers: [{ provide: NG_VALIDATORS, useExisting: MustMatchDirectivePin, multi: true }]
})
export class MustMatchDirectivePin implements Validator {
  @Input("mustMatchPin") mustMatchPin: string[] = [];

  validate(formGroup: FormGroup) {
    const control = formGroup.controls[this.mustMatchPin[0]];
    return MustMatch(this.mustMatchPin[0], this.mustMatchPin[1])(formGroup);
  }
}
