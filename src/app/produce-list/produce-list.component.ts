import { Component, OnInit } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';

import { NavigationComponent } from './navigation';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'app-produce-list',
  templateUrl: './produce-list.component.html',
  styleUrls: ['./produce-list.component.scss']
})
export class ProduceListComponent implements OnInit {
  data: any;
  companyId: any;
  MachineList: any = [];//全部机器
  page_data: Object[];//当前页机器
  machine_count: number;//机器总数
  current_page: number = 1;//当前页数
  total_page: number;//总页数
  navigations: Array<string> = ['主页', '监控管理', '机器图表'];
  constructor(private gs: GlobalService) {

  }

  ngOnInit() {
    this.getMachineCount(() => {
      for (var i = 0; i < this.data.length; i++) {
        var item = { name: '', sn: "", workstate: "", action: "", motor: "", electricHeat: "", modelNum: "", totalNum: "", fulltime: "", workhour: "", className: "" }
        item.name = this.data[i].name;
        item.sn = this.data[i].sn;
        item.workstate = this.data[i].workstate;
        item.action = this.data[i].action;
        item.electricHeat = this.data[i].electricHeat;
        item.modelNum = this.data[i].modelNum;
        item.totalNum = this.data[i].totalNum;
        item.fulltime = this.data[i].fulltime.toFixed(1);
        item.workhour = this.data[i].workhour;
        switch (this.data[i].workstate) {
          case "手动": // add by yangjie 2018-04-26
          case "停机":
            item.className = "stop";
            break;
          case "离线":
            item.className = "outline";
            break;
          case "警报":
            item.className = "warning";
            break;
          default:
            item.className = "normal";
            break;
        }
        this.MachineList.push(item);
      }
      this.machine_count = this.data.length;

      this.total_page = Math.ceil(this.machine_count / 15);
      this.page_data = this.MachineList.slice(0, 15);
    });
  }
  getMachineCount(callback): void {
    this.companyId = localStorage.getItem('companyId');
    //console.log(this.companyId)
    this.gs.httpGet(Global.domain + 'api/apideviceList.action?companyId=' + this.companyId || '', {}, json => {
      //根据companyId筛选
      var array = [];
      for (var i = 0; i < json.obj.length; i++) {
        if (json.obj[i].workstate != "离线") array.push(json.obj[i]);
      }
      for (var i = 0; i < json.obj.length; i++) {
        if (json.obj[i].workstate == "离线") array.push(json.obj[i]);
      }  // update by yangjie 2018-04-26 增加|| !this.companyId 优先显示非离线
      this.data = [].concat(array);
      callback();
    })
  }
  //剪切数据
  machine_list(cur) {
    return this.MachineList.slice((cur - 1) * 15, cur * 15);
  }
  //翻页的按钮点击
  prev() {
    if (this.current_page > 1) {
      this.current_page--;
      this.page_data = this.machine_list(this.current_page);
    }
  }
  next() {
    if (this.current_page < this.total_page) {
      this.current_page++;
      this.page_data = this.machine_list(this.current_page);
    }
  }
  first() {
    this.current_page = 1;
    this.page_data = this.machine_list(this.current_page);
  }
  last() {
    this.current_page = this.total_page;
    this.page_data = this.machine_list(this.current_page);
  }
}
