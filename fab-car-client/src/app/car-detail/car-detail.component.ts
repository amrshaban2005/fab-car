import { CarProps } from './../CarProps';
import { CarService } from './../car.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { timer } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-car-detail',
  templateUrl: './car-detail.component.html',
  styleUrls: ['./car-detail.component.css']
})
export class CarDetailComponent implements OnInit {

  constructor(private carService: CarService, private route: ActivatedRoute, private spinner: NgxSpinnerService) { }
  car;
  carNo;
  owner;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.carNo = params.get('carNo');
      this.carService.getCar(this.carNo).subscribe((data: any) => {

        console.log(data);
        this.car = JSON.parse(data as string);

      })

    })
  }

  onUpdateNewCar() {
    this.spinner.show();
    this.carService.updateCarOwner(this.carNo, this.owner).subscribe(
      (data: any) => {
        //window.alert('Saved Successfully');
        this.owner = "";
        timer(2000).subscribe(x => {
          this.carService.getCar(this.carNo).subscribe((data1: any) => {
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
