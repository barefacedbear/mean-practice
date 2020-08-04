import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  hide = true;
  isLoading = false;
  constructor(public authService: AuthService) { }

  onSignup(form: NgForm) {
    this.authService.createUser(form.value.email, form.value.password);
    form.resetForm();
  }

  ngOnInit(): void {
  }

}
