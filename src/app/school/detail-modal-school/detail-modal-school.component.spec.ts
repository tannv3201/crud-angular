import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailModalSchoolComponent } from './detail-modal-school.component';

describe('DetailModalSchoolComponent', () => {
  let component: DetailModalSchoolComponent;
  let fixture: ComponentFixture<DetailModalSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailModalSchoolComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailModalSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
