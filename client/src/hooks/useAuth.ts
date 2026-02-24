import { useQuery } from "@tanstack/react-query";
import { type User, type Practitioner, type Client } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

interface AuthUser extends User {
  roles?: string[];
  practitionerProfile?: Practitioner | null;
  clientProfile?: Client | null;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
  };
}
