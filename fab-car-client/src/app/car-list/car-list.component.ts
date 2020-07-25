import { CarProps } from './../CarProps';
import { CarService } from './../car.service';
import { Component, OnInit } from '@angular/core';
import { Car } from './../Car';
import { timer } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

import { stringify } from 'querystring';

@Component({
  selector: 'app-car-list',
  templateUrl: './car-list.component.html',
  styleUrls: ['./car-list.component.css']
})
export class CarListComponent implements OnInit {

  cars;
  carNo;
  nextBookmark;
  prevBookmark;
  map = new Map();
  pageNo;


  constructor(private carService: CarService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.carService.getAllCars().subscribe((data: any) => {


      //console.log(data);
      //window.alert(data);
      this.cars = JSON.parse(data as string);
      this.nextBookmark = this.cars[0].bookmark;
      this.prevBookmark = this.cars[0].Key;
      this.map.set(1, this.cars[0].Key);
      this.pageNo = 1;
      // window.alert(this.bookmark);
      // window.alert(this.cars);
      // for (let car of this.cars) {
      //   window.alert(car.Key);
      // }
      //window.alert(this.cars);

      // let cars = JSON.parse(JSON.stringify(data));
      // // window.alert(cars);
      // for (let car of cars) {
      //   window.alert(car);
      //   //window.alert(Object.keys(car.Record));
      // }
      // let Record = Object.keys(cars.Record);
      // window.alert(Record);
      // Record.forEach(element => {
      //   window.alert(element);
      // });

      // this.cars.forEach(element => {
      //   window.alert(element);
      // });
    })


  }

  onDeleteCar(car) {
    //window.alert(car);
    this.spinner.show();
    this.carService.deleteCar(car.Key).subscribe(
      (data: any) => {
        //window.alert("Deleted Successfully");
        timer(2000).subscribe(x => {
          this.carService.getAllCars().subscribe((data1: any) => {

            this.cars = JSON.parse(data1 as string);
            this.nextBookmark = this.cars[0].bookmark;
            this.prevBookmark = this.cars[0].Key;
            this.map.set(1, this.cars[0].Key);
            this.pageNo = 1;
            this.spinner.hide();
          })
        })



      },
      error => {
        console.log('oops', error);

      });
  }

  onGetAllCarsNextPage() {
    if (this.nextBookmark == "")
      return;
    this.pageNo += 1;
    this.carService.getAllCarsNextPage(this.nextBookmark).subscribe((data: any) => {

      this.cars = JSON.parse(data as string);
      this.nextBookmark = this.cars[0].bookmark;

      if (!this.map.has(this.pageNo))
        this.map.set(this.pageNo, this.cars[0].Key);


    })
    //window.alert(this.nextBookmark);
  }

  onGetAllCarsPrevoiusPage() {
    if (this.pageNo == 1)
      return;

    this.pageNo -= 1;

    if (this.map.has(this.pageNo))
      this.prevBookmark = this.map.get(this.pageNo);




    this.carService.getAllCarsNextPage(this.prevBookmark).subscribe((data: any) => {

      this.cars = JSON.parse(data as string);
      this.nextBookmark = this.cars[0].bookmark;



      //this.prevBookmark = this.cars[0].Key;

    })
    //window.alert(this.prevBookmark);
  }

}
