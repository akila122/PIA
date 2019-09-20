import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervAnagramComponent } from './superv-anagram.component';

describe('SupervAnagramComponent', () => {
  let component: SupervAnagramComponent;
  let fixture: ComponentFixture<SupervAnagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervAnagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervAnagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
