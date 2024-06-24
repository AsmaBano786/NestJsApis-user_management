// user.model.ts
// User is an interface that defines the structure of a user object.
//It includes properties like id, name, email, phoneNumber, and address.


export interface User {
    id?: number; // or use a UUID
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
  }
  