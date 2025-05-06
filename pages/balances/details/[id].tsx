import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, BookOpen, ExternalLink, Calendar } from "lucide-react";
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

interface BalanceWithDetails {
  balance_id: string;
  currency: string;
  balance: number;
  credit_balance: number;
  debit_balance: number;
  currency_multiplier: number;
  inflight_balance: number | null;
  inflight_expires_at: string;
  created_at: string;
  updated_at: string;
  version: number;
  meta_data: {
    status: string;
    type: string;
    description?: string;
    purpose: string;
    wallet_type: string;
    card_details: {
      masked_number: string;
      expiry: string;
      type: string;
    };
  };
  ledger_id: string;
  identity_id: string;
  amount: number;
  status: string;
  type: string;
  description?: string;
}

export default function CardBalanceDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [balance, setBalance] = useState<BalanceWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ledger, setLedger] = useState<any>(null);
  const [identity, setIdentity] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/balances/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch balance details');
        }
        const data = await response.json();
        setBalance(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchRelatedData = async () => {
      try {
        if (balance) {
          const [ledgerResponse, identityResponse] = await Promise.all([
            fetch(`/api/ledgers/${balance.ledger_id}`),
            fetch(`/api/identities/${balance.identity_id}`)
          ]);

          if (ledgerResponse.ok) {
            const ledgerData = await ledgerResponse.json();
            setLedger(ledgerData);
          }

          if (identityResponse.ok) {
            const identityData = await identityResponse.json();
            setIdentity(identityData);
          }
        }
      } catch (err) {
        console.error('Error fetching related data:', err);
      }
    };

    fetchBalance();
    fetchRelatedData();
  }, [id, balance?.ledger_id, balance?.identity_id]);

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

  if (!balance) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded">
            Balance not found
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
          <span>Back to Balances</span>
        </Button>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-yellow-main">Balance Details</CardTitle>
                {balance?.meta_data?.wallet_type === "card" && (
                  <Button
                    onClick={() => router.push(`/wallets/fund-card?cardId=${balance.balance_id}`)}
                    className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                  >
                    Fund Card
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Balance ID</dt>
                      <dd className="mt-1 text-sm text-white">{balance?.balance_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Currency</dt>
                      <dd className="mt-1 text-sm text-white">{balance?.currency}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Balance</dt>
                      <dd className="mt-1 text-sm text-white">
                        {(balance?.balance / 100).toFixed(2)} {balance?.currency}
                      </dd>
                    </div>
                    {balance?.meta_data?.wallet_type === "card" && (
                      <>
                        <div>
                          <dt className="text-sm font-medium text-white/70">Credit Balance</dt>
                          <dd className="mt-1 text-sm text-white">
                            {(balance?.credit_balance / 100).toFixed(2)} {balance?.currency}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-white/70">Debit Balance</dt>
                          <dd className="mt-1 text-sm text-white">
                            {(balance?.debit_balance / 100).toFixed(2)} {balance?.currency}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-white/70">In-flight Balance</dt>
                          <dd className="mt-1 text-sm text-white">
                            {((balance?.inflight_balance || 0) / 100).toFixed(2)} {balance?.currency}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            balance?.meta_data?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {balance?.meta_data?.status}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Type</dt>
                      <dd className="mt-1 text-sm text-white capitalize">
                        {balance?.meta_data?.wallet_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Purpose</dt>
                      <dd className="mt-1 text-sm text-white capitalize">
                        {balance?.meta_data?.purpose?.replace(/_/g, ' ')}
                      </dd>
                    </div>
                    {balance?.meta_data?.wallet_type === "card" && (
                      <>
                        <div>
                          <dt className="text-sm font-medium text-white/70">Card Type</dt>
                          <dd className="mt-1 text-sm text-white capitalize">
                            {balance?.meta_data?.card_details?.type}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-white/70">Card Number</dt>
                          <dd className="mt-1 text-sm text-white">
                            {balance?.meta_data?.card_details?.masked_number}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-white/70">Expiry Date</dt>
                          <dd className="mt-1 text-sm text-white">
                            {balance?.meta_data?.card_details?.expiry}
                          </dd>
                        </div>
                      </>
                    )}
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-yellow-main">
                <BookOpen className="w-5 h-5" />
                <span>Related Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Ledger Information</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/ledgers/details/${balance?.ledger_id}`)}
                      className="text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10 flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Ledger Name</dt>
                      <dd className="mt-1 text-sm text-white">{ledger?.name || 'Loading...'}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">Identity Information</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/identities/details/${balance?.identity_id}`)}
                      className="text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10 flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Name</dt>
                      <dd className="mt-1 text-sm text-white">
                        {identity ? `${identity.first_name} ${identity.last_name}` : 'Loading...'}
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
                  <dt className="text-sm font-medium text-white/70">Created At</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(balance?.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-white/70">Last Updated</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(balance?.updated_at).toLocaleString()}
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