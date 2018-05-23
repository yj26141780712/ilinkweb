import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GlobalService, Global } from './global';

@Injectable()
export class AreaService {

  public areaSubject = new Subject();
  constructor(private gs: GlobalService) { }

  /**
   * 获取片区列表
   * @param companyId 公司Id
   */
  getAreaList(companyId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiareas.action', {
      companyId: companyId
    });
  }

  /**
   * 新增片区
   * @param companyId 公司Id
   * @param obj 表单提交数据对象
   */
  addArea(companyId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiareaAdd.action', {
      'area.name': obj.areaName,
      'area.note': obj.remark,
      'area.companyid': companyId
    });
  }

  /**
   * 编辑片区
   * @param companyId 公司Id
   * @param areaId 片区Id
   * @param obj 编辑片区表单提交数据对象
   */
  editArea(companyId: string, areaId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiareaEdit.action', {
      'area.name': obj.areaName,
      'area.note': obj.remark,
      'area.id': areaId,
      'area.companyid': companyId
    });
  }

  /**
   * 删除片区
   * @param areaId 片区Id
   */
  deleteArea(areaId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiareaDel.action', {
      'areaId': areaId
    });
  }
}
