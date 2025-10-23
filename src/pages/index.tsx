import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Index,
});

/**
 * Home page component that redirects to compare-data
 */
function Index() {
  return <Navigate to="/compare-data" />;
}
