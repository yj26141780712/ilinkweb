import { Employee } from './../../file-management/employee';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { GlobalService, Global } from './global';
import { isNgTemplate } from '@angular/compiler';

/**
 * 用户信息Service 提供用户信息操作的API
 */
@Injectable()
export class EmployeeService {

  public employeeSubject = new Subject();

  constructor(private gs: GlobalService) { }

  /**
   * 获取用户列表
   * @param companyId 公司Id
   */
  getEmployeeList(companyId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apishowCompanyUsers.action', { companyId: companyId });
  }

  /**
   * 新增用户
   * @param companyId 公司Id
   * @param obj 表单提交时的数据对象 
   */
  addEmployee(companyId: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiuserAdd.action', {
      'user.username': obj.userName,
      'user.password': obj.passWord,
      'user.roleid': obj.role,
      'user.name': obj.name,
      'user.phone': obj.phone,
      'user.note': obj.remark,
      'user.companyid': companyId
    });
  }

  /**
   * 编辑用户
   * @param id 用户Id
   * @param obj 表单提交时的数据对象
   */
  editEmployee(id: string, obj) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiuserEdit.action', {
      'user.username': obj.userName,
      'user.roleid': obj.role,
      'user.name': obj.name,
      'user.phone': obj.phone,
      'user.note': obj.remark,
      'user.id': id
    });
  }

  /**
   * 停用
   * @param companyId 公司Id
   * @param userId 用户Id
   */
  stopEmployee(companyId: string, userId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiuserDel.action', {
      'userId': userId,
      'companyId': companyId
    });
  }

  /**
   * 启用
   * @param companyId 公司Id
   * @param userId 用户Id
   */
  startEmployee(companyId: string, userId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiuserStart.action', {
      'userId': userId,
      'companyId': companyId
    });
  }

  /**
   * 重置密码
   * @param userId 用户Id
   */
  resetPassword(userId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apiresetPassword.action', {
      'userId': userId
    });
  }

  /**
   * 获取角色列表信息
   * @param companyId 公司Id
   */
  getRoleList(companyId: string) {
    return this.gs.httpGetObservable(Global.domain + 'api/apigetRoleListByCompany', {
      companyId: companyId
    });
  }
}
