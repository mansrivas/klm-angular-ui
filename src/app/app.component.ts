import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/components/common/menuitem';
import { HttpMethods } from './enums/http-methods.enum';
import { ICalculatedFare } from './interfaces/icalculated-fare';
import { HttpReqService } from './services/http-req.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'klm-price-calculator';
  items: MenuItem[];
  activeTab = "Price Calculator";

  cols: any[];
  values: any[] = new Array();
  selectedOrigin: string;
  selectedDistination: string;
  filteredObj: any[];
  calculateFareDetails: ICalculatedFare;
  isFarePrbar: boolean;

  totalRecords: number;
  pageFilterTerm: string = '';


  constructor(private _http: HttpReqService) {
    this._http.getDataWithParam(HttpMethods.LIST_ALL_AIRPORTS).toPromise().then(_ => {
      this.values = _['_embedded']['locations'];
      this.totalRecords = _['page']['totalElements'];
    });
  }

  ngOnInit(): void {
    this.items = [
      { label: 'Price Calculator', icon: 'pi pi-dollar', command: (event) => { this.activeTab = event.item.label } },
      {
        label: 'Airports', icon: 'pi pi-globe', command: (event) => { this.activeTab = event.item.label; }
      }
    ];

    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'code', header: 'Code' },
      { field: 'description', header: 'Description' }
    ];

  }

  filteredObjByValue(event) {
    let query = event.query;

    this._http.getDataWithParam(`${HttpMethods.LIST_ALL_AIRPORTS}/${query}`).toPromise()
      .then((_) => {
        this.filteredObj = _['_embedded']['locations'];
      })
  }

  calculateFare() {
    this.isFarePrbar = true;
    this._http.getDataWithParam(`${HttpMethods.CALCULATE_FARE}/${this.selectedOrigin['code']}/${this.selectedDistination['code']}`).toPromise()
      .then((_: ICalculatedFare) => {
        this.calculateFareDetails = _;
        this.isFarePrbar = false;
      })
  }

  loadAirportLazy(event) {
    let page = (event['first'] / 25) + 1;
    this._http.getDataWithParam(`${HttpMethods.LIST_ALL_AIRPORTS}`, new HttpParams().set("term", this.pageFilterTerm).set("page", page + "")).toPromise().then(_ => {
      this.values = _['_embedded']['locations'];
    });
  }

  loadAirportFilter(event) {
    this._http.getDataWithParam(`${HttpMethods.LIST_ALL_AIRPORTS}/${event}`).toPromise()
      .then((_) => {
        this.values = _['_embedded']['locations'];
        this.totalRecords = _['page']['totalElements'];
        this.pageFilterTerm = event;
      });
  }

}
