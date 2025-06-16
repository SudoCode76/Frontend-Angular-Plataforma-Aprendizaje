import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMentorComponent } from './dashboard-mentor.component';

describe('DashboardMentorComponent', () => {
  let component: DashboardMentorComponent;
  let fixture: ComponentFixture<DashboardMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
