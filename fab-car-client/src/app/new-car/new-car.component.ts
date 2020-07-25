import { CarService } from './../car.service';
import { CarProps } from './../CarProps';
import { Component, OnInit } from '@angular/core';



@Component({
  selector: 'app-new-car',
  templateUrl: './new-car.component.html',
  styleUrls: ['./new-car.component.css']
})
export class NewCarComponent implements OnInit {

  constructor(private carService: CarService) { }

  carNumber;
  make;
  model;
  colour;
  owner;

  ngOnInit(): void {
  }

  onNewCar() {
    let car = new CarProps();
    car.CarNumber = this.carNumber;
    car.Make = this.make;
    car.Model = this.model;
    car.Colour = this.colour;
    car.Owner = this.owner;
   
    this.carService.addNewCar(car).subscribe(
      (data: any) => {
        window.alert('Saved Successfully');
        this.carNumber='';
        this.make = '';
        this.model = '';
        this.colour = '';
        this.owner = '';

       // console.log('success');
        // debugger;

      },
      error => {
        console.log('oops', error);

      });
  }
}
