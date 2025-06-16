import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncontrarMentorComponent } from './encontrar-mentor.component';

describe('EncontrarMentorComponent', () => {
  let component: EncontrarMentorComponent;
  let fixture: ComponentFixture<EncontrarMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncontrarMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncontrarMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
