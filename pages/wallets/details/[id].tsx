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

  if (!wallet) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Wallet not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wallets</span>
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Wallet Information</span>
                </CardTitle>
                <div className="flex space-x-2">
                  <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <ArrowUp className="w-4 h-4" />
                        <span>Fund Wallet</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Fund Wallet</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          Enter the amount you want to deposit into this wallet?.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="fundAmount" className="text-gray-700">Amount ({wallet?.currency})</Label>
                          <Input
                            id="fundAmount"
                            type="number"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="bg-white border-gray-200"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="fundDescription" className="text-gray-700">Description</Label>
                          <Input
                            id="fundDescription"
                            value={fundDescription}
                            onChange={(e) => setFundDescription(e.target.value)}
                            placeholder="Enter description (optional)"
                            className="bg-white border-gray-200"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsFundDialogOpen(false)}
                          disabled={isFunding}
                          className="border-gray-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleFund}
                          disabled={isFunding || !fundAmount}
                        >
                          {isFunding ? "Processing..." : "Deposit"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="flex items-center space-x-2">
                        <ArrowDown className="w-4 h-4" />
                        <span>Withdraw</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-white border border-gray-200">
                      <DialogHeader>
                        <DialogTitle className="text-gray-900">Withdraw from Wallet</DialogTitle>
                        <DialogDescription className="text-gray-500">
                          Enter the amount you want to withdraw from this wallet?.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="amount" className="text-gray-700">Amount ({wallet?.currency})</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="bg-white border-gray-200"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description" className="text-gray-700">Description</Label>
                          <Input
                            id="description"
                            value={withdrawDescription}
                            onChange={(e) => setWithdrawDescription(e.target.value)}
                            placeholder="Enter description (optional)"
                            className="bg-white border-gray-200"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsWithdrawDialogOpen(false)}
                          disabled={isWithdrawing}
                          className="border-gray-200"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleWithdraw}
                          disabled={isWithdrawing || !withdrawAmount}
                        >
                          {isWithdrawing ? "Processing..." : "Withdraw"}
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Wallet ID</dt>
                      <dd className="mt-1 text-sm text-gray-900">{wallet?.balance_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Currency</dt>
                      <dd className="mt-1 text-sm text-gray-900">{wallet?.currency}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Balance</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {wallet?.balance} {wallet?.currency}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Additional Information
                  </h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Wallet Type</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {wallet?.meta_data?.wallet_type}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Purpose</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {wallet?.meta_data?.purpose}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            wallet?.meta_data?.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5" />
                <span>Related Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Ledger Information
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/ledgers/details/${wallet?.ledger_id}`)}
                      className="flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Ledger Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">{ledger?.name || 'Loading...'}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Identity Information
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/identities/details/${wallet?.identity_id}`)}
                      className="flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {identity ? `${identity.first_name} ${identity.last_name}` : 'Loading...'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
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