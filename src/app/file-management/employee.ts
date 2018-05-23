import { EmployeeService } from './../tools/services/employee.service';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'employee',
  templateUrl: './employee.html',
  styleUrls: ['./Machine.scss']
})
export class Employee implements OnInit {
  navigations: Array<string> = ['主页', '档案管理', '用户管理'];
  companyId: string;
  settings: any;
  source: any[];
  operationObj: any;
  constructor(private gs: GlobalService, private es: EmployeeService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.formHideOberservers();
    this.createOperation();
    this.bindSettings();
    this.bindSource();
  }

  formHideOberservers() {
    this.es.employeeSubject.subscribe(() => {

    });
  }

  createOperation() {

  }

  bindSettings() {
    this.settings = {
      columns: [
        { field: 'userName', title: '注塑机编号' },
        { field: 'machineName', title: '注塑机名称' },
        { field: 'machineType', title: '注塑机类型' },
        { field: 'moniterId', title: '采集器编号' },
        { field: 'outFactoryPerson', title: '出厂调试人员' },
        { field: 'remark', title: '备注' },
      ],
      operation: [
        { type: 'edit', iconClass: 'fa-pencil', title: "编辑", callBack: this.operationObj.edit },
        { type: 'delete', iconClass: 'fa-trash', title: "停用", callBack: this.operationObj.delete },
        { type: 'reset', iconClass: 'fa-repeat', title: "重置密码", callBack: this.operationObj.reset },
      ],
      search: { search: "machineCode", name: "注塑机编号" },
    }
  }

  bindSource() {

  }
  // this.getEmployee(() => {
  //   var array = [];
  //   for (var i = 0; i < this.data.length; i++) {
  //     var item = { user_id: "", user_message: "", company: "", username: "", phone: "", note: "", state: "", id: "", password: "", roleid: "" };
  //     item.user_id = this.data[i].username;
  //     item.user_message = this.data[i].roleName;
  //     item.company = this.data[i].companyName;
  //     item.username = this.data[i].name;
  //     item.phone = this.data[i].phone;
  //     item.note = this.data[i].note;
  //     item.state = this.data[i].status == 0 ? "正常" : "停用";
  //     item.id = this.data[i].id;
  //     item.password = this.data[i].password;
  //     item.roleid = this.data[i].roleid;
  //     array.push(item); 
  //   }
  //   this.module_table_body = [].concat(array);
  // });
}