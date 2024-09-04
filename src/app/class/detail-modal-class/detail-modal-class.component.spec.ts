import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailModalClassComponent } from './detail-modal-class.component';

describe('DetailModalClassComponent', () => {
  let component: DetailModalClassComponent;
  let fixture: ComponentFixture<DetailModalClassComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailModalClassComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailModalClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
