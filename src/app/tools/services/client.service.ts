import { GlobalService, Global } from './global';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ClientService {

  public clientSubject = new Subject();

  constructor(private gs: GlobalService) { }

  /**
   * 获取客户列表信息
   * @param companyId 公司Id
   */
  getClientList(companyId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apishowClients.action', {
      companyId: companyId
    })
  }

  /**
   * 新增客户
   * @param companyId 公司Id
   * @param obj 客户信息的数据对象 
   */
  addClient(companyId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apisaveClient.action', {
      'client.clientId': obj.clientCode,
      'client.clientName': obj.clientName,
      'client.status': obj.clientState == 0 ? "正常" : "停用",
      'client.note': obj.remark,
      'companyId': companyId
    });
  }

  /**
   * 修改客户
   * @param clientId 客户Id
   * @param obj 客户信息的数据对象 
   */
  editClient(clientId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apisaveClient.action', {
      'client.id': clientId,
      'client.clientId': obj.clientCode,
      'client.clientName': obj.clientName,
      'client.status': obj.clientState == 0 ? "正常" : "停用",
      'client.note': obj.remark,
    })
  }

  /**
   * 删除客户
   * @param clientId 客户Id
   */
  deleteClient(clientId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apidelClient.action', {
      'client.id': clientId,
    });
  }
}
