import { useQuery } from "@tanstack/react-query";
import { type User, type Practitioner, type Client } from "@shared/schema";

interface AuthUser extends User {
  roles?: string[];
  practitionerProfile?: Practitioner | null;
  clientProfile?: Client | null;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
