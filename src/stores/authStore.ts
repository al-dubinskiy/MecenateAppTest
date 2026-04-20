import { makeAutoObservable } from 'mobx';

class AuthStore {
  userId: string = '550e8400-e29b-41d4-a716-446655440000';
  isAuthenticated: boolean = true;

  constructor() {
    makeAutoObservable(this);
  }

  setUserId(id: string) {
    this.userId = id;
    this.isAuthenticated = true;
  }

  logout() {
    this.isAuthenticated = false;
  }
}

export const authStore = new AuthStore();