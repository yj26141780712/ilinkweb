import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IlinkMapComponent } from '../ilink-map/ilink-map.component';
import { ProduceListComponent } from '../produce-list/produce-list.component';
import { TimeDataComponent } from '../time-data/time-data.component';
import { ProduceTable } from '../produce-list/produce-table';
import { RemotelyComponent } from '../remotely/remotely.component';
import { ShutDown } from '../remotely/ShutDown';
import { ParamMessage } from '../remotely/paramMessage';
import { ProduceData } from '../remotely/produceData';
import { TimelyTemperature } from '../remotely/timelyTemperature';
import { SmoothMessage } from '../remotely/smoothMessage';
import { Machine } from '../file-management/Machine';
import { AreaManagement } from '../file-management/areaManagement';
import { Employee } from '../file-management/employee';
import { Company } from '../file-management/company';
import { Client } from '../file-management/client';
import { OperationLog } from '../file-management/OperationLog';
import { AuthGuard } from '../tools/services/auth-guard.service';
import { FactoryInfoComponent } from '../file-management/factory-info/factory-info.component';
import { MachineComponent } from '../file-management/machine/machine.component';

const homeRoutes: Routes = [
  {
    path: '', 
    component: HomeComponent,
    canActivate:[AuthGuard],
    children: [
      { path: '', component: IlinkMapComponent },
      { path: 'home', component: IlinkMapComponent },
      { path: 'table', component: ProduceListComponent },
      { path: 'data', component: TimeDataComponent },
      { path: 'list', component: ProduceTable },
      { path: 'communi', component: RemotelyComponent },
      { path: 'stop', component: ShutDown },
      { path: 'message', component: ParamMessage },
      { path: 'produce_data', component: ProduceData },
      { path: 'temp', component: TimelyTemperature },
      { path: 'lub', component: SmoothMessage },
      { path: 'machine', component: Machine },
      { path: 'area', component: AreaManagement },
      { path: 'employee', component: Employee },
      { path: 'company', component: Company },
      { path: 'client', component: Client },
      { path: 'log', component: OperationLog },
      { path: 'factory', component: FactoryInfoComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule],
  declarations: []
})
export class HomeRoutingModule { }
