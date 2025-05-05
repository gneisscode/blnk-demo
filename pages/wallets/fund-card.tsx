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
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error || !cardBalance ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error || "Card not found"}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6" />
                <CardTitle>Fund Card</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Card Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Card Number</p>
                    <p className="font-medium">
                      {cardBalance.meta_data?.card_details?.masked_number ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Current Balance</p>
                    <p className="font-medium">
                      {cardBalance.currency}{" "}
                      {(cardBalance.balance / 100).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Card Type</p>
                    <p className="font-medium capitalize">
                      {cardBalance.meta_data?.card_details?.type || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Expiry Date</p>
                    <p className="font-medium">
                      {cardBalance.meta_data?.card_details?.expiry || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sourceWallet">Source Wallet</Label>
                    <Select
                      value={sourceWallet}
                      onValueChange={setSourceWallet}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem
                            key={wallet.balance_id}
                            value={wallet.balance_id}
                          >
                            {wallet.currency} Wallet: {(wallet.balance / 100).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        placeholder="Enter amount"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={processing || !amount || !sourceWallet}
                >
                  {processing ? "Processing..." : "Fund Card"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
