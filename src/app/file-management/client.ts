import { ClientService } from './../tools/services/client.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Global, GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { ClientFormComponent } from './client-form/client-form.component';

@Component({
  selector: 'Client',
  templateUrl: './client.html',
  styleUrls: ['./Machine.scss']
})
export class Client implements OnInit {
  companyId: any;
  navigations: Array<string> = ['主页', '档案管理', '客户管理'];
  bsModalRef: BsModalRef;
  settings: any;
  source: any[];
  operationObj: any;
  constructor(private gs: GlobalService,
    private cs: ClientService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.addSubmitObservers();
    this.createOperation()
    this.bindSettings();
    this.bindSource();
  }

  addSubmitObservers() {
    this.cs.clientSubject.subscribe(() => {
      this.bindSource();
    });
  }

  operation() {

  }

  createOperation() {
    let self = this;
    this.operation.prototype.edit = item => {
      let initialState = { item: item };
      self.bsModalRef = self.modalService.show(ClientFormComponent, { initialState });
    }
    this.operation.prototype.delete = item => {
      self.gs.confirmDel().then(value => {
        if (value) {
          self.cs.deleteClient(item.id);
        }
      });
    }
    this.operationObj = new this.operation();
  }

  bindSettings() {
    this.settings = {
      columns: [
        { field: 'clientCode', title: '塑料厂ID' },
        { field: 'clientName', title: '塑料厂名称' },
        { field: 'createTime', title: '添加时间' },
        { field: 'remark', title: '备注信息' },
        { field: 'clientState', title: '状态' },
      ],
      operation: [
        { type: 'edit', iconClass: 'fa-pencil', title: "编辑", callBack: this.operationObj.edit },
        { type: 'delete', iconClass: 'fa-trash', title: "删除", callBack: this.operationObj.delete },
      ],
      search: { search: "clientCode", name: "塑料厂ID" },
    }
  }

  bindSource() {
    this.cs.getClientList(this.companyId).subscribe(json => {
      if (json.code == 200) {
        let data = json.obj;
        var array = [];
        for (var i = 0; i < data.length; i++) {
          var item: any = {};
          item.clientCode = data[i].clientId;
          item.clientName = data[i].clientName;
          item.createTime = data[i].addDate;
          item.remark = data[i].note;
          item.clientState = data[i].status;
          item.id = data[i].id;
          array.push(item);
        }
        this.source = [].concat(array);
      }
    });
  }

  add() {
    this.bsModalRef = this.modalService.show(ClientFormComponent);
  }
}