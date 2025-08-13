export interface User {
  id: string;
  email: string;
  name: string;
  role: 'consultant' | 'restaurant_owner';
  restaurantId?: string; // Only for restaurant owners
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}