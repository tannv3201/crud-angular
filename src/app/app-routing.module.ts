import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SchoolComponent } from './school/list-school/school.component';
import { ClassComponent } from './class/list-class/class.component';
import { StudentComponent } from './student/list-student/student.component';
import { StudentsComponent } from './students/students.component';

const routes: Routes = [
  { path: '', redirectTo: 'school', pathMatch: 'full' },
  { path: 'school', component: SchoolComponent },
  { path: 'class', component: ClassComponent },
  { path: 'student', component: StudentComponent },
  { path: 'students', component: StudentsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
