import { Component, EventEmitter, HostListener, Input, OnInit, Output } from "@angular/core";
import Keyboard from "simple-keyboard";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-keyboard",
  templateUrl: "./keyboard.component.html",
  styleUrls: ["./keyboard.component.scss"]
})
export class KeyboardComponent implements OnInit {
  lastFocusedElement: any;
  @Input() _frm: NgForm;
  @Input() KeyboardNgModel: any;

  show: boolean = true;
  @Output() enterEvent = new EventEmitter<any>();
  @Output() tabEvent = new EventEmitter<any>();
  constructor() {}
  enter() {
    this.enterEvent.emit();
  }
  tab() {
    this.tabEvent.emit();
  }
  ngOnInit(): void {}
  commonKeyboardOptions = {
    onChange: (input: string) => this.onChange(input),
    onKeyPress: (button: string) => this.onKeyPress(button),
    theme: "simple-keyboard hg-theme-default hg-layout-default",
    preventMouseDownDefault: true,
    physicalKeyboardHighlight: true,
    syncInstanceInputs: true,
    mergeDisplay: true,
    debug: true
  };
  keyboard: Keyboard;
  keyboardControlPad: Keyboard;
  keyboardArrows: Keyboard;
  keyboardNumPad: Keyboard;
  keyboardNumPadEnd: Keyboard;

  ngAfterViewInit() {
    this.initKeyboards();
  }
  @HostListener("window:mouseup", ["$event"])
  mouseUp(event) {
    if (
      (document.activeElement && document.activeElement.tagName.toLowerCase() == "input") ||
      document.activeElement.tagName.toLowerCase() == "textarea"
    )
      this.lastFocusedElement = document.activeElement;
    setTimeout(() => {
      this.initKeyboards();
    }, 50);
  }
  initKeyboards() {
    try {
      this.keyboard = new Keyboard(".simple-keyboard-main", {
        ...this.commonKeyboardOptions,
        /**
         * Layout by:
         * Sterling Butters (https://github.com/SterlingButters)
         */
        layout: {
          default: [
            "1 2 3 4 5 6 7 8 9 0 - = {backspace}",
            "{tab} q w e r t y u i o p [ ]",
            "{capslock} a s d f g h j k l ; ' {enter}",
            "{shiftleft} z x c v b n m , . / {shiftright}",
            "{altleft} {metaleft} {space} {metaright} {altright}"
          ],
          shift: [
            "{backspace} 1 2 3 4 5 6 7 8 9 0 - = ",
            " د ج ح خ ه ع غ ف ق ث ص ض {tab}",
            '{enter1} " : ذ ط ك م ن ت ا ل ب ي س ش {capslock}',
            "{shiftleft} ظ ز و ة ى لا ر ؤ ء ئ {shiftright}",
            "{altleft} {metaleft} {space} {metaright} {altright}"
          ],
          capslock: [
            "{backspace}  1 2 3 4 5 6 7 8 9 0 - = ",
            " Q W E R T Y U I O P { } {tab}",
            '{enter}  A S D F G H J K L : " ',
            "{shiftleft} Z X C V B N M < > ? {shiftright}",
            "{altleft} {metaleft} {space} {metaright} {altright}"
          ],
          tr: [
            "{backspace}  1 2 3 4 5 6 7 8 9 0 - =",
            " q w e r t y u ı o p ğ ü {tab}",
            "{enter}  a s d f g h j k l ş i ",
            "{shiftleft} z x c v b n m ö ç , . ?  {shiftright}",
            "{altleft} {metaleft} {space} {metaright} {altright}"
          ],
          fr: [
            "{backspace} 1 2 3 4 5 6 7 8 9 0 - = ",
            " a z e r t y u i o p é {tab}",
            "{enter} q s d f g h j k l m ù' ",
            "{shiftleft} w x c v b n è à , . ' {shiftright}",
            "{altleft} {metaleft} {space} {metaright} {altright}"
          ]
        },
        display: {
          "{backspace}": "backspace ⌫",
          "{enter}": "enter ↵",
          "{enter1}": "إدخال ↵",
          "{altleft}": "ع",
          "{altright}": "ENG",
          "{metaleft}": "TUR",
          "{metaright}": "FRA ",
          "{capslock}": "⇪ caps lock",
          "{tab}": "tab"
        }
      });

      this.setKeyboardDirection();

      // this.keyboardNumPadEnd = new Keyboard(".simple-keyboard-numpadEnd", {
      //   ...this.commonKeyboardOptions,
      //   layout: {
      //     default: ["{numpadsubtract}", "{numpadadd}", "{numpadenter}"]
      //   }
      // });
    } catch (error) {}
  }
  setKeyboardDirection() {
    const keyboardContainer:any = document.querySelector(".simple-keyboard-main");
    if (this.keyboard.options.layoutName !== "shift") {
      keyboardContainer.style.direction = "ltr";
    } else {
      keyboardContainer.style.direction = "rtl"; // or "rtl" for other layouts
    }
  }
  onChange = (input: string) => {
    this.setKeyboardDirection();

    if (this.lastFocusedElement) {
      let name = this.lastFocusedElement.name;
      // this.lastFocusedElement.value = input;
      if (this._frm && this._frm.controls && this._frm.controls[name]) {
        this._frm.controls[name].setValue(input);
      } else if (this.KeyboardNgModel && this.KeyboardNgModel.name == name) {
        this.KeyboardNgModel.control.setValue(input);
      }

      // this.keyboard.setInput(input, this.lastFocusedElement.name);
    }
  };

  onKeyPress = (button: string) => {
    try {
      if (button === "{altleft}") {
        this.keyboard.setOptions({
          layoutName: "shift"
        });
      }
      if (button === "{capslock}") {
        this.keyboard.setOptions({
          layoutName: "capslock"
        });
      }

      if (button === "{altright}") {
        this.keyboard.setOptions({
          layoutName: "default"
        });
      }
      if (button === "{metaleft}") {
        this.keyboard.setOptions({
          layoutName: "tr"
        });
      }
      if (button === "{metaright}") {
        this.keyboard.setOptions({
          layoutName: "fr"
        });
      }
      if (button === "{enter}" || button === "{enter1}") {
        this.enter();
      }

      if (button === "{tab}") {
        this.tab();
      }
      if (button == "{backspace}") {
        if (this.lastFocusedElement && this.lastFocusedElement.value)
          this.keyboard.setInput(this.lastFocusedElement.value);
      }
      this.setKeyboardDirection();

    } catch (error) {}
  };

  onInputChange = (event: any) => {
    try {
      if (!this.lastFocusedElement) event.target.value = "";
      this.keyboard.setInput(event.target.value);
    } catch (error) {}
  };

  hideKeyboard() {
    this.show = !this.show;
  }
}
