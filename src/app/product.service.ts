import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Product } from './product';
import { DepartmentService } from './department.service';
import { map, tap, filter, delay } from 'rxjs/operators';
import { Department } from './department';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  readonly url = 'https://desafio-backend-mas.herokuapp.com/api/products';
  private productsSubject$: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>(null);
  private loaded: boolean = false;

  constructor(
    private http: HttpClient,
    private deparmentService: DepartmentService) {     }

  
  get(): Observable<Product[]> {
    if (!this.loaded) {
      this.http.get<Product[]>(this.url)
        .pipe( 
          tap((prod) => console.log(prod)),
          delay(1000)
        )
        .subscribe(this.productsSubject$);
      this.loaded = true;
    }
    return this.productsSubject$.asObservable();
  }

  add(d: Product): Observable<Product>  {
    return this.http.post<Product>(this.url, d)
    .pipe(
      //tap((prod: Product) => this.ProductsSubject$.getValue().push(prod))
      tap((p) => {
        this.productsSubject$.getValue()
          .push({...p, id: p.id})
      })
    )
  }

  del(prod: Product): Observable<any> {
    return this.http.delete(`${this.url}/${prod.id}`)
      .pipe(
        tap(() => {
          let products = this.productsSubject$.getValue();
          let i = products.findIndex(p => p.id === prod.id);
          if (i>=0)
            products.splice(i, 1);
        })
      )
  }

  update(prod: Product): Observable<Product> {   
    return this.http.put<Product>(`${this.url}/${prod.id}`, prod)
    .pipe(
      tap((d) => {
        let products = this.productsSubject$.getValue();
        let i = products.findIndex(p => p.id === prod.id);
        if (i>=0)
          products[i].name = d.name;
      })
    )
  }

}
