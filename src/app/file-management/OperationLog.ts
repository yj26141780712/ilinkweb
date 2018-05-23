import { Component, OnInit } from '@angular/core';
import {NavigationComponent} from '../produce-list/navigation';
import {SearchMachineidComponent} from '../search-machineid/search-machineid.component';
@Component({
  selector: 'operationLog',
  templateUrl: './operationLog.html',
  styleUrls: ['./Machine.scss']
})
export class OperationLog implements OnInit {
  navigations:Array<string>=['主页','档案管理','用户日志查询'];
  module_table_thead:Array<string>=['用户名','操作时间','操作界面','页面链接','备注'];
  module_table_body:Array<Object>=[
  {
    user:"宁波",
    time:"浙江，宁波",
    view:"1",
    href:"1",
    remarks:"1"
  }];
  module_table_attr:Array<string>=['user','time','view','href','remarks'];
  module_table_type:string="area";
  constructor() { }

  ngOnInit() {
  }

}