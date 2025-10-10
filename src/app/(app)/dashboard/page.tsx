
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card>
        <CardHeader>
            <CardTitle>Welcome!</CardTitle>
        </CardHeader>
        <CardContent>
            <p>This is your temporary dashboard.</p>
        </CardContent>
      </Card>
    </div>
  );
}

    