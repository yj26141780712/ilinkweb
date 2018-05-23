import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { IlinkMapComponent } from '../ilink-map/ilink-map.component';
import { TimeDataComponent } from '../time-data/time-data.component';
import { ProduceListComponent } from '../produce-list/produce-list.component';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { NavigationComponent } from '../produce-list/navigation';
import { ProduceTable } from '../produce-list/produce-table';
import { ModuleTable } from '../produce-list/module-table';
import { RemotelyComponent } from '../remotely/remotely.component';
import { ShutDown } from '../remotely/ShutDown';
import { ParamMessage } from '../remotely/paramMessage';
import { ProduceData } from '../remotely/produceData';
import { TimelyTemperature } from '../remotely/timelyTemperature';
import { SmoothMessage } from '../remotely/smoothMessage';
import { selectAddress } from '../remotely/selectAddress';
import { Machine } from '../file-management/Machine';
import { AreaManagement } from '../file-management/areaManagement';
import { Employee } from '../file-management/employee';
import { Company } from '../file-management/company';
import { OperationLog } from '../file-management/OperationLog';
import { Client } from '../file-management/client';
import { HomeComponent } from './home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FittingComponent } from '../file-management/fitting/fitting.component';

import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { SetMachineComponent } from '../file-management/set-machine/set-machine.component';
import { KeysPipe } from '../tools/pipe/keys.pipe';
import { RegisterComponent } from '../register/register.component';
import { FactoryInfoComponent } from '../file-management/factory-info/factory-info.component';
import { MachineFormComponent } from '../file-management/machine-form/machine-form.component';
import { FixTableComponent } from '../component/fix-table/fix-table.component';
import { MachineComponent } from '../file-management/machine/machine.component';
import { TableComponent } from '../component/table/table.component';
import { CompanyFormComponent } from '../file-management/company-form/company-form.component';

import { MachineValidator } from './../tools/directive/MachineValidator';
import { MachineService } from './../tools/services/machine.service';
import { CompanyService } from './../tools/services/company.service';
import { AreaService } from '../tools/services/area.service';
import { AreaFormComponent } from '../file-management/area-form/area-form.component';
import { EmployeeFormComponent } from '../file-management/employee-form/employee-form.component';
import { EmployeeService } from '../tools/services/employee.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HomeRoutingModule,
    PaginationModule.forRoot(),
    ModalModule.forRoot()
  ],
  declarations: [
    HomeComponent,
    IlinkMapComponent,
    ProduceListComponent,
    TimeDataComponent,
    SearchMachineidComponent,
    NavigationComponent,
    ProduceTable,
    ModuleTable,
    RemotelyComponent,
    ShutDown,
    ParamMessage,
    ProduceData,
    TimelyTemperature,
    SmoothMessage,
    selectAddress,
    Machine,
    AreaManagement,
    Employee,
    Company,
    OperationLog,
    Client,
    FittingComponent,
    SetMachineComponent,
    KeysPipe,
    KeysPipe,
    FactoryInfoComponent,
    MachineFormComponent,
    FixTableComponent,
    MachineComponent,
    TableComponent,
    CompanyFormComponent,
    AreaFormComponent,
    EmployeeFormComponent
  ],
  providers: [MachineService, MachineValidator, CompanyService, AreaService, EmployeeService],
  entryComponents: [
    FittingComponent,
    SetMachineComponent,
    MachineFormComponent,
    CompanyFormComponent,
    AreaFormComponent]
})
export class HomeModule {

}
