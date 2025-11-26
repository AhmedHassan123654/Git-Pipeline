import { ValidatorFn, AbstractControl, ValidationErrors } from "@angular/forms";

export function validateDuplicate(dailyStockDetails: { stockData: any[]; index: number }): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }
    if (!dailyStockDetails) {
      return null;
    }

    if (!dailyStockDetails.stockData) return null;
    const duplicatedData = dailyStockDetails.stockData.filter((x, index) =>
      x.productName === value && dailyStockDetails.index !== index ? x.CurrentQuantity++ : ""
    );

    if (duplicatedData.length > 0) {
      return { duplicated: true };
    }

    return null;
  };
}
