import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeft,
  BookOpen,
  Users,
  Wallet,
  Activity,
  DollarSign,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LedgerDetails {
  ledger_id: string;
  name: string;
  created_at: string;
  meta_data: {
    project_owner?: string;
    description?: string;
  };
  currency: string;
  status: string;
  type: string;
  updated_at: string;
  description?: string;
}

export default function LedgerDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [ledger, setLedger] = useState<LedgerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [identities, setIdentities] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchLedger = async () => {
      try {
        const response = await fetch(`/api/ledgers/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch ledger details");
        }
        const data = await response.json();
        setLedger(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-yellow-main/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-yellow-main rounded-full animate-spin"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!ledger) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded">
            Ledger not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Ledgers</span>
        </Button>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-yellow-main">
                Ledger Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Basic Information
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Ledger ID
                      </dt>
                      <dd className="mt-1 text-sm text-white">
                        {ledger?.ledger_id}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Name
                      </dt>
                      <dd className="mt-1 text-sm text-white">
                        {ledger?.name}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Currency
                      </dt>
                      <dd className="mt-1 text-sm text-white">
                        {ledger?.currency}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Additional Information
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Status
                      </dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ledger?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {ledger?.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Type
                      </dt>
                      <dd className="mt-1 text-sm text-white">
                        {ledger?.type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">
                        Description
                      </dt>
                      <dd className="mt-1 text-sm text-white">
                        {ledger?.description || "No description"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-main">
                <Calendar className="w-5 h-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-white/70">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(ledger?.created_at).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
