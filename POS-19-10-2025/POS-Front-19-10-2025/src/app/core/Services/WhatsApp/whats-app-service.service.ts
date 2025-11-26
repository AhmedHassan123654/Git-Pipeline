import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../Common/common.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppServiceService {

  constructor(private http: HttpClient, private common: CommonService) {}
  generateQRCode() {
    return this.http.get(this.common.rooturl + "/WhatsApp/GenerateQRCode");
  }
  sendMessage(sendWhatsAppMessagesDto:any) {
    return this.http.post(this.common.rooturl + "/WhatsApp/SendMessage" ,sendWhatsAppMessagesDto);
  }
}
