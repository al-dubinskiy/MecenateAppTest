import { makeAutoObservable } from 'mobx';

class FeedStore {
  selectedTier: 'free' | 'paid' | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedTier(tier: 'free' | 'paid' | null) {
    this.selectedTier = tier;
  }
}

export const feedStore = new FeedStore();