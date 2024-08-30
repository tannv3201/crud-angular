import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/list-school/school.component';
import { DetailSchoolComponent } from './school/detail-school/detail-school.component';
import { AddSchoolComponent } from './school/add-school/add-school.component';
import { EditSchoolComponent } from './school/edit-school/edit-school.component';
import { ClassComponent } from './class/list-class/class.component';
import { DetailClassComponent } from './class/detail-class/detail-class.component';

const routes: Routes = [
  { path: '', redirectTo: 'school', pathMatch: 'full' },
  { path: 'school', component: SchoolComponent },
  { path: 'school/:schoolId', component: DetailSchoolComponent },
  { path: 'addSchool', component: AddSchoolComponent },
  { path: 'editSchool/:schoolId', component: EditSchoolComponent },

  { path: 'class', component: ClassComponent },
  { path: 'class/:classId', component: DetailClassComponent },
  { path: 'addClass', component: AddSchoolComponent },
  { path: 'editClass/:classId', component: EditSchoolComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
