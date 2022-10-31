// Import stylesheets
import './style.css';

/**
 *  todo: each order need be process in the following order:
 *   - validate: if the order id is valid. if not, no need to check status
 *   - check status: if received, move to done - no need to check priority
 *   - check priority: if urgent, send to a urgent queue and return
 */
abstract class AbstractHandler<T> {
  private nextHandler: AbstractHandler<T>;

  next(handler: AbstractHandler<T>): AbstractHandler<T> {
    this.nextHandler = handler;
    return handler;
  }

  handle(request: T): any {
    return this.nextHandler ? this.nextHandler.handle(request) : null;
  }
}

// --------------------------------

class IdValidator extends AbstractHandler<Order> {
  override handle(request: Order): any {
    if (request.id > 2) {
      return super.handle(request);
    }
    return null;
  }
}

class StatusValidator extends AbstractHandler<Order> {
  override handle(request: Order): any {
    if (request.status === Status.Delivered) {
      return null;
    }
    return super.handle(request);
  }
}

class PriorityValidator extends AbstractHandler<Order> {
  override handle(request: Order): any {
    if (request.priority === Priority.High) {
      console.log('HIGH PRIO');
    }
    return super.handle(request);
  }
}

// ------------------------------
enum Status {
  Received,
  Pending,
  InProcess,
  Sent,
  Delivered,
}
enum Priority {
  Low,
  Medium,
  High,
  Urgent,
}

interface Order {
  id: number;
  itemCount: number;
  ordered: string;
  expectedDelivery: string;
  status: Status;
  priority: Priority;
}

const orders: Order[] = [
  {
    id: 1,
    itemCount: 3,
    ordered: '08/12/2020',
    expectedDelivery: '9/15/2020',
    status: Status.Pending,
    priority: Priority.Low,
  },
  {
    id: 2,
    itemCount: 15,
    ordered: '06/10/2020',
    expectedDelivery: '8/15/2020',
    status: Status.Pending,
    priority: Priority.High,
  },
  {
    id: 3,
    itemCount: 1,
    ordered: '08/12/2020',
    expectedDelivery: '9/15/2020',
    status: Status.Sent,
    priority: Priority.Low,
  },
];

class OrderManager {
  private readonly orders: Order[];

  constructor(orders: Order[]) {
    this.orders = orders;
  }

  process(handler: AbstractHandler<Order>) {
    for (const order of this.orders) {
      handler.handle(order);
    }
  }
}

const idValidator = new IdValidator();
const statusValidator = new StatusValidator();
const priorityValidator = new PriorityValidator();

//
const basicOrderFlow = idValidator
  .next(statusValidator)
  .next(priorityValidator);

const basicOrderFlow2 = statusValidator.next(idValidator);

const orderManager = new OrderManager(orders);
orderManager.process(basicOrderFlow);
orderManager.process(basicOrderFlow2);

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>Workshop</h1>`;
