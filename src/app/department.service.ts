import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Department } from './department';
import { tap, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  readonly url = 'https://desafio-backend-mas.herokuapp.com/api/departments';

  private departmentsSubject$: BehaviorSubject<Department[]> = new BehaviorSubject<Department[]>(null);
  private loaded: boolean = false;

  constructor(private http: HttpClient) { }

  get(): Observable<Department[]> {
    if (!this.loaded) {
      this.http.get<Department[]>(this.url)
        .pipe( 
          tap((deps) => console.log(deps)),
          delay(1000)
        )
        .subscribe(this.departmentsSubject$);
      this.loaded = true;
    }
    return this.departmentsSubject$.asObservable();
  }

  add(d: Department): Observable<Department>  {
    return this.http.post<Department>(this.url, d)
    .pipe(
      tap((dep: Department) => this.departmentsSubject$.getValue().push(dep))
    )
  }

  del(dep: Department): Observable<any> {
    console.log("id: ",dep.id);
    return this.http.delete(`${this.url}/${dep.id}`)
      .pipe( 
        tap(()=> {
          let departments = this.departmentsSubject$.getValue();
          let i = departments.findIndex(d => d.id === dep.id);
          if (i>=0)
            departments.splice(i,1);
        }
      ))
  }

  delById(dep: Department): Observable<Department> {
    console.log("id: ",dep.id);
    return this.http.get(`${this.url}/${dep.id}`)
      .pipe( 
        // tap((deps) => console.log(deps)),
        tap((dep: Department) => this.departmentsSubject$.getValue().push(dep))
      )
  }

  update(dep: Department): Observable<Department> {
    console.log("id: ",dep.id);
    return this.http.put<Department>(`${this.url}/${dep.id}`, dep)
      .pipe(
        tap((d) => {
          let departments = this.departmentsSubject$.getValue();
          let i = departments.findIndex(d => d.id === dep.id);
          if (i>=0)
            departments[i].name = d.name;
        })
      )
  }
}
