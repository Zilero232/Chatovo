import { useCurrentUser } from '@/entities/user';
import { CreateRoomForm } from '@/features/create-room';
import { JoinRoomForm } from '@/features/join-room';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Topbar } from '@/widgets/topbar';

export const LobbyPage = () => {
  const { isAdmin } = useCurrentUser();

  return (
    <div className="flex h-full flex-col">
      <Topbar />
      <main className="flex flex-1 items-start justify-center p-6">
        <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Join a room</CardTitle>
              <CardDescription>Enter an existing room name</CardDescription>
            </CardHeader>
            <CardContent>
              <JoinRoomForm />
            </CardContent>
          </Card>

          {isAdmin ? (
            <Card>
              <CardHeader>
                <CardTitle>Create a room</CardTitle>
                <CardDescription>Admin only — creates room on first connect</CardDescription>
              </CardHeader>
              <CardContent>
                <CreateRoomForm />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
};
