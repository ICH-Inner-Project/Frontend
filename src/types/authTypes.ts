export interface LoginResponse {
  login: {
    user: {
      id: string;
      username: string;
      phone: string;
      birthday: string;
      gender: string;
      firstName: string;
      lastName: string;
      role: string;
      posts: string[];
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}
