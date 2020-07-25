import { ActivatedRoute } from '@angular/router';
import { CarService } from './../car.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-car-history',
  templateUrl: './car-history.component.html',
  styleUrls: ['./car-history.component.css']
})
export class CarHistoryComponent implements OnInit {

  constructor(private carService: CarService, private route: ActivatedRoute) { }
  carNo;
  cars;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.carNo = params.get('carNo');
      this.carService.getCarHistory(this.carNo).subscribe((data: any) => {

        console.log(data);
        this.cars = JSON.parse(data as string);

      })

    })
  }

}
