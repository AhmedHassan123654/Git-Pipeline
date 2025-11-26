import { DOCUMENT } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
declare var $: any;
@Component({
  selector: "app-customer-kds",
  templateUrl: "./customer-kds.component.html",
  styleUrls: ["./customer-kds.component.scss"]
})
export class CustomerKdsComponent implements OnInit {
  Fullscreen: boolean = true;
  each_bar_width: any;
  bars: any;

  constructor(@Inject(DOCUMENT) private document: Document) {
    this.bars = document.getElementsByClassName("progress-bar");
    $(document).ready(() => {
      for (let i = 0; i < this.bars.length; i++) {
        console.log(i);
        let progressvl = $(this.bars[i]).attr("aria-valuenow");
        $(this.bars[i]).width(progressvl + "%");
        if (progressvl >= "90") {
          $(this.bars[i]).addClass("bar-success");
        } else if (progressvl >= "50" && progressvl < "90") {
          $(this.bars[i]).addClass("bar-warning");
        } else if (progressvl < "50") {
          $(this.bars[i]).addClass("bar-error");
        }
      }
    });
    $(document).ready(() => {
      console.log("Hello World!");
    });
  }

  ngOnInit(): void {
    //full screen Icon
    var IconFullScreen = document.querySelector(".FullScreen");
    IconFullScreen.addEventListener("click", (e) => {
      if (!document.fullscreenElement) {
        (e.target as HTMLTextAreaElement).classList.remove("fa-expand");
        (e.target as HTMLTextAreaElement).classList.add("fa-compress");
      } else {
        (e.target as HTMLTextAreaElement).classList.add("fa-expand");
        (e.target as HTMLTextAreaElement).classList.remove("fa-compress");
      }
    });
    //Full screen Icon end
  }
  openFullscreen() {
    if (document.fullscreenElement) {
      this.Fullscreen = false;
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited form Full screen mode"))
        .catch((err) => console.error(err));
    } else {
      document.documentElement.requestFullscreen();
      this.Fullscreen = true;
    }
  }
}
