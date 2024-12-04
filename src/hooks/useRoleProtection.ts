'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

// Custom hook to check user's role
const useRoleProtection = (requiredRole: string) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRoles');

    if (userRole !== requiredRole) {
      router.push('/unauthorized');  // Redirect if role is not valid
    } else {
      setLoading(false);  // Stop loading when role is confirmed
    }
  }, [router, requiredRole]);

  return { loading };
};

export default useRoleProtection;
