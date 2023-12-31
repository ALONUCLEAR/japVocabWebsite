import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutComponent } from '@views/about/about.component';
import { HomeComponent } from '@views/home/home.component';
import { NotFoundComponent } from '@views/not-found/not-found.component';
import { ThemesComponent } from '@views/themes/themes.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterComponent } from '@components/filter/filter.component';
import { NavbarComponent } from '@components/navbar/navbar.component';
import { TableComponent } from '@components/table/table.component';
import { GraphQLModule } from './graphql.module';
import { MatButtonModule } from '@angular/material/button';
import { NG_ENTITY_SERVICE_CONFIG } from '@datorama/akita-ng-entity-service';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { RecordsStore } from '@store/records/records.store';
import { RecordsQuery } from '@store/records/records.query';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    ThemesComponent,
    NotFoundComponent,
    NavbarComponent,
    TableComponent,
    FilterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatSlideToggleModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    GraphQLModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatButtonModule,
    AkitaNgRouterStoreModule,
  ],
  providers: [{ provide: NG_ENTITY_SERVICE_CONFIG, useValue: { baseUrl: 'https://jsonplaceholder.typicode.com' }}, RecordsStore, RecordsQuery],
  bootstrap: [AppComponent],
})
export class AppModule {}
