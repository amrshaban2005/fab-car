import { CarPrivate } from './../CarPrivate';
import { ActivatedRoute } from '@angular/router';
import { CarService } from './../car.service';
import { Component, OnInit } from '@angular/core';
import { timer } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-car-private',
  templateUrl: './car-private.component.html',
  styleUrls: ['./car-private.component.css']
})
export class CarPrivateComponent implements OnInit {

  constructor(private carService: CarService, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }
  car;
  carNo;
  collection;
  notes;
  price;

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.carNo = params.get('carNo');
      this.carService.getCarPrivate(this.carNo).subscribe((data: any) => {

        console.log(data);
        this.car = JSON.parse(data as string);

      })

    })
  }


  onUpdateCarPrivate() {
    this.spinner.show();
    let car = new CarPrivate();
    car.Notes = this.notes;
    car.Price = Number(this.price);
    car.Collection = this.collection;
    this.carService.addCarPrivate(this.carNo, car).subscribe(
      (data: any) => {
        this.collection = "";
        this.notes = "";
        this.price = "";
        timer(2000).subscribe(x => {
          this.carService.getCarPrivate(this.carNo).subscribe((data1: any) => {
            this.car = JSON.parse(data1 as string);
            this.spinner.hide();
          })
        })
      },
      error => {
        console.log('oops', error);

      });
  }

}
