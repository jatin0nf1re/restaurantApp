import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Router } from '@angular/router';
import { DishService } from '../services/dish.service';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dishes: Dish[];
  errMess : string;

  //selectedDish : Dish;

  constructor(private dishService : DishService, private router: Router, @Inject('BaseURL') private baseURL) { }

  ngOnInit(): void {
    this.dishService.getDishes().subscribe((dishes) => this.dishes = dishes, errMsg => this.errMess = <any>errMsg);
  }

  onSelect(dish: Dish){
    this.router.navigate(['/dishdetail',dish.id]);
  }

}
