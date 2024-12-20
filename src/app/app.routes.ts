import { Routes } from '@angular/router';
import {DefaultLayoutComponent} from './skeleton/components/default-layout/default-layout.component';
import {DashboardPageComponent} from './dashboard/pages/dashboard-page/dashboard-page.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: '',
        component: DashboardPageComponent
      }
    ]
  }
];
