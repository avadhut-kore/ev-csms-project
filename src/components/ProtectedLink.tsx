// src/components/ProtectedLink.tsx
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Function to get user role from localStorage, but only on the client side
const getUserRole = (): string => {
    if (typeof window !== 'undefined') { // Ensure code runs only on the client
      return localStorage.getItem('userRoles') || '';
    }
    return ''; // Return empty string on the server
  };

const ProtectedLink = ({ href, children, requiredRole }: { href: string; children: React.ReactNode; requiredRole: string }) => {
  const router = useRouter();
  const role = getUserRole(); // Fetch role directly

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    const regex = new RegExp(`\\b${requiredRole.trim()}\\b`);
    if (!regex.test(role)) {
      e.preventDefault(); // Prevent navigation
      alert('Unauthorized access! You do not have permission to view this page.');
      return;
    }
  };

  return (
    <Link href={href} onClick={handleClick}>
      {children}
    </Link>
  );
};

export default ProtectedLink;
