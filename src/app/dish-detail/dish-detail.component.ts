import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Dish } from '../shared/dish';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-dish-detail',
  templateUrl: './dish-detail.component.html',
  styleUrls: ['./dish-detail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})
export class DishDetailComponent implements OnInit {

  //@Input()
  dish : Dish;
  dishcopy : Dish;
  dishIds : string[];
  prev : string;
  next : string;
  commentForm : FormGroup;
  commentData: Comment;
  errMess: string;

  visibility = "shown";

  @ViewChild('cform') commentFormDirective;
  // {
  //   id: '0',
  //   name: 'Uthappizza',
  //   image: 'https://images.unsplash.com/photo-1593642533144-3d62aa4783ec?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
  //   category: 'mains',
  //   featured: true,
  //   label: 'Hot',
  //   price: '4.99',
  //   // tslint:disable-next-line:max-line-length
  //   description: 'A unique combination of Indian Uthappam (pancake) and Italian pizza, topped with Cerignola olives, ripe vine cherry tomatoes, Vidalia onion, Guntur chillies and Buffalo Paneer.'
  // }

  formErrors = {
    'rating' : '',
    'comment' : '',
    'author' : '',
    'data' : '',
  };

  validationMessages = {
    'author' : {
      'required' : 'The field is required',
      'minlength' : 'Minimum Length must be of 2 characters',
    },
    'comment' : {
      'required' : 'The field is required',
      'minlength' : 'Minimum Length must be of 2 characters',
    },

  }


  constructor(private dishservice: DishService, private location: Location, private route: ActivatedRoute, private fb : FormBuilder, @Inject('BaseURL') private baseURL) {
    this.createForm();
  }

  ngOnInit(): void {
    this.dishservice.getDishIds().subscribe((dishIds) => this.dishIds = dishIds);

    this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(params['id']); }))
    .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
      errmess => this.errMess = <any>errmess);
  }

  createForm(){
    this.commentForm = this.fb.group({
      rating: '',
      comment: ['', [Validators.required, Validators.minLength(2)]],
      author: ['', [Validators.required, Validators.minLength(2)]],
      date: '',
    });

    this.commentForm.valueChanges.subscribe((data) => this.onValueChanged(data));

    this.onValueChanged();
  }

  onValueChanged(data ?: any){
    if(!this.commentForm){return;}
    const form = this.commentForm;
    for(const field in this.formErrors){
      if(this.formErrors.hasOwnProperty(field)){
        this.formErrors[field] = '';
        const control = form.get(field);
        if(control && control.dirty && !control.valid){
          const messages = this.validationMessages[field];
          for(const key in control.errors){
            if(control.errors.hasOwnProperty(key)){
              this.formErrors[field] += messages[key] + '';
            }
          }
        }
      }
    }
  }

  onSubmit(){
    this.commentForm.value.date = Date.now();
    this.commentData = this.commentForm.value;
    console.log(this.commentData);
    
    this.dishcopy = this.dish;
    this.dishcopy.comments.push(this.commentData);
    this.dishservice.putDish(this.dishcopy).subscribe((dish) => {
      this.dish = dish;
      this.dishcopy = dish;
    }, (errmess) => {
      this.dish = null;
      this.dishcopy = null;
      this.errMess = errmess;
    });

    this.commentForm.reset({
      rating: '5',
      comment: '',
      author: '',
      date:'',
    });

    this.commentFormDirective.resetForm();
  }

  goBack(): void{
    this.location.back();
  }

  setPrevNext(dishId : string){
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length ];
    this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length ]
  }

}
