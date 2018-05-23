import { Component, OnInit } from '@angular/core';
import { NavigationComponent } from '../produce-list/navigation';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { SearchMachineidComponent } from '../search-machineid/search-machineid.component';
import { Global, GlobalService } from '../tools/services/global';
@Component({
  selector: 'paramMessage',
  templateUrl: './paramMessage.html',
  styleUrls: ['./remotely.component.scss']
})
export class ParamMessage implements OnInit {
  current_mid: any;//当前机器
  normal: boolean = true;
  MData = {};//当前机器的参数集合
  AllData = {};//全单参数集合
  addressArray: any = [["Code0", "0x00120000"],
  ["Code1", "0x00120001"],
  ["Code2", "0x00120002"],
  ["Code3", "0x00120003"],
  ["Code4", "0x00120004"],
  ["Code5", "0x00120005"],
  ["Code43", "0x00120006"],
  ["Code44", "0x00120007"],
  ["Code48", "0x00120008"],
  ["Code49", "0x00120009"],
  ["Code50", "0x0012000A"],
  ["Code51", "0x0012000B"],
  ["Code52", "0x0012000C"],
  ["Code53", "0x0012000D"],
  ["Code54", "0x0012000E"],
  ["Code8", "0x0012000F"],
  ["Code9", "0x00120010"],
  ["Code10", "0x00120011"],
  ["guobiao", "0x00120013"],
  ["Code6", "0x00120018"],
  ["Code7", "0x00120019"],
  ["Code11", "0x0012001A"],
  ["Code12", "0x0012001B"],
  ["Code13", "0x0012001C"],
  ["xitongyalishangxian", "0x00120021"],
  ["chuliaoRPMkongshu", "0x00120023"],
  ["tuilizuoxinghao", "0x00120026"],
  ["wendushedingzhi1", "0x05130000"],
  ["wendushedingzhi2", "0x05130001"],
  ["wendushedingzhi3", "0x05130002"],
  ["wendushedingzhi4", "0x05130003"],
  ["wendushedingzhi5", "0x05130004"],
  ["wendushedingzhi6", "0x05130005"],
  ["wendushedingzhi7", "0x05130006"],
  ["wendushedingzhi8", "0x05130007"],
  ["chuliaoqianshetuishijian", "0x10130013"],
  ["shechu1duanyali", "0x10140000"],
  ["shechu2duanyali", "0x10140001"],
  ["shechu3duanyali", "0x10140002"],
  ["shechu4duanyali", "0x10140003"],
  ["baoya1duanyali", "0x1014000A"],
  ["baoya2duanyali", "0x1014000B"],
  ["baoya3duanyali", "0x1014000C"],
  ["baoya4duanyali", "0x1014000D"],
  ["baoya5duanyali", "0x1014000D"],
  ["shechu1duanliuliang", "0x10140014"],
  ["shechu2duanliuliang", "0x10140015"],
  ["shechu3duanliuliang", "0x10140016"],
  ["shechu4duanliuliang", "0x10140017"],
  ["baoya1duanliuliang", "0x1014001E"],
  ["baoya2duanliuliang", "0x1014001F"],
  ["baoya3duanliuliang", "0x10140020"],
  ["baoya4duanliuliang", "0x10140021"],
  ["baoya5duanliuliang", "0x10140022"],
  ["baoya1duanjishi", "0x10140032"],
  ["baoya2duanjishi", "0x10140033"],
  ["baoya3duanjishi", "0x10140034"],
  ["baoya4duanjishi", "0x10140035"],
  ["baoya5duanjishi", "0x10140036"],
  ["shechu1duanzhongzhiweizhi", "0x1014003C"],
  ["shechu2duanzhongzhiweizhi", "0x1014003D"],
  ["shechu3duanzhongzhiweizhi", "0x1014003E"],
  ["shechu4duanzhongzhiweizhi", "0x1014003F"],
  ["chuliao1duanyali", "0x10140046"],
  ["chuliao2duanyali", "0x10140047"],
  ["chuliao3duanyali", "0x10140048"],
  ["chuliao1duanbeiyayali", "0x1014004B"],
  ["chuliao2duanbeiyayali", "0x1014004C"],
  ["chuliao3duanbeiyayali", "0x1014004D"],
  ["chuliao1duanliuliang", "0x10140050"],
  ["chuliao2duanliuliang", "0x10140051"],
  ["chuliao3duanliuliang", "0x10140052"],
  ["chuliao1duanzhongzhiweizhi", "0x10140055"],
  ["chuliao2duanzhongzhiweizhi", "0x10140056"],
  ["chuliao3duanzhongzhiweizhi", "0x10140057"],
  ["shetuiyali", "0x1014005A"],
  ["shetuiliuliang", "0x1014005B"],
  ["shetuizhongzhiweizhi", "0x1014005C"],
  ["yali_guanmoyiduan", "0x20140000"],
  ["yali_guanmoerduan", "0x20140001"],
  ["yali_guanmosanduan", "0x20140002"],
  ["yali_diyamobao", "0x20140003"],
  ["yali_gaoyamosuo", "0x20140004"],
  ["sudu_guanmoyiduan", "0x20140005"],
  ["sudu_guanmoerduan", "0x20140006"],
  ["sudu_guanmosanduan", "0x20140007"],
  ["sudu_diyamobao", "0x20140008"],
  ["sudu_gaoyamosuo", "0x20140009"],
  ["zhongzhiweizhi_guanmoyiduan", "0x2014000A"],
  ["zhongzhiweizhi_guanmoerduan", "0x2014000B"],
  ["zhongzhiweizhi_guanmosanduan", "0x2014000C"],
  ["zhongzhiweizhi_diyamobao", "0x2014000D"],
  ["yali_kaimoyiduan", "0x2014000E"],
  ["yali_kaimoerduan", "0x2014000F"],
  ["yali_kaimosanduan", "0x20140010"],
  ["yali_kaimosiduan", "0x20140011"],
  ["yali_kaimozhongzhi", "0x20140012"],
  ["sudu_kaimoyiduan", "0x20140013"],
  ["sudu_kaimoerduan", "0x20140014"],
  ["sudu_kaimosanduan", "0x20140015"],
  ["sudu_kaimosiduan", "0x20140016"],
  ["sudu_kaimozhongzhi", "0x20140017"],
  ["zhongzhiweizhi_kaimoyiduan", "0x20140018"],
  ["zhongzhiweizhi_kaimoerduan", "0x20140019"],
  ["zhongzhiweizhi_kaimosanduan", "0x2014001A"],
  ["zhongzhiweizhi_kaimosiduan", "0x2014001B"],
  ["zhongzhiweizhi_kaimozhongzhi", "0x2014001C"],
  ["tuomojinyanchijishi", "0x21130000"],
  ["tuomotuiyanchijishi", "0x21130001"],
  ["tuojin1duanyali", "0x21140000"],
  ["tuomojinyali", "0x21140001"],
  ["tuotui1duanyali", "0x21140002"],
  ["tuotui2duanyali", "0x21140003"],
  ["tuojin1duanliuliang", "0x21140004"],
  ["tuojin2duanliuliang", "0x21140005"],
  ["tuotui1duanliuliang", "0x21140006"],
  ["tuotui2duanliuliang", "0x21140007"],
  ["tuojin1duanzhongzhiweizhi", "0x21140008"],
  ["tuojin2duanzhongzhiweizhi", "0x21140009"],
  ["tuotui1duanzhongzhiweizhi", "0x2114000A"],
  ["tuotui2duanzhongzhiweizhi", "0x2114000B"]];//
  AllEaddress: any = [["Code0", "0x00120000"],
  ["Code1", "0x00120001"],
  ["Code2", "0x00120002"],
  ["Code3", "0x00120003"],
  ["Code4", "0x00120004"],
  ["Code5", "0x00120005"],
  ["Code43", "0x00120006"],
  ["Code44", "0x00120007"],
  ["Code48", "0x00120008"],
  ["Code49", "0x00120009"],
  ["Code50", "0x0012000A"],
  ["Code51", "0x0012000B"],
  ["Code52", "0x0012000C"],
  ["Code53", "0x0012000D"],
  ["Code54", "0x0012000E"],
  ["Code8", "0x0012000F"],
  ["Code9", "0x00120010"],
  ["Code10", "0x00120011"],
  ["guobiao", "0x00120013"],
  ["Code6", "0x00120018"],
  ["Code7", "0x00120019"],
  ["Code11", "0x0012001A"],
  ["Code12", "0x0012001B"],
  ["Code13", "0x0012001C"],
  ["xitongyalishangxian", "0x00120021"],
  ["chuliaoRPMkongshu", "0x00120023"],
  ["tuilizuoxinghao", "0x00120026"],
  ["guanmoweizhi1", "0x2014000A"],
  ["guanmoweizhi2", "0x2014000B"],
  ["guanmoweizhi3", "0x2014000C"],
  ["guanmoweizhi4", "0x2014000D"],
  ["guanmosudu1", "0x20140005"],
  ["guanmosudu2", "0x20140006"],
  ["guanmosudu3", "0x20140007"],
  ["guanmosudu4", "0x20140008"],
  ["guanmosudu5", "0x20140009"],
  ["guanmojishidiya", "0x20130012"],
  ["guanmojishigaoya", "0x20130013"],
  ["kaimoweizhi5", "0x2014001C"],
  ["kaimoweizhi4", "0x2014001B"],
  ["kaimoweizhi3", "0x2014001A"],
  ["kaimoweizhi2", "0x20140019"],
  ["kaimoweizhi1", "0x20140018"],
  ["kaimosudu5", "0x20140017"],
  ["kaimosudu4", "0x20140016"],
  ["kaimosudu3", "0x20140015"],
  ["kaimosudu2", "0x20140014"],
  ["kaimosudu1", "0x20140013"],
  ["kaimojishi", "0x2013000D"],
  ["shechuweizhi5", "0x10130004"],
  ["shechuweizhi4", "0x1014003F"],
  ["shechuweizhi3", "0x1014003E"],
  ["shechuweizhi2", "0x1014003D"],
  ["shechuweizhi1", "0x1014003C"],
  ["shechusudu5", "0x10140018"],
  ["shechusudu4", "0x10140017"],
  ["shechusudu3", "0x10140016"],
  ["shechusudu2", "0x10140015"],
  ["shechusudu1", "0x10140014"],
  ["shechuyali", "0x10140000"],
  ["baoyashijian4", "0x10140035"],
  ["baoyashijian3", "0x10140034"],
  ["baoyashijian2", "0x10140033"],
  ["baoyashijian1", "0x10140032"],
  ["baoyayali4", "0x1014000D"],
  ["baoyayali3", "0x1014000C"],
  ["baoyayali2", "0x1014000B"],
  ["baoyayali1", "0x1014000A"],
  ["baoyasudu", "0x1014001E"],
  ["chuliaoweizhi0", "0x10140057"],
  ["chuliaoweizhi1", "0x10140050"],
  ["chuliaoweizhi2", "0x10140051"],
  ["chuliaoweizhi3", "0x10140052"],
  ["chuliaoweizhi4", "0x10140058"],
  ["chuliaobeiya1", "0x10140046"],
  ["chuliaobeiya2", "0x10140047"],
  ["chuliaobeiya3", "0x10140048"],
  ["chuliaosudu0", "0x10140055"],
  ["chuliaosudu1", "0x1014004B"],
  ["chuliaosudu2", "0x1014004C"],
  ["chuliaosudu3", "0x1014004D"],
  ["chuliaosudu4", "0x10140056"],
  ["tuojinweizhi1", "0x21140009"],
  ["tuojinweizhi2", "0x2114000A"],
  ["tuotuiweizhi2", "0x2114000C"],
  ["tuotuiweizhi1", "0x2114000B"],
  ["tuojinxingcheng1", "0x2114000D"],
  ["tuojinxingcheng2", "0x2114000E"],
  ["tuotuixingcheng2", "0x21140010"],
  ["tuotuixingcheng1", "0x2114000F"],
  ["tuojinsudu1", "0x21140005"],
  ["tuojinsudu2", "0x21140006"],
  ["tuotuisudu2", "0x21140008"],
  ["tuotuisudu1", "0x21140007"],
  ["wendushedingzhi1", "0x05130000"],
  ["wendushedingzhi2", "0x05130001"],
  ["wendushedingzhi3", "0x05130002"],
  ["wendushedingzhi4", "0x05130003"],
  ["wendushedingzhi5", "0x05130004"],
  ["wendushedingzhi6", "0x05130005"],
  ["wendushedingzhi7", "0x05130006"],
  ["wendushedingzhi8", "0x05130007"]];
  navigations: Array<string> = ['主页', '远程控制', '参数配置'];
  constructor(private gs: GlobalService) {

  }

