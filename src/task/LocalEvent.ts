import { Key } from './types';
import { EventMap } from './interface';

export default abstract class LocalEvent<T extends EventMap> {
  private listeners: Record<string, T[Key<T>][]> = {};

  protected abstract getEventKeys(): string[];

  public on<K extends Key<T>>(type: K | K[], handler: T[K]) {
    return this.addEventListener<K>(type, handler);
  }

  public off<K extends Key<T>>(type: K | K[], handler: T[K]) {
    return this.removeEventListener<K>(type, handler);
  }

  public addEventListener<K extends Key<T>>(type: K | K[], handler: T[K]) {
    const listeners = this.listeners;
    if (Array.isArray(type)) {
      type.forEach((t) => this.addEventListener<K>(t, handler));
      return this;
    }
    if (this.getEventKeys().indexOf(type.toLocaleString()) === -1) {
      return this;
    }
    const t = type as string;
    if (!listeners[t]) {
      listeners[t] = [];
    }
    listeners[t].push(handler);
    return this;
  }

  public removeEventListener<K extends Key<T>>(type: K | K[], handler: T[K]) {
    const listeners = this.listeners;
    if (Array.isArray(type)) {
      type.forEach((t) => this.removeEventListener<K>(t, handler));
      return this;
    }
    const t = type as string;
    if (!listeners[t]) {
      return this;
    }
    listeners[t] = listeners[t].filter((i) => i === handler);
    return this;
  }

  public removeAllEventListener(type: string) {
    this.listeners[type] = [];
  }

  public clear() {
    this.listeners = {};
  }

  public fireAsObject(type: Key<T>, ...args: any[]) {
    const t = type as string;
    this.listeners[t] && this.listeners[t].forEach((i) => typeof i === 'function' && i(...args));
  }
  public fire(type: Key<T>, args: any) {
    const t = type as string;
    this.listeners[t] && this.listeners[t].forEach((i) => typeof i === 'function' && i({ type, target: args }));
  }
}
