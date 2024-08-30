import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpProviderService } from '../../service/http-provider.service';
import { WebApiService } from '../../service/web-api.service';

@Component({
  selector: 'app-detail-class',
  templateUrl: './detail-class.component.html',
  styleUrls: ['./detail-class.component.scss'],
})
export class DetailClassComponent implements OnInit {
  classId: any;
  classDetail: any;

  constructor(
    public webApiService: WebApiService,
    private route: ActivatedRoute,
    private httpProvider: HttpProviderService
  ) {}

  ngOnInit(): void {
    this.classId = this.route.snapshot.params['classId'];
    this.getDetailClass();
  }

  async getDetailClass() {
    this.httpProvider
      .getDetailClass(this.classId, { has_school: true })
      .subscribe(
        (data: any) => {
          console.log('🚀 ~ HomeComponent ~ getAllEmployee ~ data:', data);
          this.classDetail = data;
        },
        (error: any) => {
          if (error) {
            console.log(
              '🚀 ~ DetailClassComponent ~ getDetailClass ~ error:',
              error
            );
          }
        }
      );
  }
}
