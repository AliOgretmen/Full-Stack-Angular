import { Component, OnInit, Inject } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Feedback } from '../shared/feedback';
import { visibility, flyInOut, expand } from '../animations/app.animation';



import 'rxjs/add/operator/switchMap';



//import { Comment } from '../shared/comment';



@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
    flyInOut(),
    visibility(),
    expand()
  ]
})

export class DishdetailComponent implements OnInit {

 
  dish: Dish;
  dishcopy = null;
  dishIds: number[];
  prev: number;
  next: number;
  feedbackForm: FormGroup;
  feedback: Feedback;
  commentForm: FormGroup;
  comment: Comment;
  errMess: string;
  visibility = 'shown';
 
  formErrors = {
    'author': '',
    'rating': '',
    'comment': '',
    'date': ''
  };

  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.',
      'maxlength':     'Name cannot be more than 30 characters long.'
    },
    'comment': {
      'required':      'Comment is required.',
      'minlength':     'Comment must be at least 1 characters long.',
      'maxlength':     'Comment cannot be more than 200 characters long.'
    },
    'rating': {
      'required':      'Rating is required.',
    },
  };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
     @Inject('BaseURL') private BaseURL ) { 
      this.createComment();
    }

    ngOnInit() {

      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params
      .switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); })
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => { this.dish = null; this.errMess = <any>errmess; });
    }
  
    setPrevNext(dishId: number) {
      let index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1)%this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1)%this.dishIds.length];
    }
  
  goBack(): void {
    this.location.back();
  }
  createComment() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)] ],
      rating: ['' , [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)] ],
      date: new Date(),
    });

    this.commentForm.valueChanges
        .subscribe(data => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  onSubmit() {
    const comment = this.commentForm.value;
    this.dishcopy.comments.push(comment);
    this.dishcopy.save()
    .subscribe(dish => { this.dish = dish; console.log(this.dish); });
    this.commentForm.reset({
      author: '',
      comment: '',
      rating: 5,
      date: new Date().toISOString()
    });
  } 

  onValueChanged(data?: any) { 
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field); 
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    } 
  }

  }


