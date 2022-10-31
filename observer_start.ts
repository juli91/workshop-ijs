// TODO: When a user logged-in, display a toast message, fetch permissions and redirect to dashboard
// TODO: When a user logged-out, display a toast message, redirect to login page

// TODO BONUS: When a user logged-in, display the user name in a navbar component (non exist yet)
// TODO BONUS: When a user logged-in, display the user name in a navbar component (non exist yet)

/**
 * Responsible for auth logic
 */

interface Subscriber<T> {
  update(state: T): void;
}

class Store<T> {
  private _state: T;
  private listeners: Set<Subscriber<T>>;
  private reducer: Function;

  constructor(reducer: Function, initialState: T) {
    this._state = initialState;
    this.reducer = reducer;
    this.listeners = new Set();
  }

  get state() {
    return this._state;
  }

  subscribe(subscriber: Subscriber<T>) {
    this.listeners.add(subscriber);
    return () => this.listeners.delete(subscriber);
  }

  // this is an event { type: 'LOGIN', username: 'juli', 'password'}
  dispatch(action: any) {
    this._state = this.reducer(action, this._state);
    this.listeners.forEach((l) => l.update(this._state));
  }
}

function AuthReducer(action: any, currentState: any) {
  if (action.type === 'login') {
    return { user: { name: 'juli' } };
  }
  if (action.type === 'logout') {
    return { user: null };
  }
}

const store = new Store();

/**
 *  UI for displaying a message on the screen
 */
class ToastMessage implements Subscriber<T> {
  update(state: _state): void {
    this.showToast(state.name);
  }
  showToast(message: string) {
    console.log('Display toast message: ' + message);
  }
}

/**
 * Responsible for fetching a set of permissions for
 * A specific User
 */
class PermissionManager implements Subscriber<User> {
  update(user: User): void {
    this.getPermissionsForUser(user);
  }
  getPermissionsForUser(user: any) {
    console.log('Fetching permissions for: ' + user);
  }
}

/**
 * Responsible for routing and redirects
 */
class Router {
  update(state: User): void {
    if (state.name == 'Juli') {
      this.redirectTo('profile');
    }
  }
  redirectTo(routeName: string) {
    console.log('Redirecting to ' + routeName);
  }
}

//

const auth = new Auth();
const router = new Router();

auth.signIn();
auth.subscribe(router);
