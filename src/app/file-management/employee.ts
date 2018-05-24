import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
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
  bsModalRef: BsModalRef
  companyId: string;
  settings: any;
  source: any[];
  operationObj: any;
  constructor(private gs: GlobalService,
    private es: EmployeeService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.formHideOberservers();
    this.createOperation();
    this.bindSettings();
    this.bindSource();
  }

  formHideOberservers() {
    this.es.employeeSubject.subscribe(() => {
        this.bindSource();
    });
  }

  operation() {

  }

  createOperation() {
    let self = this;
    this.operation.prototype.edit = item => {
      let initialState = {
        item: item
      };
      self.bsModalRef = self.modalService.show(EmployeeFormComponent, { initialState });
    };
    this.operation.prototype.stop = item => {
      self.gs.confirm('确定停用吗？', '确定停用', '取消').then(value => {
        if (value) {
          self.es.stopEmployee(self.companyId, item.id).subscribe(json => {
            if (json.code == 200) {
              self.bindSource();
            }
          })
        }
      })
    };
    this.operation.prototype.start = item => {
      self.gs.confirm('确定启用吗？', '确定启用', '取消').then(value => {
        if (value) {
          self.es.startEmployee(self.companyId, item.id).subscribe(json => {
            if (json.code == 200) {
              self.bindSource();
            }
          });
        }
      })
    };
    this.operation.prototype.reset = item => {
      self.gs.confirm('将该用户密码重置为“123456”，确定吗？', '重置', '取消').then(value => {
        if (value) self.es.resetPassword(item.id).subscribe(json=>{
           console.log(json);
        });
      });
    };
    this.operationObj = new this.operation();
  }

  bindSettings() {
    this.settings = {
      columns: [
        { field: 'userName', title: '用户名称' },
        { field: 'roleName', title: '角色信息' },
        { field: 'companyName', title: '对应公司' },
        { field: 'name', title: '用户姓名' },
        { field: 'phone', title: '联系方式' },
        { field: 'remark', title: '备注' },
        { field: 'state', title: '状态' },
      ],
      operation: [
        { type: 'edit', iconClass: 'fa-pencil', title: "编辑", callBack: this.operationObj.edit },
        { type: 'stop', iconClass: 'fa-power-off', title: "停用", callBack: this.operationObj.stop, show: 'stop' },
        { type: 'start', iconClass: 'fa-power-off green', title: "启用", callBack: this.operationObj.start, show: 'start' },
        { type: 'reset', iconClass: 'fa-repeat', title: "重置密码", callBack: this.operationObj.reset },
      ],
      search: { search: "userName", name: "用户名称" },
    }
  }

  bindSource() {
    this.es.getEmployeeList(this.companyId).subscribe(json => {
      let data = json.obj;
      let array = [];
      for (var i = 0; i < data.length; i++) {
        var item: any = {};
        item.userName = data[i].username;
        item.roleName = data[i].roleName;
        item.companyName = data[i].companyName;
        item.name = data[i].name;
        item.phone = data[i].phone;
        item.remark = data[i].note;
        item.state = data[i].status == 0 ? "正常" : "停用";
        item.id = data[i].id;
        item.passWord = data[i].password;
        item.roleId = data[i].roleid;
        item.isShow = data[i].status == 0 ? 'stop' : 'start';
        array.push(item);
      }
      this.source = [].concat(array);
    });
  }

  add() {
    this.bsModalRef = this.modalService.show(EmployeeFormComponent);
  }

}