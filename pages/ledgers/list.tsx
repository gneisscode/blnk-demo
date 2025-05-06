import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Ledger {
  ledger_id: string;
  name: string;
  created_at: string;
  meta_data?: {
    description?: string;
    project_owner?: string;
  };
}

export default function LedgerList() {
  const router = useRouter();
  const [ledgers, setLedgers] = useState<Ledger[]>([]);

  useEffect(() => {
    const fetchLedgers = async () => {
      try {
        const response = await fetch('/api/ledgers');
        if (!response.ok) {
          throw new Error('Failed to fetch ledgers');
        }
        const data = await response.json();
        setLedgers(data);
      } catch (error) {
        console.error('Error fetching ledgers:', error);
      }
    };

    fetchLedgers();
  }, []);

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-yellow-main">Ledgers</h1>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-yellow-main" />
            <span className="text-white/90">
              Total Ledgers: {ledgers?.length}
            </span>
          </div>
        </div>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70 uppercase tracking-wider">
                      Project Owner
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/70 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {ledgers.map((ledger) => (
                    <tr key={ledger.ledger_id} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-white/90">
                        {ledger.name}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {ledger.meta_data?.description || '-'}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {ledger.meta_data?.project_owner || '-'}
                      </td>
                      <td className="px-6 py-4 text-white/80">
                        {new Date(ledger.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/ledgers/details/${ledger.ledger_id}`)}
                            className="text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
                          >
                            View Details
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
