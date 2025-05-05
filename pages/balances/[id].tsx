import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CardBalance {
  id: string;
  ledger_id: string;
  identity_id: string;
  currency: string;
  meta_data: {
    wallet_type: string;
    purpose: string;
    status: string;
    card_details: {
      masked_number: string;
      expiry: string;
      type: string;
    };
  };
}

interface WalletBalance {
  id: string;
  currency: string;
  balance: number;
  meta_data: {
    wallet_type: string;
    purpose: string;
  };
}

export default function CardBalanceDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [balance, setBalance] = useState<CardBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wallets, setWallets] = useState<WalletBalance[]>([]);
  const [isFunding, setIsFunding] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  useEffect(() => {
    if (id) {
      fetchBalanceDetails();
      fetchWallets();
    }
  }, [id]);

  const fetchBalanceDetails = async () => {
    try {
      const response = await fetch(`/api/balances/${id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch balance details");
      }

      const data = await response.json();
      setBalance(data);
    } catch (error) {
      toast.error("Failed to fetch balance details");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWallets = async () => {
    try {
      const response = await fetch("/api/balances");
      if (!response.ok) {
        throw new Error("Failed to fetch wallets");
      }
      const data = await response.json();
      setWallets(data);
    } catch (error) {
      toast.error("Failed to fetch wallets");
      console.error(error);
    }
  };

  const handleFundCard = async () => {
    if (!selectedWallet || !fundAmount) {
      toast.error("Please select a wallet and enter an amount");
      return;
    }

    setIsFunding(true);
    try {
      const amount = parseFloat(fundAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Invalid amount");
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          precision: 100,
          reference: `TRF-${new Date().toISOString().slice(0, 19).replace(/[-:]/g, "")}`,
          description: "Transfer to card wallet",
          currency: balance?.currency,
          source: selectedWallet,
          destination: id,
          meta_data: {
            transaction_type: "internal_transfer",
            purpose: "fund_card",
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fund card");
      }

      toast.success("Card funded successfully");
      // Refresh balance details
      fetchBalanceDetails();
      // Reset form
      setFundAmount("");
      setSelectedWallet("");
    } catch (error) {
      toast.error("Failed to fund card");
      console.error(error);
    } finally {
      setIsFunding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Balance not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Card Balance Details</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button>Fund Card</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Fund Card</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="wallet">Select Source Wallet</Label>
                    <Select
                      value={selectedWallet}
                      onValueChange={setSelectedWallet}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a wallet" />
                      </SelectTrigger>
                      <SelectContent>
                        {wallets.map((wallet) => (
                          <SelectItem key={wallet.id} value={wallet.id}>
                            {wallet.currency} - {wallet.meta_data.purpose} (Balance: {wallet.balance / 100})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={fundAmount}
                      onChange={(e) => setFundAmount(e.target.value)}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <Button
                    className="w-full"
                    onClick={handleFundCard}
                    disabled={isFunding}
                  >
                    {isFunding ? "Processing..." : "Fund Card"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">ID</h3>
                <p className="mt-1">{balance.id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ledger ID</h3>
                <p className="mt-1">{balance.ledger_id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Identity ID</h3>
                <p className="mt-1">{balance.identity_id}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Currency</h3>
                <p className="mt-1">{balance.currency}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Card Details</h3>
                <div className="mt-1 space-y-2">
                  <p><span className="font-medium">Number:</span> {balance.meta_data.card_details.masked_number}</p>
                  <p><span className="font-medium">Expiry:</span> {balance.meta_data.card_details.expiry}</p>
                  <p><span className="font-medium">Type:</span> {balance.meta_data.card_details.type}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <p className="mt-1">{balance.meta_data.status}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Purpose</h3>
                <p className="mt-1">{balance.meta_data.purpose}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 