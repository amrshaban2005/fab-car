import { CarPrivate } from './CarPrivate';
import { CarProps } from './CarProps';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CarService {
  private REST_API_SERVER = "http://localhost:3000";
  constructor(private http: HttpClient) { }

  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown Error!';
    if (error.error instanceof ErrorEvent) {
      // client -side-error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side-error
      errorMessage = `Error Code: ${error.status}\n Message:${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  getAllCars() {
   // return this.http.get(this.REST_API_SERVER + '/cars').pipe(retry(3), catchError(this.handleError));
    const body = new HttpParams().set('bookmark', "");
    //let bookmark="";
    return this.http.get(this.REST_API_SERVER + '/cars', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json'),
      params: body 
    });
  }

  getAllCarsNextPage(bookmark:string) {
    const body = new HttpParams().set('bookmark', bookmark);
    return this.http.get(this.REST_API_SERVER + '/cars',  {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json'),
        params:body
    });
  }

  getCarsByOwner(bookmark: string,owner:string) {
    const body = new HttpParams()
      .set('bookmark', bookmark)
      .set('owner',owner);
    return this.http.get(this.REST_API_SERVER + '/cars/search', {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json'),
      params: body
    });
  }

  getCar(carNo: string) {
    //const body = new HttpParams().set('carNo', carNo);
    return this.http.get(this.REST_API_SERVER + '/cars/' + carNo).pipe(retry(3), catchError(this.handleError));
  }

  addNewCar(car: CarProps) {

    // const body = new HttpParams()
    //   .set('number', car.CarNumber)
    //   .set('make', car.Make)
    //   .set('model', car.Model)
    //   .set('colour', car.Colour)
    //   .set('owner', car.Owner);
    const body = JSON.stringify(car);
  

    return this.http.post(this.REST_API_SERVER + '/cars/new', body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });

  }

  updateCarOwner(carNo: string, owner: string) {


    const body = JSON.parse('{"Owner":\"' + owner + '\"}');
    return this.http.post(this.REST_API_SERVER + '/cars/' + carNo, body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });

  }

  deleteCar(carNo: string) {
    return this.http.delete(this.REST_API_SERVER + '/cars/' + carNo);

  }

  getCarPrivate(carNo: string) {
    //const body = new HttpParams().set('carNo', carNo);
    return this.http.get(this.REST_API_SERVER + '/cars/' + carNo + '/priv').pipe(retry(3), catchError(this.handleError));
  }

  addCarPrivate(carNo: string, car: CarPrivate) {


    const body = JSON.stringify(car);

    return this.http.post(this.REST_API_SERVER + '/cars/' + carNo + '/priv' , body, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    });

  }

  getCarHistory(carNo: string) {
    //const body = new HttpParams().set('carNo', carNo);
    return this.http.get(this.REST_API_SERVER + '/cars/' + carNo + '/his').pipe(retry(3), catchError(this.handleError));
  }

}
