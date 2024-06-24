// user.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { User } from 'src/user/model/user/user.model';

@Injectable()
export class UserService {
  private users: User[] = [];

  createUser(user: User): User|string {
        // Check if a user with the same email already exists
        const existingUserEmail = this.users.find(u => u.email === user.email);
        if (existingUserEmail) {
          throw new HttpException({
            success: false,
            error: true,
            message: 'User with this email already exists',
          }, HttpStatus.BAD_REQUEST);
        }
        const existingUserPhoneNumber = this.users.find(u => u.phoneNumber === user.phoneNumber);
        if (existingUserPhoneNumber) {
          throw new HttpException({
            success: false,
            error: true,
            message: 'User with this phone Number already exists',
          }, HttpStatus.BAD_REQUEST);
        }
    // Generate a unique ID for the new user
    const newUser = { id: Date.now(), ...user };
    this.users.push(newUser);
    return newUser;
  }

  findAllUsers(): User[] {
    return this.users;
  }

  findUserById(id: number): User {
    console.log(id,typeof id);
    
    return this.users.find(user => user.id === id);
  }

  updateUser(id: number, updatedUser: User): User {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.users[index];
    }
    return null;
  }

  deleteUser(id: number): User {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      const deletedUser = this.users[index];
      this.users.splice(index, 1);
      return deletedUser;
    }
    return null;
  }
}
