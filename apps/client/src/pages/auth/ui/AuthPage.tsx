import { AuthByEmailForm } from '@/features/auth-by-email';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

export const AuthPage = () => (
  <div className="flex h-full items-center justify-center p-6">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Solvex</CardTitle>
        <CardDescription>Sign in to join voice rooms</CardDescription>
      </CardHeader>
      <CardContent>
        <AuthByEmailForm />
      </CardContent>
    </Card>
  </div>
);
