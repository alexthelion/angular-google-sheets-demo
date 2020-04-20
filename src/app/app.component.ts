import { Component } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'googleSpreadSheetApiDemo';

  constructor(private http: HttpClient) {
    this.getSheetData().subscribe(val => {
      console.log(val);
    })
  }

  public getSheetData(): Observable<any> {
    const sheetId = '1mPqsa5nb24jfbZtkTQbVONojM34VUzn7Cej5M48FMM0';
    const sheetNumber = '1';
    const url = `https://spreadsheets.google.com/feeds/list/${sheetId}/${sheetNumber}/public/values?alt=json`

    return this.http.get(url)
      .pipe(
        map((res: any) => {
          const data = res.feed.entry;

          const returnArray: Array<any> = [];
          if (data && data.length > 0) {
            data.forEach(entry => {
              const obj = {};
              for (const x in entry) {
                if (x.includes('gsx$') && entry[x].$t) {
                  obj[x.split('$')[1]] = entry[x]['$t'];
                }
              }
              returnArray.push(obj);
            });
          }
          return returnArray;
        })
      );
  }
}
