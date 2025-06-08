import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ResponseApi } from '../Interfaces/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private urlApi:string = environment.endpoint + "Dashboard/"
  constructor(private http:HttpClient) { }

  resumen(): Observable<ResponseApi> {
       return this.http.get<ResponseApi>(`${this.urlApi}Resumen`)
    }
}
