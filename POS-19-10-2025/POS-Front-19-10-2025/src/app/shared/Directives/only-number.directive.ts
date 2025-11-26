import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from "@angular/core";

@Directive({
  selector: "[numbersOnly]"
})
export class OnlyNumberDirective {
  // Allow decimal numbers. The \. is only allowed once to occur
  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ["Backspace", "Tab", "End", "Home"];
  @Input() allowDecimals: boolean = false;
  @Input() numbersOnly: any;
  @Input() fraction: number;

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();
  constructor(private _el: ElementRef) {}
  @HostListener("input", ["$event"]) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    if (!this.allowDecimals) {
      this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, "");
      if (initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    } else {
      if (!String(initalValue).match(this.regex)) {
        this._el.nativeElement.value = "";
      }
    }
  }
  @HostListener("keydown", ["$event"])
  onKeyDown(event) {
    if (this.allowDecimals) {
      // Allow Backspace, tab, end, and home keys
      if (this.specialKeys.indexOf(event.key) !== -1) {
        return;
      }
      if (this.fraction && this.fraction > 0) this.regex = new RegExp("^\\d*(\\.\\d{0," + this.fraction + "})?$");
      // Do not use event.keycode this is deprecated.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
      const current: string = this._el.nativeElement.value;

      // We need this because the current value on the DOM element
      // is not yet updated with the value from this event
      const next: string = current.concat(event.key);
      if (next && !String(next).match(this.regex)) {
        event.preventDefault();
      }
    }
  }

  // ngOnChanges(changes) {

  //   if (changes.numbersOnly.currentValue === undefined) {
  //     return;
  //   } else {
  //     if (changes.numbersOnly) {
  //       if (!this.allowDecimals) {
  //         setTimeout(() => {
  //           // changes.numbersOnly.currentValue = changes.numbersOnly.currentValue.replace(
  //           //   /[^0-9]*/g,
  //           //   ""
  //           // );
  //           this.ngModelChange.emit(changes.numbersOnly.currentValue);
  //         });
  //       } else {
  //         if (
  //           changes.numbersOnly.currentValue &&
  //           !String(changes.numbersOnly.currentValue).match(this.regex)
  //         ) {
  //           setTimeout(() => {
  //             this.ngModelChange.emit("");
  //           });
  //         }
  //       }
  //     }
  //   }
  // }
}
