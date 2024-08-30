import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailClassComponent } from './detail-class.component';

describe('DetailClassComponent', () => {
  let component: DetailClassComponent;
  let fixture: ComponentFixture<DetailClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailClassComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
