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
        <span class="fw-semibold text-danger">{{ class?.name }}</span
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
        (click)="modal.close(class?.id)"
      >
        OK
      </button>
    </div>
  `,
})
export class NgModalConfirm {
  @Input() class: any; // Nhận prop
  constructor(public modal: NgbActiveModal) {}
}

const MODALS: { [name: string]: Type<any> } = {
  deleteModal: NgModalConfirm,
};

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  closeResult = '';
  classList: any = [];
  constructor(
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.getAllClass();
  }

  async getAllClass() {
    this.httpProvider.getAllClass({ has_school: true }).subscribe(
      (data: any) => {
        this.classList = data;
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.classList = [];
            }
          }
        }
      }
    );
  }

  addClass() {
    this.router.navigate(['addClass']);
  }

  deleteClassConfirmation(classData: any) {
    const modalRef = this.modalService.open(NgModalConfirm);
    modalRef.componentInstance.class = classData; // Truyền dữ liệu vào modal

    modalRef.result.then(
      (result) => {
        if (result) {
          this.deleteClass(result);
        }
      },
      (reason) => {
        console.log(
          '🚀 ~ ClassComponent ~ deleteClassConfirmation ~ reason:',
          reason
        );
      }
    );
  }

  deleteClass(classId: any) {
    console.log('🚀 ~ ClassComponent ~ classId:', classId);
    this.httpProvider.deleteClass(classId).subscribe(
      (data: any) => {
        this.getAllClass();
      },
      (error: any) => {
        if (error) {
          if (error.status == 404) {
            if (error.error && error.error.message) {
              this.classList = [];
            }
          }
        }
      }
    );
  }
}
