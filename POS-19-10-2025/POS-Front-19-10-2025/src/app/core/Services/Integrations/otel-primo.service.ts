import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../Common/common.service';

@Injectable({
  providedIn: 'root'
})
export class OtelPrimoService {

  constructor(private http: HttpClient, private common: CommonService) {}


  getAllRoomsOccupies() {
    return this.http.get(this.common.rooturl + "/OtelPrimo/GetAllRoomsOccupies");
  }
  getAllCurrencies() {
    return this.http.get(this.common.rooturl + "/OtelPrimo/GetAllCurrencies");
  }

  postSrvChargs(model: any) {
    return this.http.post(this.common.rooturl + "/OtelPrimo/PostSrvChargs/", model);
  }

}
