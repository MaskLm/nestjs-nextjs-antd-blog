'use client';
import { action, makeObservable, observable, reaction } from 'mobx';
import { createContext } from 'react';

class AccountStore {
  @observable account: any = null;
  @observable avatarURL = '';

  constructor() {
    makeObservable(this);

    // reaction(
    //   () => this.account,
    //   (account) => console.log('account changed:', account),
    // );

    // reaction(
    //   () => this.avatarURL,
    //   (url) => console.log('avatarURL changed:', url),
    // );
  }

  @action setAvatarURL = (url: string) => {
    this.avatarURL = url;
  };

  @action setAccount = (account: any) => {
    this.account = account;
  };
}
const accountStore = new AccountStore();
const contextAccountStore = createContext(accountStore);

export default contextAccountStore;
