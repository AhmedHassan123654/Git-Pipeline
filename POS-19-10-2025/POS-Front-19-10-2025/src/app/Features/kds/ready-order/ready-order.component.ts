import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-ready-order",
  templateUrl: "./ready-order.component.html",
  styleUrls: ["./ready-order.component.scss"]
})
export class ReadyOrderComponent implements OnInit {
  Fullscreen: boolean = true;
  masonryItems = [
    {
      title: "item 1",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 2",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 3",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 4",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 5",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 6",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 7",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 8",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 9",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 10",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 11",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 12",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 4",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 5",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 6",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 7",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 8",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 9",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    },
    {
      title: "item 10",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
    },
    {
      title: "item 11",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
    },
    {
      title: "item 12",
      orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      weekdays: ["sun", "mon", "tue", "wed"]
    }
  ];
  constructor() {}

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
    // popup Start
    let editGrid = document.querySelector(".editGrid2");
    console.log(editGrid);
    editGrid.addEventListener("click", (e) => {
      if ((e.target as HTMLTextAreaElement).classList.contains("popubtn")) {
        let ParentDiv = (e.target as HTMLTextAreaElement).parentElement;
        ParentDiv.classList.toggle("modalContin");
        let pp = ParentDiv.parentElement;
        pp.classList.toggle("modalll");
      }
      if ((e.target as HTMLTextAreaElement).classList.contains("modalll")) {
        let removePopupContainer = e.target as HTMLTextAreaElement;
        removePopupContainer.classList.remove("modalll");
        let removePopup = removePopupContainer.children[0];
        removePopup.classList.remove("modalContin");
      }
      if ((e.target as HTMLTextAreaElement).classList.contains("fa-expand")) {
        (e.target as HTMLTextAreaElement).classList.remove("fa-expand");
        (e.target as HTMLTextAreaElement).classList.add("fa-compress");
      } else if ((e.target as HTMLTextAreaElement).classList.contains("fa-compress")) {
        (e.target as HTMLTextAreaElement).classList.add("fa-expand");
        (e.target as HTMLTextAreaElement).classList.remove("fa-compress");
      }
    });
    //popup end
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
