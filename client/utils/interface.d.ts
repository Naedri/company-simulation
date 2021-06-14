export type User = {
  mail: string;
  id: number;
  isAdmin: boolean;
};

export type UserResponse = { user: User | null; error: ErrorClient | null };

export type ErrorClient = {
  response : {
    status: number
  };
  message: string;
};
