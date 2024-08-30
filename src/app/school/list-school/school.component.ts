import { Component, Input, OnInit, Type } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';

@Component({
  selector: 'ng-modal-confirm',
  template: `
    <div class="modal-header d-flex justify-content-between">
      <h5 class="modal-title" id="modal-title">Xác nhận xóa</h5>
      <button
        type="button"
        class="btn close"
        aria-label="Close button"
        aria-describedby="modal-title"
        (click)="modal.dismiss('Cross click')"
      >
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>
        Bạn có chắc chắn muốn xóa
        <span class="fw-semibold text-danger">{{ school?.name }}</span
        >?
      </p>
    </div>
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-outline-secondary"
        (click)="modal.dismiss('cancel click')"
      >
        CANCEL
      </button>
      <button
        type="button"
        ngbAutofocus
        class="btn btn-success"
        (click)="modal.close(school?.id)"
      >
        OK
      </button>
    </div>
  `,
})
export class NgModalConfirm {
  @Input() school: any; // Nhận prop
  constructor(public modal: NgbActiveModal) {}
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss'],
})
export class SchoolComponent implements OnInit {
  closeResult = '';
  schoolList: any = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.getAllSchool();
  }

  async getAllSchool() {
    this.httpProvider.getAllSchool().subscribe(
      (data: any) => {
        this.schoolList = data;
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.schoolList = [];
            }
          }
        }
      }
    );
  }

  addSchool() {
    this.router.navigate(['addSchool']);
  }

  deleteSchoolConfirmation(school: any) {
    const modalRef = this.modalService.open(NgModalConfirm);
    modalRef.componentInstance.school = school; // Truyền dữ liệu vào modal

    modalRef.result.then(
      (result) => {
        if (result) {
          this.deleteSchool(result);
        }
      },
      (reason) => {
        console.log(
          '🚀 ~ SchoolComponent ~ deleteSchoolConfirmation ~ reason:',
          reason
        );
      }
    );
  }

  deleteSchool(schoolId: any) {
    console.log('🚀 ~ SchoolComponent ~ schoolId:', schoolId);
    this.httpProvider.deleteSchool(schoolId).subscribe(
      (data: any) => {
        this.getAllSchool();
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.schoolList = [];
            }
          }
        }
      }
    );
  }
}
