import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { ModuleTable } from '../produce-list/module-table';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'produceData',
  templateUrl: './produceData.html',
  styleUrls: ['./remotely.component.scss']
})
export class ProduceData implements OnInit {
  now_date: any;
  current_mid: any;
  timer: any;//定时器
  navigations: Array<string> = ['主页', '机器详情', '生产数据'];
  module_table_thead: Array<string> = ['序号'];
  module_table_body: Array<Object> = [];
  module_table_attr: Array<string> = ['id'];
  module_table_search = { search: "id", name: "序号" }
  module_table_type: string = "produceData";

  tableAddress = [
    ['zhipinshijian', '0x00160009', '全程计时'], //全程计时
    ['shechujishi', '0x10160002', '射出时间'], //射出时间
    ['shechuqidian', '0x10160003', '射出起点'], //射出起点
    ['shechuzhongdian', '0x10160004', '残料终点'], //残料终点
    ['chuliaojishi', '0x1016000A', '储料时间'],  //储料时间
    ['shchupingjunsudu', '0x10160013', '射出平均速度'],//射出平均速度
    ['baoyayidongsudu', '0x10160016', '保压位移'], //保压位移
    ['guanmojishi', '0x20160007', '关模计时'], //关模计时
    ['kaimoweizhi', '0x2016000D', '开模终点'], //开模终点
    ['kaimojishi', '0x2016000E', '开模计时'],//开模计时
  ];

  constructor(private gs: GlobalService) { }

  ngOnInit() {
    this.now_date = new Date().getTime();
    this.tableAddress.forEach(arr => {
      this.module_table_thead.push(arr[2]);
      this.module_table_attr.push(arr[0]);
    });
  }
  getProduceData() {
    this.gs.httpGet(Global.domain + 'api/remoteproductData.action?mid=' + this.current_mid + '&mtime=' + this.now_date, {}, json => {
      var array = [];
      for (var i = 0; i < json.obj.length; i++) {
        //var item = { id: 0, pro_time: "", shot_time: "", shot_begin: "", canliao_pos: "", chuliao_pos: "", shechu_speed: "", baoya_pos: "", guanmo_time: "", kaimo_end: "", kaimo_time: "" };
        let item = {};
        let mapValue = new Map(); //存储实时数据地址和值
        let mapName = new Map(); //存储实时数据地址和显示名称
        let name = {};
        json.obj[i].params.forEach(obj => {
          let _value = this.getValue(obj)
          mapValue.set(obj.addr, _value);
          mapName.set(obj.addr, obj.name);
        });
        item["id"] = i + 1;
        Global.AllEaddress.forEach(arr => {
          item[arr[0]] = mapValue.get(arr[1]);
          name[arr[0]] = mapName.get(arr[1]);
        });
        array.push(item);
      }
      this.module_table_body = [].concat(array);
    })
  }
  getMonitorEvent(mid) {
    this.current_mid = mid;
    this.module_table_body = [];
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.getProduceData();
      console.log(this.module_table_body);
    }, 5000);
  }

  /**
   * 获取参数对象的值
   * @param obj 参数对象 obj.point 保留小数的位数 
   */
  getValue(obj) {
    let _value = typeof obj.value == "number" ? Number(obj.value).toFixed(obj.point) + '' : obj.value + '';
    if (typeof obj.value == "number") {
      if ((obj.value + '').length > 4 && (obj.value + '').replace('.', '').includes('65534')) {
        _value = '-'
      }
    }
    return _value;
  }
}