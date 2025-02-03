import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { userProp } from "@/hooks";
export default function SideBar({
  user,
  onLogout,
}: {
  user: userProp | undefined;
  onLogout: () => void;
}) {
  return (
    <div className="w-64 h-screen bg-gray-100 p-4 flex flex-col items-center shadow-md">
      <Card className="w-full text-center">
        <CardHeader className="flex flex-col items-center gap-2">
          {user && (
            <div>
              <div className="text-lg font-semibold">{user.username}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Button onClick={onLogout} className="w-full mt-4">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
