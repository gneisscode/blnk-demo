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

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Wallets</span>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="w-5 h-5" />
              <span>Create New Wallet</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ledger">Ledger</Label>
                  <Select
                    value={formData.ledger_id}
                    onValueChange={handleLedgerChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a ledger" />
                    </SelectTrigger>
                    <SelectContent>
                      {ledgers.map((ledger) => (
                        <SelectItem key={ledger.ledger_id} value={ledger.ledger_id}>
                          {ledger.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={handleCurrencyChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="identity">Identity</Label>
                  <Select
                    value={formData.identity_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, identity_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an identity" />
                    </SelectTrigger>
                    <SelectContent>
                      {identities.map((identity) => (
                        <SelectItem key={identity.identity_id} value={identity.identity_id}>
                          {identity.first_name} {identity.last_name} ({identity.email_address})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="wallet_type">Wallet Type</Label>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="purpose">Purpose</Label>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="savings">Savings</SelectItem>
                      <SelectItem value="investment">Investment</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create Wallet"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
