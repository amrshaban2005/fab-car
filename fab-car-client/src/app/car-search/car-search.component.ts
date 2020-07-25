import { CarProps } from './../CarProps';
import { CarService } from './../car.service';
import { Component, OnInit } from '@angular/core';
import { Car } from './../Car';
import { NgxSpinnerService } from "ngx-spinner";
import { timer } from 'rxjs';

@Component({
  selector: 'app-car-search',
  templateUrl: './car-search.component.html',
  styleUrls: ['./car-search.component.css']
})
export class CarSearchComponent implements OnInit {
  cars;
 
  nextBookmark;
  prevBookmark;
  map = new Map();
  pageNo;
  owner;
  constructor(private carService: CarService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  onSearch(){
    this.carService.getCarsByOwner("",this.owner).subscribe((data: any) => {
    
      this.cars = JSON.parse(data as string);
      this.nextBookmark = this.cars[0].bookmark;
      this.prevBookmark = this.cars[0].Key;
      this.map.set(1, this.cars[0].Key);
      this.pageNo = 1;
     
    })

  }

  onGetAllCarsNextPage() {
    if (this.nextBookmark == "")
      return;
    this.pageNo += 1;
    this.carService.getCarsByOwner(this.nextBookmark,this.owner).subscribe((data: any) => {

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




    this.carService.getCarsByOwner(this.prevBookmark,this.owner).subscribe((data: any) => {

      this.cars = JSON.parse(data as string);
      this.nextBookmark = this.cars[0].bookmark;



      //this.prevBookmark = this.cars[0].Key;

    })
    //window.alert(this.prevBookmark);
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
}
