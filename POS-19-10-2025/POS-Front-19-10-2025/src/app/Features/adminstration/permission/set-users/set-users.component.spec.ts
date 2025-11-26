import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetUsersComponent } from "./set-users.component";

describe("SetUsersComponent", () => {
  let component: SetUsersComponent;
  let fixture: ComponentFixture<SetUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SetUsersComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
