import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SassWizardService } from "src/app/core/Services/Transactions/sass-wizard.service";
import { LocalstorgeService } from "src/app/localstorge.service";
import {
  HandlingBackMessages,
  LanguageSerService,
  Router,
  SettingService,
  ToastrService,
  TranslateService
} from "../../adminstration/permission-imports";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";

declare var $: any;

@Component({
  selector: "app-branch-wizard",
  templateUrl: "./branch-wizard.component.html",
  styleUrls: ["./branch-wizard.component.scss"]
})
export class BranchWizardComponent implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  ShowWizard: boolean = false;

  //#endregion

  constructor(
    public SassWizardSer: SassWizardService,
    public languageSerService: LanguageSerService,
    public translate: TranslateService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    private dialogRef: MatDialogRef<BranchWizardComponent>,
    private settingServ: SettingService,
    private orderSer: OrderService,

    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private LocalstorgeService: LocalstorgeService
  ) {
    this.initializeobjects();
  }
  ngOnInit() {
    //  document.getElementById('uplade_Img').classList.add('d-none');
    // document.getElementById('upladDone').classList.remove('d-none');
    this.SassWizardSer.firstOpen().subscribe((data) => {
      this.responseobj = data;
      // this.next();
    });
  }

  InsertBranch() {
    this.SassWizardSer.InsertOrUpdateBranchAsync(this.Branchobj).subscribe((res) => {
      if (res == 1 || res == 2) {
        // this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.SassWizardSer.GetDefaultBranch().subscribe((data) => {
          this.Branchobj = data;
        });
        this.step++;
      }
    });
  }
  next() {
    this.SassWizardSer.GetDefaultBranch().subscribe((data) => {
      this.Branchobj = data;
    });
    if (this.step == 2) {
      this.InsertBranch();
    } else if (this.step == 4) {
      this.SassWizardSer.GetProductGroupsAndPrinter().subscribe((data) => {
        this.Obj = data as any;
        this.ProductGroupList = this.Obj.ProductGroups;
        this.printerName = this.Obj.printerName;
        this.step++;
      });
    } else this.step++;
  }
  previous() {
    this.step--;
  }
  submit() {
    //End Withard
    this.ShowWizard = true;
    let lang = JSON.parse(localStorage.getItem("langs")) as string;
    this.settingServ.updateFirstLogIn(lang).subscribe((res) => {
      this.dialogRef.close();
      this.router.navigateByUrl("/order");
    });
  }

  initializeobjects(): void {
    this.step = 1;
    this.Flds = { text: "Name", value: "DocumentId" };
    this.Fldscountry = { text: "text", value: "value" };
    this.responseobj = {};
    this.Branchobj = {};
    this.ProductGroupobj = {};
    this.Printerobj = {};
    this.Productobj = {};
    this.CountriesList = [];
    this.CountriesList.push(
      { text: "Afghanistan", value: "Afghanistan" },
      { text: "Åland Islands", value: "Åland Islands" },
      { text: "Albania", value: "Albania" },
      { text: "American", value: "American" },
      { text: "Andorra", value: "Andorra" },
      { text: "Angola", value: "Angola" },
      { text: "Anguilla", value: "Anguilla" },
      { text: "Antarctica", value: "Antarctica" },
      { text: "Antigua and Barbuda", value: "Antigua and Barbuda" },
      { text: "Argentina", value: "Argentina" },
      { text: "Armenia", value: "Armenia" },
      { text: "Aruba", value: "Aruba" },
      { text: "Australia", value: "Australia" },
      { text: "Austria", value: "Austria" },
      { text: "Azerbaijan", value: "Azerbaijan" },
      { text: "Bahamas", value: "Bahamas" },
      { text: "Bahrain", value: "Bahrain" },
      { text: "Bangladesh", value: "Bangladesh" },
      { text: "Barbados", value: "Barbados" },
      { text: "Belarus", value: "Belarus" },
      { text: "Belgium", value: "Belgium" },
      { text: "Belize", value: "Belize" },
      { text: "Benin", value: "Benin" },
      { text: "Bermuda", value: "Bermuda" },
      { text: "Bhutan", value: "Bhutan" },
      { text: "Bolivia", value: "Bolivia" },
      { text: "Bosnia and Herzegovina", value: "Bosnia and Herzegovina" },
      { text: "Botswana", value: "Botswana" },
      { text: "Bouvet Island", value: "Bouvet Island" },
      { text: "Brazil", value: "Brazil" },
      {
        text: "British Indian Ocean Territory",
        value: "British Indian Ocean Territory"
      },
      { text: "Brunei Darussalam", value: "Brunei Darussalam" },
      { text: "Bulgaria", value: "Bulgaria" },
      { text: "Burkina Faso", value: "Burkina Faso" },
      { text: "Burundi", value: "Burundi" },
      { text: "Cambodia", value: "Cambodia" },
      { text: "Cameroon", value: "Cameroon" },
      { text: "Canada", value: "Canada" },
      { text: "Cape Verde", value: "Cape Verde" },
      { text: "Cayman Islands", value: "Cayman Islands" },
      { text: "Central African Republic", value: "Central African Republic" },
      { text: "Chad", value: "Chad" },
      { text: "Chile", value: "Chile" },
      { text: "China", value: "China" },
      { text: "Christmas Island", value: "Christmas Island" },
      { text: "Cocos (Keeling) Islands", value: "Cocos (Keeling) Islands" },
      { text: "Colombia", value: "Colombia" },
      { text: "Comoros", value: "Comoros" },
      { text: "Congo", value: "Congo" },
      {
        text: "Congo, The Democratic Republic of The",
        value: "Congo, The Democratic Republic of The"
      },
      { text: "Cook Islands", value: "Cook Islands" },
      { text: "Costa Rica", value: "Costa Rica" },
      { text: "Cote D'ivoire", value: "Cote D'ivoire" },
      { text: "Croatia", value: "Croatia" },
      { text: "Cuba", value: "Cuba" },
      { text: "Cyprus", value: "Cyprus" },
      { text: "Czech Republic", value: "Czech Republic" },
      { text: "Denmark", value: "Denmark" },
      { text: "Djibouti", value: "Djibouti" },
      { text: "Dominica", value: "Dominica" },
      { text: "Dominican Republi", value: "Dominican Republi" },
      { text: "Ecuador", value: "Ecuador" },
      { text: "Egypt", value: "Egypt" },
      { text: "El Salvador", value: "El Salvador" },
      { text: "Equatorial Guinea", value: "Equatorial Guinea" },
      { text: "Eritrea", value: "Eritrea" },
      { text: "Estonia", value: "Estonia" },
      { text: "Ethiopia", value: "Ethiopia" },
      {
        text: "Falkland Islands (Malvinas)",
        value: "Falkland Islands (Malvinas)"
      },
      { text: "Faroe Islands", value: "Faroe Islands" },
      { text: "Fiji", value: "Fiji" },
      { text: "Finland", value: "Finland" },
      { text: "France", value: "France" },
      { text: "French Guiana", value: "French Guiana" },
      { text: "French Polynesia", value: "French Polynesia" },
      {
        text: "French Southern Territories",
        value: "French Southern Territories"
      },
      { text: "Gabon", value: "Gabon" },
      { text: "Gambia", value: "Gambia" },
      { text: "Georgia", value: "Georgia" },
      { text: "Germany", value: "Germany" },
      { text: "Ghana", value: "Ghana" },
      { text: "Gibraltar", value: "Gibraltar" },
      { text: "Greece", value: "Greece" },
      { text: "Greenland", value: "Greenland" },
      { text: "Grenada", value: "Grenada" },
      { text: "Guadeloupe", value: "Guadeloupe" },
      { text: "Guam", value: "Guam" },
      { text: "Guatemala", value: "Guatemala" },
      { text: "Guernsey", value: "Guernsey" },
      { text: "Guinea", value: "Guinea" },
      { text: "Guinea-bissau", value: "Guinea-bissau" },
      { text: "Guyana", value: "Guyana" },
      { text: "Haiti", value: "Haiti" },
      {
        text: "Heard Island and Mcdonald Islands",
        value: "Heard Island and Mcdonald Islands"
      },
      {
        text: "Holy See (Vatican City State)",
        value: "Holy See (Vatican City State)"
      },
      { text: "Honduras", value: "Honduras" },
      { text: "Hong Kong", value: "Hong Kong" },
      { text: "Hungary", value: "Hungary" },
      { text: "Iceland", value: "Iceland" },
      { text: "India", value: "India" },
      { text: "Indonesia", value: "Indonesia" },
      { text: "Iran", value: "Iran" },
      { text: "Iraq", value: "Iraq" },
      { text: "Ireland", value: "Ireland" },
      { text: "Isle of Man", value: "Isle of Man" },
      { text: "Italy", value: "Italy" },
      { text: "Jamaica", value: "Jamaica" },
      { text: "Japan", value: "Japan" },
      { text: "Jersey", value: "Jersey" },
      { text: "Jordan", value: "Jordan" },
      { text: "Kazakhstan", value: "Kazakhstan" },
      { text: "Kenya", value: "Kenya" },
      { text: "Kiribati", value: "Kiribati" },
      {
        text: "Korea, Democratic People's Republic of",
        value: "Korea, Democratic People's Republic of"
      },
      { text: "Korea, Republic of", value: "Korea, Republic of" },
      { text: "Kuwait", value: "Kuwait" },
      { text: "Kyrgyzstan", value: "Kyrgyzstan" },
      {
        text: "Lao People's Democratic Republic",
        value: "Lao People's Democratic Republic"
      },
      { text: "Latvia", value: "Latvia" },

      { text: "Lebanon", value: "Lebanon" },
      { text: "Lesotho", value: "Lesotho" },
      { text: "Liberia", value: "Liberia" },
      { text: "Libyan Arab Jamahiriya", value: "Libyan Arab Jamahiriya" },
      { text: "Liechtenstein", value: "Liechtenstein" },
      { text: "Lithuania", value: "Lithuania" },
      { text: "Luxembourg", value: "Luxembourg" },
      { text: "Macao", value: "Macao" },
      {
        text: "Macedonia, The Former Yugoslav Republic of",
        value: "Macedonia, The Former Yugoslav Republic of"
      },
      { text: "Madagascar", value: "Madagascar" },
      { text: "Malawi", value: "Malawi" },
      { text: "Malaysia", value: "Malaysia" },
      { text: "Maldives", value: "Maldives" },
      { text: "Mali", value: "Mali" },
      { text: "Malta", value: "Malta" },
      { text: "Marshall Islands", value: "Marshall Islands" },
      { text: "Martinique", value: "Martinique" },
      { text: "Mauritania", value: "Mauritania" },
      { text: "Mauritius", value: "Mauritius" },
      { text: "Mayotte", value: "Mayotte" },
      { text: "Mexico", value: "Mexico" },
      {
        text: "Micronesia, Federated States of",
        value: "Micronesia, Federated States of"
      },
      { text: "Moldova, Republic of", value: "Moldova, Republic of" },
      { text: "Monaco", value: "Monaco" },
      { text: "Mongolia", value: "Mongolia" },
      { text: "Montenegro", value: "Montenegro" },
      { text: "Montserrat", value: "Montserrat" },
      { text: "Morocco", value: "Morocco" },
      { text: "Mozambique", value: "Mozambique" },
      { text: "Myanmar", value: "Myanmar" },
      { text: "Namibia", value: "Namibia" },
      { text: "Nauru", value: "Nauru" },

      { text: "Nepal", value: "Nepal" },
      { text: "Netherlands", value: "Netherlands" },
      { text: "Netherlands Antilles", value: "Netherlands Antilles" },
      { text: "New Caledonia", value: "New Caledonia" },
      { text: "New Zealand", value: "New Zealand" },
      { text: "Nicaragua", value: "Nicaragua" },
      { text: "Niger", value: "Niger" },
      { text: "Nigeria", value: "Nigeria" },
      { text: "Niue", value: "Niue" },
      { text: "Norfolk Island", value: "Norfolk Island" },
      { text: "Northern Mariana Islands", value: "Northern Mariana Islands" },
      { text: "Norway", value: "Norway" },
      { text: "Oman", value: "Oman" },
      { text: "Pakistan", value: "Pakistan" },
      { text: "Palau", value: "Palau" },
      {
        text: "Palestinian Territory, Occupied",
        value: "Palestinian Territory, Occupied"
      },
      { text: "Panama", value: "Panama" },
      { text: "Papua New Guinea", value: "Papua New Guinea" },
      { text: "Paraguay", value: "Paraguay" },
      { text: "Peru", value: "Peru" },
      { text: "Philippines", value: "Philippines" },
      { text: "Pitcairn", value: "Pitcairn" },
      { text: "Poland", value: "Poland" },
      { text: "Portugal", value: "Portugal" },
      { text: "Puerto Rico", value: "Puerto Rico" },
      { text: "Qatar", value: "Qatar" },
      { text: "Reunion", value: "Reunion" },
      { text: "Romania", value: "Romania" },
      { text: "Russian Federation", value: "Russian Federation" },
      { text: "Rwanda", value: "Rwanda" },
      { text: "Saint Helena", value: "Saint Helena" },
      { text: "Saint Kitts and Nevis", value: "Saint Kitts and Nevis" },
      { text: "Saint Lucia", value: "Saint Lucia" },
      { text: "Saint Pierre and Miquelon", value: "Saint Pierre and Miquelon" },
      {
        text: "Saint Vincent and The Grenadines",
        value: "Saint Vincent and The Grenadines"
      },
      { text: "Samoa", value: "Samoa" },
      { text: "San Marino", value: "San Marino" },
      { text: "Sao Tome and Principe", value: "Sao Tome and Principe" },
      { text: "Saudi Arabia", value: "Saudi Arabia" },
      { text: "Senegal", value: "Senegal" },
      { text: "Serbia", value: "Serbia" },
      { text: "Seychelles", value: "Seychelles" },
      { text: "Sierra Leone", value: "Sierra Leone" },
      { text: "Singapore", value: "Singapore" },
      { text: "Slovakia", value: "Slovakia" },
      { text: "Slovenia", value: "Slovenia" },
      { text: "Solomon Islands", value: "Solomon Islands" },
      { text: "Somalia", value: "Somalia" },
      { text: "South Africa", value: "South Africa" },
      {
        text: "South Georgia and The South Sandwich Islands",
        value: "South Georgia and The South Sandwich Islands"
      },
      { text: "Spain", value: "Spain" },

      { text: "Sri Lanka", value: "Sri Lanka" },
      { text: "Sudan", value: "Sudan" },
      { text: "Suriname", value: "Suriname" },
      { text: "Svalbard and Jan Mayen", value: "Svalbard and Jan Mayen" },
      { text: "Swaziland", value: "Swaziland" },
      { text: "Sweden", value: "Sweden" },
      { text: "Switzerland", value: "Switzerland" },
      {
        text: "Syrian Arab Republic",
        value: "AfghaSyrian Arab Syrian Arab Republic"
      },
      { text: "Taiwan", value: "Taiwan" },
      { text: "Tajikistan", value: "Tajikistan" },
      {
        text: "Tanzania, United Republic of",
        value: "Tanzania, United Republic of"
      },
      { text: "Thailand", value: "Thailand" },
      { text: "Timor-leste", value: "Timor-leste" },
      { text: "Togo", value: "Togo" },
      { text: "Tokelau", value: "Tokelau" },
      { text: "Tonga", value: "Tonga" },
      { text: "Trinidad and Tobago", value: "Trinidad and Tobago" },
      { text: "Tunisia", value: "Tunisia" },
      { text: "Turkey", value: "Turkey" },
      { text: "Turkmenistan", value: "Turkmenistan" },

      { text: "Turks and Caicos Islands", value: "Turks and Caicos Islands" },
      { text: "Tuvalu", value: "Tuvalu" },
      { text: "Uganda", value: "Uganda" },
      { text: "Ukraine", value: "Ukraine" },
      { text: "United Arab Emirates", value: "United Arab Emirates" },
      { text: "United Kingdom", value: "United Kingdom" },
      { text: "United States", value: "United States" },
      {
        text: "United States Minor Outlying Islands",
        value: "AfghaUnited States Minor Outlying Islandsnistan"
      },
      { text: "Uruguay", value: "Uruguay" },
      { text: "Uzbekistan", value: "Uzbekistan" },
      { text: "Vanuatu", value: "Vanuatu" },
      { text: "Venezuela", value: "Venezuela" },
      { text: "Viet Nam", value: "Viet Nam" },
      { text: "Virgin Islands, British", value: "Virgin Islands, British" },
      { text: "Virgin Islands, U.S", value: "Virgin Islands, U.S" },
      { text: "Wallis and Futuna", value: "Wallis and Futuna" },
      { text: "Western Sahara", value: "Western Sahara" },
      { text: "Yemen", value: "Yemen" },
      { text: "Zambia", value: "Zambia" },
      { text: "Zimbabwe", value: "Zimbabwe" }
    );

    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  uploadBranchImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      this.EditFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.Branchobj.Logo = event.target.result;
      };
    }
  }

  uploadProductGroupImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      this.EditFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.ProductGroupobj.PicturePath = event.target.result;
      };
    }
  }
  uploadProductImage(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      var reader = new FileReader();
      this.EditFile = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.Productobj.PicturePath2 = event.target.result;
      };
      const formData = new FormData();
      formData.append("file", this.EditFile, this.EditFile.name);

      this.orderSer.uploadImage(formData).subscribe((res) => {
        let obj = res as any;
        if (res && obj.dbPath) {
          this.Productobj.PicturePath = obj.dbPath;
        } else this.toastr.error(this.toastrMessage.GlobalMessages(res), "Order");
      });
    }
  }

  SaveProductGroup(next = false) {
    if (next && (!this.ProductGroupobj || !this.ProductGroupobj.Name || !this.ProductGroupobj.ProductTypeDocumentId))
      this.next();
    else {
      this.SassWizardSer.InsertProductGroupAsync(this.ProductGroupobj).subscribe((res) => {
        if (res == 1 || res == 2) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          this.ProductGroupobj.PicturePath = null;
          this.ProductGroupobj = {};
          if (next) this.next();
        }
      });
    }
  }
  SaveProductobj(submit = false) {
    if (submit && (!this.Productobj || !this.Productobj.Name || !this.Productobj.ProductGroupDocumentId)) this.submit();
    else {
      this.SassWizardSer.InsertProductAsync(this.Productobj).subscribe((res) => {
        if (res == 1 || res == 2) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          this.Productobj.PicturePath = null;
          this.Productobj = {};
          if (submit) this.submit();
        }
      });
    }
  }
  SavePrinter() {
    if (!this.Printerobj || (!this.Printerobj.cashierprinter && !this.Printerobj.Name)) this.next();
    else {
      this.Printerobj.VirtualName = "Kitchen Printer";
      this.SassWizardSer.InsertPrinter(this.Printerobj).subscribe((res) => {
        if (res == 1 || res == 2) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          this.next();
        }
      });
    }
  }

  //#region language
  switchLocalization(lang: string) {

    //  let currentUrl = this.router.url;
    //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    //  this.router.onSameUrlNavigation = 'reload';
    //  this.router.navigate([currentUrl]);
    this.NewLang = this.LocalstorgeService.get("langs");
    this.LocalstorgeService.set("langs", lang);
    this.languageSerService.changeLang(lang);
    this.setLang = lang;
    this.changeCssFile(lang);

    // this.reloadCurrentRoute();
  }

  changeCssFile(lang) {
    if (this.LocalstorgeService.get("langs") == null) {
      this.LocalstorgeService.set("langs", "ar");
      this.languageSerService.changeLang("ar");
    } else {
      //  this.languageSerService.langsSet = this.LocalstorgeService.get("langs");
      this.languageSerService.changeLang(lang);
    }

    //let langsSet="en";
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = this.languageSerService.langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }

    this.translate.setDefaultLang(this.languageSerService.langsSet);
    this.translate.use(this.languageSerService.langsSet);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = this.languageSerService.langsSet === "ar" ? "rtl" : "ltr";
    // this.setLang =langsSet ;
  }
  //#endregion
}
