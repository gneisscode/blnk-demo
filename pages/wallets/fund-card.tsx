import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "sonner";

interface Wallet {
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
    card_details?: {
      expiry: string;
      masked_number: string;
      type: string;
    };
    purpose: string;
    status: string;
    wallet_type: string;
  };
}

export default function FundCard() {
  const router = useRouter();
  const { cardId } = router.query;
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [cardBalance, setCardBalance] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [amount, setAmount] = useState("");
  const [sourceWallet, setSourceWallet] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (cardId) {
      fetchData();
    }
  }, [cardId]);

  const fetchData = async () => {
    try {
      const [walletsResponse, cardResponse] = await Promise.all([
        fetch("/api/wallets"),
        fetch(`/api/balances/${cardId}`),
      ]);

      if (!walletsResponse.ok || !cardResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [walletsData, cardData] = await Promise.all([
        walletsResponse.json(),
        cardResponse.json(),
      ]);

      // Validate card data
      if (
        !cardData ||
        !cardData.meta_data ||
        cardData.meta_data.wallet_type !== "card"
      ) {
        throw new Error("Invalid card data");
      }

      // Filter out card wallets and inactive wallets
      const mainWallets = walletsData.filter(
        (wallet: Wallet) => wallet?.meta_data?.status === "active"
      );

      console.log("Available wallets:", mainWallets); // Debug log
      setWallets(mainWallets);
      setCardBalance(cardData);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching data");
      setLoading(false);
      toast.error("Failed to load data");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !sourceWallet || !cardBalance) return;

    const amountInCents = Math.round(parseFloat(amount) * 100);
    const selectedWallet = wallets.find((w) => w.balance_id === sourceWallet);

    if (!selectedWallet) {
      toast.error("Selected wallet not found");
      return;
    }

    if (amountInCents > selectedWallet.balance) {
      toast.error("Insufficient balance in source wallet");
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents,
          precision: 100,
          reference: `TRF-${new Date()
            .toISOString()
            .slice(0, 19)
            .replace(/[-:]/g, "")}`,
          description: "Transfer to card wallet",
          currency: cardBalance.currency,
          source: sourceWallet,
          destination: cardBalance.balance_id,
          meta_data: {
            transaction_type: "internal_transfer",
            purpose: "fund_card",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to process transaction");
      }

      toast.success("Card funded successfully");
      router.push(`/balances/details/${cardBalance.balance_id}`);
    } catch (err: any) {
      setError(err.message || "Error processing transaction");
      toast.error(err.message || "Failed to fund card");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-yellow-main/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-yellow-main rounded-full animate-spin"></div>
            </div>
          </div>
        ) : error || !cardBalance ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded">
            {error || "Card not found"}
          </div>
        ) : (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-yellow-main" />
                <CardTitle className="text-2xl font-bold text-yellow-main">Fund Card</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-4">Card Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/70">Card Number</p>
                    <p className="font-medium text-white">
                      {cardBalance.meta_data?.card_details?.masked_number || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Current Balance</p>
                    <p className="font-medium text-white">
                      {cardBalance.currency} {(cardBalance.balance / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Card Type</p>
                    <p className="font-medium text-white capitalize">
                      {cardBalance.meta_data?.card_details?.type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Expiry Date</p>
                    <p className="font-medium text-white">
                      {cardBalance.meta_data?.card_details?.expiry || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sourceWallet" className="text-white/70">Source Wallet</Label>
                    <Select
                      value={sourceWallet}
                      onValueChange={setSourceWallet}
                      required
                    >
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select a wallet" />
                      </SelectTrigger>
                      <SelectContent className="bg-black-main border-white/10">
                        {wallets.map((wallet) => (
                          <SelectItem
                            key={wallet.balance_id}
                            value={wallet.balance_id}
                            className="text-white hover:bg-white/10"
                          >
                            {wallet.currency} Wallet: {(wallet.balance / 100).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount" className="text-white/70">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={processing || !amount || !sourceWallet}
                  className="w-full bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                >
                  {processing ? (
                    <div className="flex items-center space-x-2">
                      <div className="relative w-4 h-4">
                        <div className="absolute inset-0 border-2 border-black-main/20 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-t-black-main rounded-full animate-spin"></div>
                      </div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Fund Card"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
