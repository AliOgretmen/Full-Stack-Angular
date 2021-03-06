import { Injectable } from '@angular/core';

import { Feedback } from '../shared/feedback';
import { baseURL}   from  '../shared/baseurl';
import { ProcessHttpmsgService } from './process-httpmsg.service';

import { Observable } from 'rxjs/Observable';
import { RestangularModule, Restangular } from 'ngx-restangular';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map'; 

@Injectable()
export class FeedbackService {

  constructor(private restangular: Restangular,
              private ProcessHttpMsgService: ProcessHttpmsgService) { }

  submitFeedback(feedback: Feedback): Observable<Feedback> {
    return this.restangular.all('feedback').post(feedback);
  }
}