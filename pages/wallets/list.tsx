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
            <h1 className="text-3xl font-bold text-yellow-main">Wallets</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage and view all wallets in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/wallets/create")}
            className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Wallet</span>
          </Button>
        </div>

        {wallets?.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="w-12 h-12 text-yellow-main mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No wallets found</h3>
              <p className="text-sm text-white/70 mb-4">
                Get started by creating a new wallet
              </p>
              <Button
                onClick={() => router.push("/wallets/create")}
                className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Wallet</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {wallets?.map((wallet) => (
              <Card key={wallet.balance_id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-white">
                          {wallet.currency} Wallet
                        </h3>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            wallet?.meta_data?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {wallet?.meta_data?.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        <p>Balance: {wallet.balance} {wallet.currency}</p>
                        <p>Type: {wallet?.meta_data?.wallet_type}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                        <span>Purpose: {wallet?.meta_data?.purpose}</span>
                        <span>
                          Created: {new Date(wallet.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/wallets/details/${wallet.balance_id}`)}
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