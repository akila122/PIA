import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnagramSoloComponent } from './anagram-solo.component';

describe('AnagramSoloComponent', () => {
  let component: AnagramSoloComponent;
  let fixture: ComponentFixture<AnagramSoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnagramSoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnagramSoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
