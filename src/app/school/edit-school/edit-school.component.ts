import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpProviderService } from '../../service/http-provider.service';

@Component({
  selector: 'app-edit-school',
  templateUrl: './edit-school.component.html',
  styleUrls: ['./edit-school.component.scss'],
})
export class EditSchoolComponent implements OnInit {
  editEmployeeForm: schoolForm = new schoolForm();

  @ViewChild('schoolForm')
  schoolForm!: NgForm;

  isSubmitted: boolean = false;
  schoolId: any;

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.schoolId = this.route.snapshot.params['schoolId'];
    this.getDetailSchool();
  }

  async getDetailSchool() {
    this.httpProvider.getDetailSchool(this.schoolId).subscribe(
      (data: any) => {
        if (data) {
          this.editEmployeeForm.name = data.name;
          this.editEmployeeForm.address = data.address;
        }
      },
      (error: any) => {
        if (error) {
          console.log(
            '🚀 ~ ViewEmployeeComponent ~ getDetailSchool ~ error:',
            error
          );
        }
      }
    );
  }

  editSchool(isValid: any) {
    this.isSubmitted = true;
    if (isValid) {
      this.httpProvider
        .updateSchool(this.schoolId, this.editEmployeeForm)
        .subscribe(
          (data: any) => {
            if (data) {
              this.router.navigate(['/school']);
            }
          },
          (error: any) => {
            if (error) {
              console.log(
                '🚀 ~ ViewEmployeeComponent ~ getDetailSchool ~ error:',
                error
              );
            }
          }
        );
    }
  }
}

export class schoolForm {
  name: string = '';
  address: string = '';
}