  ngOnInit() {
  }
  getParamData() {
    this.gs.httpGet(Global.domain + 'api/deviceInfo.action?mid=' + this.current_mid, {}, json => {
      if (json.obj.modelName == '全电')//原来是全电 
      {
        this.normal = false;
        this.gs.httpGet(Global.domain + 'api/remoteparamGet.action?mid=' + this.current_mid, {}, json => {
          //console.log(json);
          var data = json.obj;
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.AllEaddress.length; j++) {
              if (this.AllEaddress[j][1] == data[i].addr) {
                if (this.AllEaddress[j][0].indexOf('Code') == -1) {
                  //console.log(Number(data[i].value).toFixed(data[i].point));                
                  let _value = this.getValue(data[i]);
                  this.AllData[this.AllEaddress[j][0]] = _value;
                } else {
                  this.AllData[this.AllEaddress[j][0]] = data[i].value.toString(16);
                }
              }
            }
          }
        })
      } else if (json.obj.modelName == '328机型') {//普通机型
        this.normal = true;
        this.gs.httpGet(Global.domain + 'api/remoteparamGet.action?mid=' + this.current_mid, {}, json => {
          var data = json.obj;
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < this.addressArray.length; j++) {
              if (this.addressArray[j][1] == data[i].addr) {
                if (this.addressArray[j][0].indexOf('Code') == -1) {
                  let _value = typeof data[i].value == "number" ? Number(data[i].value).toFixed(data[i].point) + '' : '';
                  if (typeof data[i].value == "number") {
                    if ((data[i].value + '').length > 4 && (data[i].value + '').replace('.', '').includes('65534')) {
                      //判断值是否65534 true 显示-
                      _value = '-'
                    }
                  }
                  this.MData[this.addressArray[j][0]] = _value;
                } else {
                  this.MData[this.addressArray[j][0]] = data[i].value.toString(16);
                }
              }
            }
          }
        })
      }
    });

  }
  getMonitorEvent(mid) {
    this.current_mid = mid;
    //清空
    for (var i = 0; i < this.addressArray.length; i++) {
      this.MData[this.addressArray[i][0]] = "0.0";
    }
    this.getParamData();
  }
  refresh() {
    for (var i = 0; i < this.addressArray.length; i++) {
      this.MData[this.addressArray[i][0]] = "0.0";
    }
    this.getParamData();
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