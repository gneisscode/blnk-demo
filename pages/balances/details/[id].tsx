import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
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
    card_details: {
      expiry: string;
      masked_number: string;
      type: string;
    };
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

interface IdentityDetails {
  name: string;
  email: string;
}

interface BalanceWithDetails extends CardBalance {
  ledger_name?: string;
  customer_name?: string;
  customer_email?: string;
}

export default function CardBalanceDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [balance, setBalance] = useState<BalanceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchBalanceDetails();
    }
  }, [id]);

  const fetchBalanceDetails = async () => {
    try {
      const [balanceResponse, ledgersResponse, identitiesResponse] = await Promise.all([
        fetch(`/api/balances/${id}`),
        fetch("/api/ledgers"),
        fetch("/api/identities"),
      ]);

      if (!balanceResponse.ok || !ledgersResponse.ok || !identitiesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [balanceData, ledgersData, identitiesData] = await Promise.all([
        balanceResponse.json(),
        ledgersResponse.json(),
        identitiesResponse.json(),
      ]);

      // Create lookup maps for ledgers and identities
      const ledgerMap = new Map(ledgersData.map((ledger: Ledger) => [ledger.ledger_id, ledger.name]));
      const identityMap = new Map<string, IdentityDetails>(
        identitiesData.map((identity: Identity) => [
          identity.identity_id,
          {
            name: `${identity.first_name} ${identity.last_name}`,
            email: identity.email_address,
          },
        ])
      );

      // Enhance balance with ledger and customer details
      const enhancedBalance = {
        ...balanceData,
        ledger_name: ledgerMap.get(balanceData.ledger_id) || "Unknown Ledger",
        customer_name: balanceData.identity_id
          ? identityMap.get(balanceData.identity_id)?.name || "Unknown Customer"
          : "Not assigned",
        customer_email: balanceData.identity_id
          ? identityMap.get(balanceData.identity_id)?.email
          : undefined,
      };

      setBalance(enhancedBalance);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching balance details");
      setLoading(false);
      toast.error("Failed to load balance details");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !balance) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || "Balance not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Balances</span>
          </Button>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-6 h-6" />
                  <CardTitle>Card Balance Details</CardTitle>
                </div>
                <Button
                  onClick={() => router.push(`/wallets/fund-card?cardId=${balance.balance_id}`)}
                  className="flex items-center space-x-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Fund Card</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Balance ID</h3>
                    <p className="mt-1 text-lg">{balance.balance_id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Current Balance</h3>
                    <p className="mt-1 text-lg font-semibold">
                      {balance.currency} {balance.balance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Credit Balance</h3>
                    <p className="mt-1 text-lg">
                      {balance.currency} {balance.credit_balance.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Debit Balance</h3>
                    <p className="mt-1 text-lg">
                      {balance.currency} {balance.debit_balance.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Ledger</h3>
                    <p className="mt-1 text-lg">{balance.ledger_name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1 text-lg">{balance.customer_name}</p>
                    {balance.customer_email && (
                      <p className="mt-1 text-sm text-gray-500">{balance.customer_email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <p className="mt-1">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          balance.meta_data.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {balance.meta_data.status}
                      </span>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                    <p className="mt-1 text-lg">
                      {new Date(balance.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-medium mb-4">Card Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Card Number</h4>
                    <p className="mt-1 text-lg">{balance.meta_data.card_details.masked_number}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Expiry Date</h4>
                    <p className="mt-1 text-lg">{balance.meta_data.card_details.expiry}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Card Type</h4>
                    <p className="mt-1 text-lg capitalize">{balance.meta_data.card_details.type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Purpose</h4>
                    <p className="mt-1 text-lg">{balance.meta_data.purpose}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Wallet Type</h4>
                    <p className="mt-1 text-lg capitalize">{balance.meta_data.wallet_type}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Version</h4>
                    <p className="mt-1 text-lg">{balance.version}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-lg font-medium mb-4">Balance Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Current Balance</h4>
                    <p className="mt-1 text-lg font-semibold">
                      {balance.currency} {(balance.balance / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Credit Balance</h4>
                    <p className="mt-1 text-lg">
                      {balance.currency} {(balance.credit_balance / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Debit Balance</h4>
                    <p className="mt-1 text-lg">
                      {balance.currency} {(balance.debit_balance / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Currency Multiplier</h4>
                    <p className="mt-1 text-lg">{balance.currency_multiplier}</p>
                  </div>
                  {balance.inflight_balance !== null && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Inflight Balance</h4>
                      <p className="mt-1 text-lg">
                        {balance.currency} {(balance.inflight_balance / 100).toFixed(2)}
                      </p>
                    </div>
                  )}
                  {balance.inflight_expires_at !== "0001-01-01T00:00:00Z" && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Inflight Expires At</h4>
                      <p className="mt-1 text-lg">
                        {new Date(balance.inflight_expires_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 