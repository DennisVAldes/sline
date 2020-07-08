import { Component, OnInit } from '@angular/core';
import { UserDto } from 'src/app/types/dtos/models';
import { UserService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor( private userService: UserService ) { }

  users: UserDto[];

  private getUsers = async () => {
    try {
      const response = await this.userService.getUsers();
      this.users = response.data;
      console.log(this.users);
    
    } catch (error) {
      console.log(error);
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }
}
