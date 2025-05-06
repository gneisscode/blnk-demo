import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, Wallet, Calendar, Tag, User, BookOpen, ExternalLink, ArrowDown, ArrowUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

interface Ledger {
  ledger_id: string;
  name: string;
  currency: string;
}

interface Identity {
  identity_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
}

export default function WalletDetails() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [ledger, setLedger] = useState<Ledger | null>(null);
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawDescription, setWithdrawDescription] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [fundDescription, setFundDescription] = useState("");
  const [isFunding, setIsFunding] = useState(false);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchWalletDetails();
    }
  }, [id]);

  const fetchWalletDetails = async () => {
    try {
      const response = await fetch(`/api/wallets/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching wallet details");
      }
      setWallet(data);
      
      // Fetch ledger details
      const ledgerResponse = await fetch(`/api/ledgers/${data.ledger_id}`);
      const ledgerData = await ledgerResponse.json();
      console.log('Ledger API Response:', ledgerData);
      if (ledgerResponse.ok) {
        setLedger(ledgerData);
      } else {
        console.error('Ledger API Error:', ledgerData);
      }

      // Fetch identity details
      const identityResponse = await fetch(`/api/identities/${data.identity_id}`);
      const identityData = await identityResponse.json();
      if (identityResponse.ok) {
        setIdentity(identityData);
      }

      setLoading(false);
    } catch (err: any) {
      console.error('Error in fetchWalletDetails:', err);
      setError(err.message || "Error fetching wallet details");
      setLoading(false);
      toast.error("Failed to load wallet details");
    }
  };

  const handleWithdraw = async () => {
    if (!wallet) return;

    setIsWithdrawing(true);
    try {
      const amount = parseFloat(withdrawAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          precision: 100,
          reference: `WD-${Date.now()}`,
          description: withdrawDescription || "Withdrawal from wallet",
          currency: wallet?.currency,
          source: wallet?.balance_id,
          destination: "@WorldUSD", // This should be your main wallet ID
          allow_overdraft: false,
          meta_data: {
            transaction_type: "withdrawal",
            channel: "wallet_transfer"
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error processing withdrawal");
      }

      toast.success("Withdrawal processed successfully");
      setIsWithdrawDialogOpen(false);
      setWithdrawAmount("");
      setWithdrawDescription("");
      fetchWalletDetails(); // Refresh wallet details
    } catch (err: any) {
      toast.error(err.message || "Failed to process withdrawal");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleFund = async () => {
    if (!wallet) return;

    setIsFunding(true);
    try {
      const amount = parseFloat(fundAmount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          precision: 100,
          reference: `DEP-${Date.now()}`,
          description: fundDescription || "Deposit to wallet",
          currency: wallet?.currency,
          source: "@WorldUSD", // This should be your main wallet ID
          destination: wallet?.balance_id,
          allow_overdraft: true,
          meta_data: {
            transaction_type: "deposit",
            channel: "bank_transfer"
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error processing deposit");
      }

      toast.success("Deposit processed successfully");
      setIsFundDialogOpen(false);
      setFundAmount("");
      setFundDescription("");
      fetchWalletDetails(); // Refresh wallet details
    } catch (err: any) {
      toast.error(err.message || "Failed to process deposit");
    } finally {
      setIsFunding(false);
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

  if (!wallet) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded">
            Wallet not found
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
          <span>Back to Wallets</span>
        </Button>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-yellow-main">Wallet Details</CardTitle>
                <div className="flex items-center space-x-4">
                  <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                      >
                        Fund Wallet
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black-main border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-yellow-main">Fund Wallet</DialogTitle>
                        <DialogDescription className="text-white/70">
                          Enter the amount you want to fund this wallet with.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="fundAmount" className="text-white/70">Amount</Label>
                          <Input
                            id="fundAmount"
                            type="number"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fundDescription" className="text-white/70">Description</Label>
                          <Input
                            id="fundDescription"
                            value={fundDescription}
                            onChange={(e) => setFundDescription(e.target.value)}
                            placeholder="Enter description"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setIsFundDialogOpen(false)}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleFund}
                          disabled={isFunding || !fundAmount}
                          className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                        >
                          {isFunding ? (
                            <div className="flex items-center space-x-2">
                              <div className="relative w-4 h-4">
                                <div className="absolute inset-0 border-2 border-black-main/20 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-t-black-main rounded-full animate-spin"></div>
                              </div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Fund Wallet"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-yellow-main text-yellow-main hover:bg-yellow-main/10"
                      >
                        Withdraw
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-black-main border-white/10">
                      <DialogHeader>
                        <DialogTitle className="text-yellow-main">Withdraw from Wallet</DialogTitle>
                        <DialogDescription className="text-white/70">
                          Enter the amount you want to withdraw from this wallet.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="withdrawAmount" className="text-white/70">Amount</Label>
                          <Input
                            id="withdrawAmount"
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="withdrawDescription" className="text-white/70">Description</Label>
                          <Input
                            id="withdrawDescription"
                            value={withdrawDescription}
                            onChange={(e) => setWithdrawDescription(e.target.value)}
                            placeholder="Enter description"
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="ghost"
                          onClick={() => setIsWithdrawDialogOpen(false)}
                          className="text-white/70 hover:text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleWithdraw}
                          disabled={isWithdrawing || !withdrawAmount}
                          className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                        >
                          {isWithdrawing ? (
                            <div className="flex items-center space-x-2">
                              <div className="relative w-4 h-4">
                                <div className="absolute inset-0 border-2 border-black-main/20 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-t-black-main rounded-full animate-spin"></div>
                              </div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Withdraw"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Wallet ID</dt>
                      <dd className="mt-1 text-sm text-white">{wallet?.balance_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Currency</dt>
                      <dd className="mt-1 text-sm text-white">{wallet?.currency}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Balance</dt>
                      <dd className="mt-1 text-sm text-white">
                        {wallet?.balance} {wallet?.currency}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Wallet Type</dt>
                      <dd className="mt-1 text-sm text-white">
                        {wallet?.meta_data?.wallet_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Purpose</dt>
                      <dd className="mt-1 text-sm text-white">
                        {wallet?.meta_data?.purpose}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            wallet?.meta_data?.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {wallet?.meta_data?.status}
                        </span>
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
                      onClick={() => router.push(`/ledgers/details/${wallet?.ledger_id}`)}
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
                      onClick={() => router.push(`/identities/details/${wallet?.identity_id}`)}
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
                    {new Date(wallet?.created_at).toLocaleString()}
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