import { Router } from '@angular/router';
import { Http, Headers, RequestOptionsArgs, Response } from '@angular/http';
import { Injectable } from "@angular/core";

import swal from 'sweetalert2';//sweetalert2
import { promise } from 'selenium-webdriver';

@Injectable()
export class Global {
    //static domain: string = "http://192.168.2.113:8080/IMS/";
    static domain: string = "http://192.168.2.229:8088/IMS/";
    static AllEaddress: any = [
        ['zhipinshijian', '0x00160009', '全程计时'],
        ['shechujishi', '0x10160002', '射出时间'],
        ['shechuqidian', '0x10160003', '射出起点'],
        ['shechuzhongdian', '0x10160004', '残料位置'],
        ['shechujiankong', '0x10160005', '保压起点'],
        ['baoyazhuanhuan', '0x10160007', '关模计时'],
        ['chuliaojishi', '0x1016000A', '储料时间'],
        ['chuliaozhongdian', '0x1016000D', '储料位置'],
        ['shetuijishi', '0x1016000E', '射退计时'],
        ['zhuanbaoya', '0x10160010', '转保压速度'],
        ['sheduizhongzhi', '0x10160011', '射退终点'],
        ['shechusudu', '0x10160012', '射出速度'],
        ['shchupingjunsudu', '0x10160013', '射出平均速度'],
        ['shechuzuidayali', '0x10160014', '射出最大压力'],
        ['bayazuidayali', '0x10160015', '保压最大压力'],
        ['baoyayidongsudu', '0x10160016', '保压移动距离'],
        ['zuojinjishi', '0x11160002', '座进计时'],
        ['zuotuijishi', '0x11160003', '座退计时'],
        ['guanmojishi', '0x20160007', '关模计时'],
        ['guanmodiyajishi', '0x20160009', '关模低压计时'],
        ['guanmogaoyajishi', '0x2016000B', '关模高压计时'],
        ['kaimoweizhi', '0x2016000D', '开模终点'],
        ['kaimojishi', '0x2016000E', '开模计时'],
        ['yimojishi', '0x20160013', '移模计时'],
        ['tuomojishi', '0x21160002', '脱模计时'],
        ['tuomojinjishi', '0x21160003', '脱模进计时'],
        ['tuomotuijishi', '0x21160004', '脱模退计时'],
    ]
}

@Injectable()
export class GlobalService {

    headers = new Headers({
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    });

    constructor(private http: Http, private router: Router) {

    }
    /**
     * 对参数进行编码 
     * @param params 
     */
    encode(params) {
        var str = '';
        if (params) {
            for (var key in params) {
                if (params.hasOwnProperty(key)) {
                    var value = params[key];
                    str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                }
            }
            str = str.length > 0 ? ('?' + str.substring(0, str.length - 1)) : '';
        }
        return str;
    }

    httpGet(url, params, callback, loader: boolean = false) {
        this.headers.set("token", localStorage.getItem("stoken") || '');
        let options: RequestOptionsArgs = {
            headers: this.headers,
            // params : {'token': localStorage.getItem("stoken") || ''}
        }
        if (loader) {
            //开启加载效果
        }
        this.http.get(url + this.encode(params), options).subscribe(res => {
            let json = res.json();
            // if (json.errorCode == 801) {
            //     alert(801);
            // }
            // if (json.code == 202) { //短token失效
            //     swal('超时提醒', '长时间没有操作,请点击确定跳转至登陆页面重新登陆!', 'error').then(value => {
            //         if (value) {
            //             this.router.navigate(['login']);
            //         }
            //     });
            // }
            //console.log(res);
            let token = res.headers.get('token') || json.obj.token || '';
            // if (token == '') {
            //     this.handleError("无法获取token!!");
            //     return;
            // }
            localStorage.setItem("stoken", token);
            if (loader) {
                //关闭加载效果 
            }
            if (json.code == 200) {
                callback(json);
            } else {
                this.handleInfo(json.code, json.message);
            }
        }, err => {
            if (loader) {
                //关闭加载效果 
            }
            this.handleError(err);
        });
    }

    httpPost(url, params, callback, loader: boolean = false) {
        this.headers.set("token", localStorage.getItem("stoken") || '');
        let options: RequestOptionsArgs = {
            headers: this.headers
        }
        if (loader) {
            //开启加载效果
        }
        this.http.post(url, params, options).subscribe(res => {
            let json = res.json();
            if (json.code == 202) { //短token失效
                swal('超时提醒', '长时间没有操作,请点击确定跳转至登陆页面重新登陆!', 'error').then(value => {
                    if (value) {
                        this.router.navigate(['login']);
                    }
                });
            }
            if (loader) {
                //关闭加载效果 
            }
            callback(json == null ? "[]" : json);
        }, err => {
            if (loader) {
                //关闭加载效果 
            }
            this.handleError(err);
        });
    }

    private handleInfo(code, msg) {
        swal('', msg, 'error');
    }

    private handleError(error: Response | any) {
        let msg = '';
        if (error.status == 400) {
            msg = '请求无效(code：400)';
            console.log('请检查参数类型是否匹配');
        } else if (error.status == 404) {
            msg = '请求资源不存在(code：404)';
            console.error(msg + '，请检查路径是否正确');
        } else if (error.status == 500) {
            msg = '服务器发生错误(code：500)';
            console.error(msg + '，请检查路径是否正确');
        } else {
            msg = `请求出错!`;
            console.log(error);
        }
        if (msg != '') {
            swal('http请求异常', msg, 'error');
        }
    }

    httpGetToPromise(url, params): Promise<any> {
        this.headers.set("token", localStorage.getItem("stoken") || '');
        let options: RequestOptionsArgs = {
            headers: this.headers,
        };
        return this.http.get(url + this.encode(params), options).toPromise();
    }

    /**
     * http返回Observable<any>方法
     * @param url api url
     * @param params 传递参数
     */
    httpGetObservable(url, params) {
        this.headers.set("token", localStorage.getItem("stoken") || '');
        let options: RequestOptionsArgs = {
            headers: this.headers,
        };
        return this.http.get(url + this.encode(params), options).map(res => {
            let json = res.json();
            let token = res.headers.get('token') || json.obj.token || '';
            localStorage.setItem("stoken", token);
            if (json.code != 200 && json.code != 201) {
                this.handleInfo(json.code, json.message);
            }
            return json;
        });
    }

    /**
     * 确认方法
     */
    confirm() {
        return swal({
            title: "确定删除么？",
            type: "warning",
            showConfirmButton: true,
            showCancelButton: true,
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            confirmButtonColor: "#DD6B55",
        });
    }

    /**
     * 
     * @param fn 使用节流的方法
     * @param context this指向
     * @param delay 延时时间
     * @param text 传入参数
     * @param mustApplyTime 最小执行时间 
     */
    throttle(fn, context, delay, text, mustApplyTime) {
        clearTimeout(fn.timer);
        fn.currentTime = Date.now();
        if (!fn.startTime) {
            fn.start = fn.currentTime;
        }
        if (fn.currentTime - fn.startTime > mustApplyTime) {
            fn.call(context, text);
            fn.startTime = fn.currentTime;
        } else {
            fn.timer = setTimeout(() => {
                fn.call(context, text);
            }, delay);
        }
    }

    checkErrors(self,formName) {
        if (!self[formName]) return;
        for (const field in self.formErrors) {
            self.formErrors[field] = '';
            const control = self[formName].get(field);
            if (control && (control.dirty || control.touched) && !control.valid) {
                console.log(control.errors);
                const messages = self.validationMessages[field];
                for (const key in control.errors) {
                    self.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }
}
