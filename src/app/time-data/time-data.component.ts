import { GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as echarts from 'echarts';
import * as $ from 'jquery';
import { Global } from '../tools/services/global';

@Component({
  selector: 'app-time-data',
  templateUrl: './time-data.component.html',
  styleUrls: ['./time-data.component.scss']
})
export class TimeDataComponent implements OnInit {
  Mapmid: number;//百度地图采集器编号
  midId: any;//当前mid
  detailMachine: any = { state: "", action: "", motor: "", electricHeat: "", modelNum: "", totalNum: "", fulltime: "", totalhour: "", workstate: "", percentage: "", workhour: "", statusList: [], workingList: [] };//当前详细数据
  temperatureData: any = [];
  constructor(private gs: GlobalService, private route: ActivatedRoute) { }

  ngOnInit() {
    let monitor = this.route.queryParams.subscribe(params => {
      this.Mapmid = params['mid'];
    })
    this.equipment();
    this.communicate();
  }
  equipment() {
    let equipment_view: any = document.getElementById('equipment_view');
    var run_m = echarts.init(equipment_view);
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}'
      },//信息提示框
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0时', '3时', '6时', '9时', '12时', '15时', '18时', '21时', '24时']
      },
      yAxis: {
        type: 'category',
        data: ['', '离线', '在线'],
        boundaryGap: false//是否留白
      },
      series: [
        {
          name: '残料位置',
          type: 'line',
          stack: '总量',
          data: [1, 1, 2, 1, 1, 2, 2, 2, 1],
          itemStyle: {
            normal: {
              color: "#ffcc00"
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#ffcc00'
              }, {
                offset: 1,
                color: '#fff6cb'
              }])
            }
          }
        }
      ]
    };
    run_m.setOption(option);
  }
  communicate() {
    let communicate_view: any = document.getElementById('communicate_view');
    var run_m = echarts.init(communicate_view);
    var option = {
      tooltip: {
        trigger: 'axis',
        formatter: '{b}'
      },//信息提示框
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '0%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['0时', '3时', '6时', '9时', '12时', '15时', '18时', '21时', '24时']
      },
      yAxis: {
        type: 'category',
        data: ['', '连接', '未连接'],
        boundaryGap: false//是否留白
      },
      series: [
        {
          name: '残料位置',
          type: 'line',
          stack: '总量',
          data: [1, 1, 2, 1, 1, 2, 2, 2, 1],
          itemStyle: {
            normal: {
              color: "#0471e1"
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#0471e1'
              }, {
                offset: 1,
                color: '#05b9dd'
              }])
            }
          }
        }
      ]
    };
    run_m.setOption(option);
  }
  
  getMonitorEvent(monitor) {
    this.midId = monitor;
    this.getTempData();
    this.getData();
    //this.getstatusData();
  }

  /**
   * 设备当前状态 当前状态 马达状态等
   */
  getData() {
    this.gs.httpGet(Global.domain + 'api/deviceInfo.action?mid=' + this.midId, {}, json => {
      var data = json.obj;
      this.detailMachine.state = data.state;//状态、、警报状态
      this.detailMachine.action = data.action;//当前动作
      this.detailMachine.motor = data.motor;//马达
      this.detailMachine.electricHeat = data.electricHeat;//电热
      this.detailMachine.modelNum = data.modelNum;//当前模数
      this.detailMachine.totalNum = data.totalNum;//总开模数
      this.detailMachine.fulltime = data.fulltime.toFixed(1);//全程计时
      this.detailMachine.totalhour = data.totalhour;//总开机时间
      this.detailMachine.workstate = data.workstate;//工作状态
      this.detailMachine.workhour = data.workhour;//本次开机
      this.detailMachine.percentage = data.totalhour > 0 ? (data.workhour / data.totalhour).toFixed(1) : 0.0;//进度条百分比
      //console.log(data);
      //设置进度条
      $('#progress').width(this.detailMachine.percentage * 100 + "%");
      $('#progress').html(this.detailMachine.percentage * 100 + "%");
    })
  }

  getstatusData() {//接口有问题
    this.gs.httpGet(Global.domain + 'api/remoteproductData.action?mid=' + this.midId + '&mtime=1&', {}, json => {

    })
  }

  /**
   * 料筒温度
   */
  getTempData() {
    this.gs.httpGet(Global.domain + 'api/deviceTemp.action?mid=' + this.midId, {}, json => {
      var data = json.obj.params;
      this.temperatureData = [].concat();
      if (json.code == 200) {
        for (var i = 0; i < data.length; i++) {
          var item = { className: "", value: "" };
          item.value = data[i].value;
          if (data[i].value >= 0 && data[i].value <= 100) {
            item.className = "gray";
          } else if (data[i].value > 100 && data[i].value <= 200) {
            item.className = "blue";
          } else if (data[i].value > 200 && data[i].value <= 300) {
            item.className = "yellow";
          } else if (data[i].value > 300 && data[i].value <= 400) {
            item.className = "orange";
          } else if (data[i].value > 400 && data[i].value <= 500) {
            item.className = "red";
          }
          this.temperatureData.push(item);
        }
      } else {
        for (var i = 0; i < 8; i++) {
          var item = { className: "gray", value: "0.00" };
          this.temperatureData.push(item);
        }
      }
    })
  }
}
