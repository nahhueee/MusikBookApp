import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PreferenciasService {

  constructor() { }

  EsDark():string{
    return String(localStorage.getItem('dark'))
  }
  Tema():string{
    return String(localStorage.getItem('tema'));
  }
}
