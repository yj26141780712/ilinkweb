import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'shutDown',
  templateUrl: './ShutDown.html',
  styleUrls: ['./remotely.component.scss']
})
export class ShutDown implements OnInit {
  error: boolean = false;
  warning: boolean = false;
  success: boolean = false;
  current_mid: boolean;//当前mid
  isStop: boolean = false;//是否停机
  msg: boolean;//消息
  openMessage: any = { code: "", out: "", curr: "", count: "", password: "" };
  navigations: Array<string> = ['主页', '远程控制', '停机控制'];
  constructor(private gs: GlobalService, private http: Http) { }

  ngOnInit() {

  }
  ngAfterViewInit() {
    var date = moment().format('YYYY-MM-DD');
    $('#stop_0').attr('value', date);
    $('#stop_1').attr('value', date);
  }
  getMonitorEvent(mid) {
    this.current_mid = mid;
    this.gs.httpGet(Global.domain + 'api/remotepayGet.action?mid=' + mid, {}, json => {
      this.error = false;
      this.warning = false;
      this.success = false;
      $('.enabled').attr('disabled', "true");
      $('#method').addClass('stop');
      $('#feature').attr('disabled', "true").addClass('stop');
      if (json.code == 200) {
        $('#feature').removeAttr('disabled').removeClass('stop');
        if (json.obj.stop == 1) {
          this.isStop = true;
          this.openMessage.code = json.obj.sn;
          this.openMessage.out = json.obj.cycle1.substring(0, 10);
          this.openMessage.curr = json.obj.curNum;
          this.openMessage.count = json.obj.num;
        } else {
          this.isStop = false;
        }
      } else if (json.code == 500) {
        this.error = true;
        this.msg = json.msg;
        $('.enabled').attr('disabled', "true");
        $('#method').addClass('stop');
      } else if (json.code == 501) {
        this.warning = true;
        this.msg = json.msg;
      }
    })
  }
  //select的change事件
  changeFeature(dom) {
    if (dom.value == "1") {
      $('.enabled').removeAttr('disabled');
      $('#method').removeClass('stop');
    } else {
      $('.enabled').attr('disabled', "true");
      $('#method').addClass('stop');
    }
    //console.log(dom.value);
  }
  //提交停机数据
  submitStopMessage(stop, method, num, hour, minute, days, sn, identifier, output, cycle1, cycle2, cycle3, cycle4, cycle5, cycle6) {
    var dayNum = days.value == "" ? "0" : days.value;
    this.gs.httpPost(Global.domain + 'api/remotepaySet.action?',
      "mid=" + this.current_mid + "&p.stop=" + stop.value + "&p.style=" + method.value + "&p.num=" + num.value + "&p.hour="
      + hour.value + "&p.minute=" + minute.value + "&p.days=" + dayNum + "&p.sn=" + sn.value + "&p.identifier="
      + identifier.value + "&p.output=" + output.value + "&p.cycle1="
      + cycle1.value + "&p.cycle2=" + cycle2.value + "&p.cycle3=" + cycle3.value + "&p.cycle4=" + cycle4.value + "&p.cycle5=" + cycle5.value + "&p.cycle6=" + cycle6.value + ""
      , json => {
        if (json.code == 200) {
          this.success = true;
          this.msg = json.msg;
          this.isStop = true;
          this.openMessage.code = sn.value;
          this.openMessage.out = output.value;
          this.openMessage.curr = num.value;
          this.openMessage.count = dayNum;
        }
      })
  }
  //提交解码信息
  sendOpenMessage(code) {
    this.gs.httpGet(Global.domain + 'api/remotesendCode.action?mid=' + this.current_mid + '&code=' + code.value, {}, json => {
      if (json.code == 200) {
        this.success = true;
        this.msg = json.msg;
        this.isStop = false;
        this.getMonitorEvent(this.current_mid);
      } else if (json.code == 500) {
        this.error = true;
        this.msg = json.msg;
      } else if (json.code == 501) {
        this.warning = true;
        this.msg = json.msg;
      }
    });
  }
  //select
  open(method, num) {
    if (method.value == 0 && num.value >= 2)//间隔天数
    {
      $('#day').removeAttr('disabled');
    } else {
      $('#day').attr('disabled', "true");
    }
    if (method.value == 2 && num.value >= 1 && num.value <= 6) {
      var N = num.value;
      for (var i = 0; i <= N; i++) {
        $("#stop_" + i + "").removeAttr('disabled');
      }
      for (var j = 6; j > N; j--) {
        $("#stop_" + j + "").attr('disabled', 'true');
      }
    }
    if (method.value != 2) {
      for (var i = 2; i <= 6; i++) {
        $("#stop_" + i + "").attr('disabled', 'true');
      }
    }
  }
  //失去焦点
  openDays(method, num) {
    if (method.value == 0 && num.value >= 2)//间隔天数
    {
      $('#day').removeAttr('disabled');
    } else {
      $('#day').attr('disabled', "true");
    }

    if (method.value == 2 && num.value >= 1 && num.value <= 6)//2-6日期启动
    {
      var N = num.value;
      for (var i = 0; i <= N; i++) {
        $("#stop_" + i + "").removeAttr('disabled');
      }
      for (var j = 6; j > N; j--) {
        $("#stop_" + j + "").attr('disabled', 'true');
      }
    }
    if (num.value > 6 || num.value < 1) {
      $('#sep_count').siblings('i').show();
    } else {
      $('#sep_count').siblings('i').hide();
    }
  }
  //input非空判断
  nonEmpty() {

  }
}