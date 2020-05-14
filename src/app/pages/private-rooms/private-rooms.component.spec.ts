import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateRoomsComponent } from './private-rooms.component';

describe('PrivateRoomsComponent', () => {
  let component: PrivateRoomsComponent;
  let fixture: ComponentFixture<PrivateRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
