import { Directive, ElementRef, HostListener, Input } from "@angular/core";
import { CurrencyPipe } from "@angular/common";

@Directive({
  selector: '[appPricePipe]',
  providers: [CurrencyPipe]
})
export class PricePipeDirective {
  @Input() fraction: string = '1.2-2';

  constructor(private el: ElementRef, private currencyPipe: CurrencyPipe) {}

  @HostListener('focus', ['$event.target.value'])
  onFocus(value: string) {
    // Remove the currency format to allow direct editing
    this.el.nativeElement.value = value.replace(/[^0-9.]/g, '');
  }

  @HostListener('blur', ['$event.target.value'])
  onBlur(value: string) {
    // Apply currency format
    this.el.nativeElement.value = this.currencyPipe.transform(
      value,
      ' ', // Change to the desired currency code, e.g., 'USD', 'EUR'
      'symbol',
      this.fraction,
    );
  }
}