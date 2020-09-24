import { Component, OnInit ,Inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  logo : string;

  constructor(public dialog: MatDialog, @Inject('BaseURL') private baseURL) { }

  ngOnInit(): void {
    this.logo = this.baseURL + "images/logo.png";
  }

  openLoginForm(){
    this.dialog.open(LoginComponent, {width: '400px', height: '400px'});
  }

}
