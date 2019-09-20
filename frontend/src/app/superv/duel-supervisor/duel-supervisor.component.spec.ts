import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelSupervisorComponent } from './duel-supervisor.component';

describe('DuelSupervisorComponent', () => {
  let component: DuelSupervisorComponent;
  let fixture: ComponentFixture<DuelSupervisorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuelSupervisorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuelSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
