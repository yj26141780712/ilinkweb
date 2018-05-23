import { Company } from './../../file-management/company';
import { GlobalService, Global } from './global';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CompanyService {

  public companySubject = new Subject();

  constructor(private gs: GlobalService) { }

  /**
   * 获取公司列表
   * @param companyId 公司Id
   */
  getCompanyList(companyId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apicompanys.action', { companyId: companyId });
  }

  /**
   * 新增公司
   * @param companyId 公司Id
   * @param obj 新增公司表单提交数据对象
   */
  addCompany(companyId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apicompanyAdd.action', {
      'company.name': obj.companyName,
      'company.address': obj.companyAddress,
      'company.phone': obj.phone,
      'company.note': obj.remark,
      'companyId': companyId
    });
  }

  /**
   * 修改公司
   * @param companyId 公司Id
   * @param obj 修改公司表单提交数据对象
   */
  editComapny(editCompanyId, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apicompanyEdit.action', {
      'company.name': obj.companyName,
      'company.address': obj.companyAddress,
      'company.phone': obj.phone,
      'company.note': obj.remark || '',
      'company.id': editCompanyId
    });
  }

  /**
   * 删除公司
   * @param companyId 公司Id
   * @param delCompanyId 删除的公司Id
   */
  deleteCompany(companyId: string, delCompanyId) {
    return this.gs.httpGetObservable(Global.domain + 'api/apicompanyDel.action', {
      'delCompanyId': delCompanyId,
      'companyId': companyId
    });
  }
}
