import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { iLinklogin } from './login/iLinklogin';



const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },//path为空，表示指向根目录，默认路由
  { path: 'login', component: iLinklogin },
  { path: 'home', loadChildren:"app/home/home.module#HomeModule"},
  { path: '**', component: iLinklogin }//默认进入哪个界面 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ],
  providers: [],
})
export class AppRoutingModule { 
    
}

