import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public setLocalStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  public setSessionStorage(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  public setStorage(key: string, value: string): void {
    this.setLocalStorage(key, value);
    this.setSessionStorage(key, value);
  }

  public getStorage<T>(key: string, parsable: boolean = false):  T | null {
    return this.getSessionStorage(key, parsable) ?? this.getLocalStorage(key, parsable);
  }

  //Both of these are protected to ensure I always use getStorage, so If I change my mind on where to store some data, I only need to change the setter I use
  protected getLocalStorage<T>(key: string, parsable: boolean = false): T | null {
    const res = localStorage.getItem(key);
    if(!res) return null;

    return parsable ? JSON.parse(res) : res as T;
  }

  protected getSessionStorage<T>(key: string, parsable: boolean = false): T | null {
    const res = sessionStorage.getItem(key);
    if(!res) return null;

    return parsable ? JSON.parse(res) : res as T;
  }
}
