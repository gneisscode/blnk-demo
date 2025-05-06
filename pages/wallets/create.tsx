import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, Wallet } from "lucide-react";
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
import { toast } from "sonner";

export interface Ledger {
  ledger_id: string;
  name: string;
  currency: string;
}

export interface Identity {
  identity_id: string;
  first_name: string;
  last_name: string;
  email_address: string;
}

export default function CreateWallet() {
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ledger_id: "",
    identity_id: "",
    currency: "",
    meta_data: {
      wallet_type: "personal",
      purpose: "general",
      status: "active",
    },
  });
  const router = useRouter();

  useEffect(() => {
    fetchLedgers();
    fetchIdentities();
  }, []);

  const fetchLedgers = async () => {
    try {
      const response = await fetch("/api/ledgers");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching ledgers");
      }
      setLedgers(data);
    } catch (err: any) {
      toast.error("Failed to load ledgers");
    }
  };

  const fetchIdentities = async () => {
    try {
      const response = await fetch("/api/identities");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching identities");
      }
      setIdentities(data);
    } catch (err: any) {
      toast.error("Failed to load identities");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/wallets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error creating wallet");
      }

      toast.success("Wallet created successfully");
      router.push("/wallets/list");
    } catch (err: any) {
      toast.error(err.message || "Failed to create wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleLedgerChange = (value: string) => {
    setFormData({
      ...formData,
      ledger_id: value,
    });
  };

  const handleCurrencyChange = (value: string) => {
    setFormData({
      ...formData,
      currency: value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-2xl mx-auto">
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

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wallets</span>
        </Button>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-main">
              <Wallet className="w-5 h-5" />
              <span>Create New Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ledger" className="text-white/90">Ledger</Label>
                  <Select
                    value={formData.ledger_id}
                    onValueChange={handleLedgerChange}
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a ledger" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      {ledgers.map((ledger) => (
                        <SelectItem key={ledger.ledger_id} value={ledger.ledger_id} className="text-white hover:bg-white/10">
                          {ledger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white/90">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={handleCurrencyChange}
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="USD" className="text-white hover:bg-white/10">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR" className="text-white hover:bg-white/10">EUR - Euro</SelectItem>
                      <SelectItem value="GBP" className="text-white hover:bg-white/10">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN" className="text-white hover:bg-white/10">NGN - Nigerian Naira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="identity" className="text-white/90">Identity</Label>
                  <Select
                    value={formData.identity_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, identity_id: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select an identity" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      {identities.map((identity) => (
                        <SelectItem key={identity.identity_id} value={identity.identity_id} className="text-white hover:bg-white/10">
                          {identity.first_name} {identity.last_name} ({identity.email_address})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet_type" className="text-white/90">Wallet Type</Label>
                  <Select
                    value={formData.meta_data.wallet_type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        meta_data: { ...formData.meta_data, wallet_type: value },
                      })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="personal" className="text-white hover:bg-white/10">Personal</SelectItem>
                      <SelectItem value="business" className="text-white hover:bg-white/10">Business</SelectItem>
                      <SelectItem value="savings" className="text-white hover:bg-white/10">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purpose" className="text-white/90">Purpose</Label>
                  <Select
                    value={formData.meta_data.purpose}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        meta_data: { ...formData.meta_data, purpose: value },
                      })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="general" className="text-white hover:bg-white/10">General</SelectItem>
                      <SelectItem value="savings" className="text-white hover:bg-white/10">Savings</SelectItem>
                      <SelectItem value="investment" className="text-white hover:bg-white/10">Investment</SelectItem>
                      <SelectItem value="business" className="text-white hover:bg-white/10">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Wallet"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
