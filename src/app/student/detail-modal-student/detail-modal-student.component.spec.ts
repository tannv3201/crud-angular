import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailModalStudentComponent } from './detail-modal-student.component';

describe('DetailModalStudentComponent', () => {
  let component: DetailModalStudentComponent;
  let fixture: ComponentFixture<DetailModalStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailModalStudentComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailModalStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
