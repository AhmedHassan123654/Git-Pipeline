import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function validateRequired(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    if (value === 0) {
      return { min: true };
    }
    return null;
  };
}
