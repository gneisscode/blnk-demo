import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Wallet, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Wallet {
  balance_id: string;
  ledger_id: string;
  identity_id: string;
  currency: string;
  balance: number;
  created_at: string;
  meta_data: {
    wallet_type: string;
    purpose: string;
    status: string;
  };
}

export default function WalletList() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await fetch("/api/wallets");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching wallets");
      }
      setWallets(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching wallets");
      setLoading(false);
      toast.error("Failed to load wallets");
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

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Wallets</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and view all wallets in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/wallets/create")}
            className="flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Wallet</span>
          </Button>
        </div>

        {wallets?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No wallets found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get started by creating a new wallet
              </p>
              <Button
                onClick={() => router.push("/wallets/create")}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Wallet</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {wallets?.map((wallet) => (
              <Card key={wallet.balance_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {wallet.currency} Wallet
                        </h3>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            wallet?.meta_data?.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {wallet?.meta_data?.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>Balance: {wallet.balance} {wallet.currency}</p>
                        <p>Type: {wallet?.meta_data?.wallet_type}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Purpose: {wallet?.meta_data?.purpose}</span>
                        <span>
                          Created: {new Date(wallet.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/wallets/details/${wallet.balance_id}`)}
                      className="flex items-center space-x-2"
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