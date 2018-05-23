import { iLinklogin } from './login/iLinklogin';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './tools/services/auth-guard.service';
import { GlobalService } from './tools/services/global';
import { RegisterComponent } from './register/register.component';
import { ModalModule } from 'ngx-bootstrap';



@NgModule({
  declarations: [
    AppComponent,
    iLinklogin,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ModalModule.forRoot()
  ],
  providers: [AuthGuard,GlobalService],
  entryComponents:[RegisterComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
