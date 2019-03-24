import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { Chapter1Component } from './components/chapter-1/chapter-1.component';
import { RouterModule, Routes } from '@angular/router';
import { TableOfContentsComponent } from './components/table-of-contents/table-of-contents.component';
import { Chapter2Component } from './components/chapter-2/chapter-2.component';

const routes: Routes = [
    {
        path: '',
        component: TableOfContentsComponent,
    },
    {
        path: 'chapter-1',
        component: Chapter1Component,
    },
    {
        path: 'chapter-2',
        component: Chapter2Component,
    },
];

@NgModule({
    declarations: [
        AppComponent,
        TableOfContentsComponent,
        Chapter1Component,
        Chapter2Component,
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }
