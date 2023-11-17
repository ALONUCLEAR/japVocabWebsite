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

  public getLocalStorage<T>(key: string, parsable: boolean = false): T | null {
    const res = localStorage.getItem(key);
    if(!res) return null;

    return parsable ? JSON.parse(res) : res as T;
  }

  public getSessionStorage<T>(key: string, parsable: boolean = false): T | null {
    const res = sessionStorage.getItem(key);
    if(!res) return null;

    return parsable ? JSON.parse(res) : res as T;
  }
}
