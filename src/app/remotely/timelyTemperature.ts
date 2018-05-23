import { GlobalService } from './../tools/services/global';
import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import * as echarts from 'echarts';//引入echarts的变量
import * as moment from 'moment';
import * as $ from 'jquery';
import { Global } from '../tools/services/global';
@Component({
  selector: 'timelyTemperature',
  templateUrl: './timelyTemperature.html',
  styleUrls: ['./remotely.component.scss']
})
export class TimelyTemperature implements OnInit {
  current_mid: number;
  data: any = [];//当前数据
  array = [];
  timer: any;//定时器
  temperature_data: any = [[], [], [], [], [], [], [], []];
  current_temp: any = { temp_0: "", temp_1: "", temp_2: "", temp_3: "", temp_4: "", temp_5: "", temp_6: "", temp_7: "" };//当前温度
  navigations: Array<string> = ['主页', '机器详情', '实时温度'];
  module_table_thead: Array<string> = ['时间', '油温', '温度1', '温度2', '温度3', '温度4', '温度5', '温度6', '温度7'];
  module_table_body = [];
  module_table_attr: Array<string> = ['time', 'temp_0', 'temp_1', 'temp_2', 'temp_3', 'temp_4', 'temp_5', 'temp_6', 'temp_7'];
  module_table_search = { search: "time", name: "时间" }
  constructor(private gs: GlobalService) {
  }

  ngOnInit() {
    this.module_table_body = [];
  }

  temperature(temp0, temp1, temp2, temp3, temp4, temp5, temp6, temp7) {
    let temperatrue_table: any = document.getElementById('temperatrue_table');
    var run_m = echarts.init(temperatrue_table);
    var option = {
      title: {
        text: '动态温度变化'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          animation: false
        },
        position: function (point, params, dom, rect, size) {
          return [point[0], '10%'];
        }
      },
      legend: {
        data: ['油温', '温度1', '温度2', '温度3', '温度4', '温度5', '温度6', '温度7'],
        left: '15',
        top: '50',
        orient: 'vertical',
      },
      grid: {
        left: '15%',
        top: '10%'
      },
      xAxis: {
        type: 'time',
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        splitLine: {
          show: false
        }
      },
      series: [{
        name: '油温',
        type: 'line',
        showSymbol: false,
        hoverAnimation: false,
        data: temp0
      }, {
        name: '温度1',
        type: "line",
        data: temp1
      }, {
        name: '温度2',
        type: "line",
        data: temp2
      }, {
        name: '温度3',
        type: "line",
        data: temp3
      }, {
        name: '温度4',
        type: "line",
        data: temp4
      }, {
        name: '温度5',
        type: "line",
        data: temp5
      }, {
        name: '温度6',
        type: "line",
        data: temp6
      }, {
        name: '温度7',
        type: "line",
        data: temp7
      }]
    };
    run_m.setOption(option);
  }

  getMonitorEvent(mid) {
    this.current_mid = mid;
    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.getTemparature(() => {
        //对对象重新封装
        var Machine_item = { time: "", temp_0: "", temp_1: "", temp_2: "", temp_3: "", temp_4: "", temp_5: "", temp_6: "", temp_7: "" };
        Machine_item.time = moment(this.data.mtime).utc().zone(-8).format('YYYY-MM-DD HH:mm:ss');
        for (var i = 0; i < this.data.params.length; i++) {
          Machine_item["temp_" + i] = this.data.params[i].value;
        }
        this.array.unshift(Machine_item);
        this.module_table_body = [].concat(this.array);

        this.temperature(this.temperature_data[0], this.temperature_data[1], this.temperature_data[2], this.temperature_data[3], this.temperature_data[4], this.temperature_data[5], this.temperature_data[6], this.temperature_data[7]);
      });
    }, 5000);

  }

  getTemparature(callback) {
    this.gs.httpGet(Global.domain + 'api/deviceTemp.action?mid=' + this.current_mid, {}, json => {
      this.data = json.obj;
      //console.log(this.data);
      if (json.code == 200) {
        this.current_temp = { temp_0: "0", temp_1: "0", temp_2: "0", temp_3: "0", temp_4: "0", temp_5: "0", temp_6: "0", temp_7: "0" };
        this.current_temp.temp_0 = json.obj.params[0].value;
        this.current_temp.temp_1 = json.obj.params[1].value;
        this.current_temp.temp_2 = json.obj.params[2].value;
        this.current_temp.temp_3 = json.obj.params[3].value;
        this.current_temp.temp_4 = json.obj.params[4].value;
        this.current_temp.temp_5 = json.obj.params[5].value;
        this.current_temp.temp_6 = json.obj.params[6].value;
        this.current_temp.temp_7 = json.obj.params[7].value;
        //动态echart的数据
        var temp0 = [this.data.mtime, this.data.params[0].value];
        var temp1 = [this.data.mtime, this.data.params[1].value];
        var temp2 = [this.data.mtime, this.data.params[2].value];
        var temp3 = [this.data.mtime, this.data.params[3].value];
        var temp4 = [this.data.mtime, this.data.params[4].value];
        var temp5 = [this.data.mtime, this.data.params[5].value];
        var temp6 = [this.data.mtime, this.data.params[6].value];
        var temp7 = [this.data.mtime, this.data.params[7].value];
        this.temperature_data[0].push(temp0);
        this.temperature_data[1].push(temp1);
        this.temperature_data[2].push(temp2);
        this.temperature_data[3].push(temp3);
        this.temperature_data[4].push(temp4);
        this.temperature_data[5].push(temp5);
        this.temperature_data[6].push(temp6);
        this.temperature_data[7].push(temp7);
        callback();
      } else {

      }
    })
  }
}