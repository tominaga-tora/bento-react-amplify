import { generateClient } from "aws-amplify/data";
import { Schema } from "../../../amplify/data/resource";
import { v4 as uuidv4 } from "uuid";
import { getJstTimestamp } from "../lib/utils";

interface Order {
  order_id: string;
  employee_id: string;
  bento_id: string;
  timestamp: string;
}

type OrderWithoutIdAndTimestamp = Omit<Order, "order_id" | "timestamp"> & {
  order_id?: string;
  timestamp?: string;
};

class DataService {
  private readonly client = generateClient<Schema>();

  /**
   * 注文履歴取得
   * @returns 注文履歴
   * @throws エラーが発生した場合
   */
  async getOrders() {
    try {
      const orders = await this.client.models.Order.list();
      return orders.data;
    } catch (error) {
      console.error(error);
      throw error;
      //   return [];
    }
  }

  /**
   * 注文
   * @param order 注文内容
   * @returns 注文結果
   * @throws エラーが発生した場合
   */
  async createOrder(order: OrderWithoutIdAndTimestamp) {
    try {
      const orederId = uuidv4();
      order.order_id = orederId;
      order.timestamp = getJstTimestamp();

      const createdOrder = await this.client.models.Order.create(
        order as Order
      );
      return createdOrder;
    } catch (error) {
      console.error(error);
      throw error;
      //   return null;
    }
  }
}

export const dataService = new DataService();
