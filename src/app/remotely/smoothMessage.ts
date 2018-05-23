import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'smoothMessage',
  templateUrl: './smoothMessage.html',
  styleUrls: ['./remotely.component.scss']
})
export class SmoothMessage implements OnInit {
  data: any;
  current_mid: any;
  navigations: Array<string> = ['主页', '机器详情', '润滑信息'];
  module_table_thead: Array<string> = ['设备名', '开模数', '开始时间', '结束时间', '部件', '备注'];
  module_table_body = [];
  module_table_search = { search: "m_name", name: "设备名" }
  module_table_attr: Array<string> = ['m_name', 'count', 'stime', 'etime', 'component', 'remarks'];
  constructor(private gs: GlobalService) {
    // let time = '2018-05-03T00:00:00';
    // console.log(moment(time).format("YYYY-MM-DD HH:mm:ss"))
  }

  ngOnInit() {

  }
  getMonitorEvent(mid) {
    this.current_mid = mid;
    this.getSmoothData(() => {
      var array = [];
      //对对象重新封装
      for (var i = 0; i < this.data.length; i++) {
        var Machine_item = { m_name: "", count: "", stime: "", etime: "", component: "", remarks: "" };
        Machine_item.m_name = this.data[i].name;
        Machine_item.count = this.data[i].num;
        Machine_item.stime = moment(this.data[i].starttime).format("YYYY-MM-DD HH:mm:ss"); //update by yangjie 20180504 修改时间
        Machine_item.etime = moment(this.data[i].endtime).format("YYYY-MM-DD HH:mm:ss");
        Machine_item.component = this.data[i].part;
        Machine_item.remarks = this.data[i].note;
        array.push(Machine_item);
      }
      this.module_table_body = [].concat(array);
    });
  }
  getSmoothData(callback) {
    //console.log(123);
    this.gs.httpGet(Global.domain + 'api/apismoothList.action?mid=' + this.current_mid, {}, json => {
      this.data = json.obj;
      callback();
    })
  }
  //按时间搜索
  searchData(begin, end) {
    //console.log(this.module_table_body);
    var array = [];
    for (var i = 0; i < this.data.length; i++) {
      if (moment(begin.value).isBefore(this.data[i].stime) && moment(end.value).isAfter(this.data[i].etime)) {
        var Machine_item = { m_name: "", count: "", stime: "", etime: "", component: "", remarks: "" };
        Machine_item.m_name = this.data[i].name;
        Machine_item.count = this.data[i].num;
        Machine_item.stime = moment(this.data[i].starttime).format("YYYY-MM-DD HH:mm:ss"); //update by yangjie 20180504 修改时间
        Machine_item.etime = moment(this.data[i].endtime).format("YYYY-MM-DD HH:mm:ss");
        Machine_item.component = this.data[i].part;
        Machine_item.remarks = this.data[i].note;
        array.push(Machine_item);
      }
    }
    this.module_table_body = [].concat(array);
    //console.log(moment(begin.value).format());
  }
}