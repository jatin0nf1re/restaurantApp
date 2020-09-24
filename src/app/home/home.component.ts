import { Component, OnInit, Inject } from '@angular/core';
import { PromotionService } from '../services/promotion.service';
import { Promotion } from '../shared/promotion';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { LeaderService } from '../services/leader.service'; 
import { from } from 'rxjs';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish : Dish;
  dishErrMess : string
  promotion: Promotion;
  leader : Leader;

  constructor(private dishservice: DishService, private promotionservice: PromotionService, private leaderservice: LeaderService, @Inject('BaseURL') private baseURL) { }

  ngOnInit(): void {
    this.dishservice.getFeaturedDish().subscribe((dish) => this.dish = dish, (errMsg) => this.dishErrMess = errMsg);
    this.promotionservice.getFeaturedPromotion().subscribe((promotion) => this.promotion = promotion);
    this.leaderservice.getFeaturedLeader().subscribe((leader) => this.leader  = leader);
  }

}
