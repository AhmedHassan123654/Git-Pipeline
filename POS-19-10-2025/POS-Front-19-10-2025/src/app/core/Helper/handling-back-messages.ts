import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root"
})
export class HandlingBackMessages {
  constructor(private toastr: ToastrService) {}
  UserProfileMessages(result: any) {
    let Message = "";
    if (result == 1) {
      Message = "User Profile data updated successfully";
      return Message;
    } else if (result == 2) {
      Message = "Old password is incorrect";
      return Message;
    } else {
      return result;
    }
  }

  LoginMessages(result: any) {
    let Message = "";
    switch (result) {
      case 1:
        Message = "Username or Password is incorrect.";
        break;
      case 2:
        Message = "This Shift Is Already Closed.";
        break;
      case 3:
        Message = "This system need to license please contact the authorized distributor .Thank you";
        break;
      case 4:
        Message = "You don't have permission for this point of sale";
        break;
    }
   
    if(Message) 
      return Message;
    else 
      return result;
  }
  ForgetPassMessages(result: any) {
    let Message = "";
    let ModalName = "";
    if (result == 1) {
      Message = "We couldn not find your account with that information.";
      ModalName = "#modal-emailerror";
      return [Message, ModalName];
    } else if (result == 2) {
      Message = "An email has been sent. Please click the link when you get it.";
      ModalName = "#modal-emailsent";
      return [Message, ModalName];
    } else if (result == 3) {
      Message = "UnExpected error pls try to send email again.";
      ModalName = "#modal-emailerror";
      return [Message, ModalName];
    } else {
      ModalName = "#modal-emailerror";
      return [result, ModalName];
    }
  }
  UserMessages(result: any) {
    let Message = "";
    let ModalName = "";
    if (result == 1) {
      Message = "Invalid user name or user number.";
      return Message;
    } else if (result == 2) {
      Message = "User number is already exist.";
      return Message;
    } else if (result == 3) {
      Message = "Your password has been changed.";
      ModalName = "#modal-passwordreset";
      return [Message, ModalName];
    } else if (result == 4) {
      Message = "if you want to change your password you must request a new reset password mail.";
      ModalName = "#modal-passworderror";
      return [Message, ModalName];
    } else if (result == 5) {
      Message =
        "You donot have permission for change password again" +
        "if you want to change it you must request a new reset password mail.";
      ModalName = "#modal-passworderror";
      return [Message, ModalName];
    } else if (result == 6) {
      Message = "Role name is already exist.";
      return Message;
    } else {
      return result;
    }
  }
  GlobalMessages(result: any) {
    let Message = "";
    if (result == 1) {
      Message = "Saved successfully";
      return Message;
    } else if (result == 2) {
      Message = "Edited successfully";
      return Message;
    } else if (result == 3) {
      Message = "Deleted successfully";
      return Message;
    } else if (result == 4) {
      Message = "Failed to complete the process";
      return Message;
    } else if (result == 5) {
      Message = "Failed Process";
      return Message;
    } else if (result == 6) {
      Message = "Dublicate Record";
      return Message;
    } else if (result == 7) {
      Message = "Cannot Update Or Delete Sync Record";
      return Message;
    } else if (result == 8) {
      Message = "Pinging Successfully";
      return Message;
    } else if (result == 9) {
      Message = "Connected Successfully";
      return Message;
    } else if (result == 10) {
      Message = "DisConnected Successfully";
      return Message;
    } else if (result == 11) {
      Message = "Document Must Has Details";
      return Message;
    } else if (result == 12) {
      Message = "Check Required Fields";
      return Message;
    } else if (result == 13) {
      Message = "Saved to POS successfully but faild to save to server";
      return Message;
    } else if (result == 15) {
      Message = "Cannot delete due to Related data";
      return Message;
    } else if (result == 16) {
      Message = "Dublicate Name";
      return Message;
    } else if (result == 17) {
      Message = "Pay Amount Must Equel Sub Total";
      return Message;
    } else if (result == 18) {
      Message = "لايمكن ان يكون قيمه المردود اكبر من القيمه المتبقيه";
      return Message;
    } else if (result == 19) {
      Message = "لايمكن ان يكون قيمه المردود صفر";
      return Message;
    } else if (result == 20) {
      Message = "Return Order Quantity More than product Quantity";
      return Message;
    } else if (result == 21) {
      Message = "Must View be Checked For this Screen";
      return Message;
    } else if (result == 22) {
      Message = "Dublicate Group";
      return Message;
    } else if (result == 23) {
      Message = "Must Be one Or More Cashier in Shift";
      return Message;
    } else if (result == 24) {
      Message = "Discount Must Be Less than 100";
      return Message;
    } else if (result == 25) {
      Message = "Price Must Be Number";
      return Message;
    } else if (result == 26) {
      Message = "Pasword Not Match With Confirm Password";
      return Message;
    } else if (result == 27) {
      Message = "You Must Select Record To this Operation";
      return Message;
    } else if (result == 28) {
      Message = "Integration Setting For This Company Is Existing";
      return Message;
    } else if (result == 29) {
      Message = " this Document Is Sync You can't Deleted Or Edit It ";
      return Message;
    } else if (result == 30) {
      Message = " Dublicate phone Number ";
      return Message;
    } else if (result == 31) {
      Message = " Dublicate Second  phone Number ";
      return Message;
    } else if (result == 32) {
      Message = " Dublicate Third  phone Number ";
      return Message;
    } else if (result == 33) {
      Message = " You Must Open Day Before Do This Operation";
      return Message;
    } else if (result == 34) {
      Message = " You Must Open Shift Before Do This Operation";
      return Message;
    } else if (result == 35) {
      Message = "The Main Branch Is Already Selected";
      return Message;
    } else if (result == 36) {
      Message = "Un Closed Orders For ";
      return Message;
    } else if (result == 37) {
      Message = "Favorite Screens More Than six ";
      return Message;
    }
    else if (result == 38) {
      Message = "Item added successfullay ";
      return Message;
    }  
    else if (result == 39) {
      Message = "Item updated successfullay ";
      return Message;
    } else if(result == 40){
      Message = "You Should Close All Orders"
      return Message;
    } 
    else if(result == 44){
      Message = "Dublicate IntegrationCode , كود الربط متكرر"
      return Message;
    } 
    else if (result == 38) {
      Message = " Saved Successfully But Order Didnt Sync To Tax Authority";
      return Message;
    }
     else {
      Message = "Unexpected error";
      return Message;
    }
  }
}
