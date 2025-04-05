export interface Account {
    id: string; 
    authenticationRecovery?: any;
    role: Role;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    passwordHash: string;
    refreshToken?: string;
  }
  
  export interface Role {
    id: number;
    name: string;
  }