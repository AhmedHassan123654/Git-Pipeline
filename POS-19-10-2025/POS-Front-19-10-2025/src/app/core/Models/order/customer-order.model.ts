import { OrderModel } from "./orderModel";

export class CustomerOrderModel {
  NetTotal: number;
  SubTotal: number;
  Discount: number;
  DiscountAmount: number;
  DiscountType: number; // 1: percentage 2: value
  TotalTaxAmount?: number;
  DeliveryPrice?: number;

  CustomerId: number;
  CustomerDocumentId: string;
  OrderPayTypeId?: number;
  NoteForOrder: string;

  OrderPayTypeName: string;
  CustomerName: string;
  CustomerPhone: string;
  ReceiverName: string;
  ReceiverPhone: string;
  PayedAmountReservation?: number;
  Processed: boolean;

  Customer: any;

  OrderDetails?: any[] = [];
  OrderPayments?: any[] = [];
  OrderType: any;
  Table: any;
  OrderTypeId: number;
  OrderTypeDocumentId: string;
  OrderTypeName: string;
  TableId: string;
  TableName: string;

  ReceivedDate: string | null;
  ReceivedTime: string | null;
  ReservationFromTime: string | null;
  IsMobileOrder: boolean;
  PersonsCount : number;
  constructor(data?: any) {
    if (data) Object.assign(this, data);
  }

  public static fromOrderModel(order: OrderModel): CustomerOrderModel {
    const customerOrder = new CustomerOrderModel();

    customerOrder.NetTotal = order.NetTotal;
    customerOrder.SubTotal = order.SubTotal;
    customerOrder.Discount = order.Discount;
    customerOrder.DiscountAmount = order.DiscountAmount;
    customerOrder.DiscountType = Number(order.DiscountType); // 1: percentage 2: value
    customerOrder.TotalTaxAmount = order.TotalTaxAmount;
    customerOrder.DeliveryPrice = order.DeliveryPrice;
    customerOrder.CustomerId = order.CustomerId;
    customerOrder.CustomerDocumentId = order.CustomerDocumentId;
    customerOrder.OrderPayTypeId = order.OrderPayTypeId;
    customerOrder.NoteForOrder = order.NoteForOrder;
    customerOrder.OrderPayTypeName = order.OrderPayTypeName;
    customerOrder.CustomerName = order.CustomerName;
    customerOrder.CustomerPhone = order.CustomerPhone;
    customerOrder.PayedAmountReservation = order.PayedAmountReservation;
    customerOrder.Customer = order.Customer;
    customerOrder.OrderPayments = order.OrderPayments;
    customerOrder.OrderType = order.OrderType;
    customerOrder.OrderTypeId = order.OrderTypeId;
    customerOrder.OrderTypeDocumentId = order.OrderTypeDocumentId;
    customerOrder.OrderTypeName = order.OrderTypeName;
    customerOrder.TableId = order.TableId;
    customerOrder.TableName = order.TableName;

    Object.assign(customerOrder, order.ReservationInfo);

    if (order.OrderDetails && order.OrderDetails.length > 0) {
      customerOrder.OrderDetails = [...order.OrderDetails];
    }

    return customerOrder;
  }
}
