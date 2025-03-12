interface Post {
  id: string;
  title: string;
  content: string;
}

export interface UserResponse {
  id: string;
  username: string;
  phone: string;
  birthday: string;
  gender: string;
  firstName: string;
  lastName: string;
  role?: string;
  posts: Post[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersQueryResponse {
  users: UserResponse[];
}
