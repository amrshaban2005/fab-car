import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import { CarListComponent } from './car-list/car-list.component';
import { HttpClientModule } from '@angular/common/http';
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbButtonModule } from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import { NewCarComponent } from './new-car/new-car.component';
import { CarDetailComponent } from './car-detail/car-detail.component';
import { CarPrivateComponent } from './car-private/car-private.component';
import { CarHistoryComponent } from './car-history/car-history.component';
import { CarSearchComponent } from './car-search/car-search.component';
import { FooterComponent } from './footer/footer.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    CarListComponent,
    HomeComponent,
    NewCarComponent,
    CarDetailComponent,
    CarPrivateComponent,
    CarHistoryComponent,
    CarSearchComponent,
    FooterComponent,
    SpinnerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbButtonModule,
    FormsModule,
    NgxSpinnerModule,
    NbSidebarModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'cars', component: CarListComponent },
      { path: 'new', component: NewCarComponent },
      { path: 'cars/:carNo', component: CarDetailComponent }, 
      { path: 'cars/:carNo/priv', component: CarPrivateComponent }, 
      { path: 'cars/:carNo/his', component: CarHistoryComponent }, 
      { path: 'search', component: CarSearchComponent },    
    ]), NbThemeModule.forRoot({ name: 'dark' }), NbLayoutModule, NbEvaIconsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
