import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface CardBalance {
  balance: number;
  version: number;
  inflight_balance: number | null;
  credit_balance: number;
  inflight_credit_balance: number | null;
  debit_balance: number;
  inflight_debit_balance: number | null;
  currency_multiplier: number;
  ledger_id: string;
  identity_id: string;
  balance_id: string;
  currency: string;
  created_at: string;
  inflight_expires_at: string;
  meta_data: {
    card_details: string;
    purpose: string;
    status: string;
    wallet_type: string;
  };
}

interface Ledger {
  ledger_id: string;
  name: string;
}

interface Identity {
  identity_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
}

interface BalanceWithDetails extends CardBalance {
  ledger_name?: string;
  customer_name?: string;
}

export default function ListCardBalances() {
  const router = useRouter();
  const [balances, setBalances] = useState<BalanceWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const [balancesResponse, ledgersResponse, identitiesResponse] = await Promise.all([
        fetch("/api/balances"),
        fetch("/api/ledgers"),
        fetch("/api/identities"),
      ]);

      if (!balancesResponse.ok || !ledgersResponse.ok || !identitiesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [balancesData, ledgersData, identitiesData] = await Promise.all([
        balancesResponse.json(),
        ledgersResponse.json(),
        identitiesResponse.json(),
      ]);

      // Create lookup maps for ledgers and identities
      const ledgerMap = new Map(ledgersData.map((ledger: Ledger) => [ledger.ledger_id, ledger.name]));
      const identityMap = new Map(
        identitiesData.map((identity: Identity) => [
          identity.identity_id,
          `${identity.first_name} ${identity.last_name}`,
        ])
      );

      // Enhance balances with ledger and customer names
      const enhancedBalances = balancesData.map((balance: CardBalance) => ({
        ...balance,
        ledger_name: ledgerMap.get(balance.ledger_id) || "Unknown Ledger",
        customer_name: balance.identity_id ? identityMap.get(balance.identity_id) || "Unknown Customer" : "Not assigned",
      }));

      setBalances(enhancedBalances);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching balances");
      setLoading(false);
      toast.error("Failed to load balances");
    }
  };

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

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-main">Card Balances</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage and view all card balances in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/balances/create")}
            className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Card Balance</span>
          </Button>
        </div>

        {balances.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CreditCard className="w-12 h-12 text-yellow-main mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No card balances found</h3>
              <p className="text-sm text-white/70 mb-4">
                Get started by creating a new card balance
              </p>
              <Button
                onClick={() => router.push("/balances/create")}
                className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Card Balance</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {balances.map((balance) => (
              <Card key={balance.balance_id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-white">
                          {balance.currency} {balance.balance.toFixed(2)}
                        </h3>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            balance?.meta_data?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {balance?.meta_data?.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        <p>Balance ID: {balance.balance_id}</p>
                        <p>Ledger: {balance.ledger_name}</p>
                        <p>Customer: {balance.customer_name}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                        <span>Type: {balance?.meta_data?.wallet_type}</span>
                        <span>Purpose: {balance?.meta_data?.purpose}</span>
                        <span>
                          Created: {new Date(balance.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/balances/details/${balance.balance_id}`)}
                      className="text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10 flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 