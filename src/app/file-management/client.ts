import { Global, GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
@Component({
  selector: 'Client',
  templateUrl: './client.html',
  styleUrls: ['./Machine.scss']
})
export class Client implements OnInit {
  companyId: any;
  data: any;
  navigations: Array<string> = ['主页', '档案管理', '客户管理'];
  module_table_thead: Array<string> = ['塑料厂ID', '塑料厂名称', '添加时间', '备注信息', '状态'];
  module_table_body: Array<Object> = [];
  module_table_attr: Array<string> = ['id', 'name', 'time', 'note', 'status'];
  module_table_type: string = "client";
  module_table_search = { search: "id", name: "塑料厂id" }
  constructor(private gs: GlobalService) {

  }

  ngOnInit() {
    this.companyId = localStorage.getItem('companyId');
    this.getClientData(() => {
      var array = [];
      for (var i = 0; i < this.data.length; i++) {
        var item = { id: '', name: '', time: '', note: '', status: '', clientid: "" };
        item.id = this.data[i].clientId;
        item.name = this.data[i].clientName;
        item.time = this.data[i].addDate;
        item.note = this.data[i].note;
        item.status = this.data[i].status;
        item.clientid = this.data[i].id;
        array.push(item);
      }
      this.module_table_body = [].concat(array);
    });
  }
  getClientData(callback) {
    this.gs.httpGet(Global.domain + 'api/apishowClients.action?companyId=' + this.companyId, {}, json => {
      this.data = json.obj;
      callback();
    })
  }
  getClient(msg) {//获取到添加成功或者修改的成功指令
    this.getClientData(() => {
      var array = [];
      for (var i = 0; i < this.data.length; i++) {
        var item = { id: '', name: '', time: '', note: '', status: '', clientid: "" };
        item.id = this.data[i].clientId;
        item.name = this.data[i].clientName;
        item.time = this.data[i].addDate;
        item.note = this.data[i].note;
        item.status = this.data[i].status;
        item.clientid = this.data[i].id;
        array.push(item);
      }
      this.module_table_body = [].concat(array);
    });
  }
}