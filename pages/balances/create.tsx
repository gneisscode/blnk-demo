import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Identity, Ledger } from "../wallets/create";
import { ArrowLeft } from "lucide-react";

interface FormData {
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

export default function CreateCardBalance() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [ledgers, setLedgers] = useState<Ledger[]>([]);
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [expiryError, setExpiryError] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    ledger_id: "",
    identity_id: "",
    currency: "USD",
    meta_data: {
      wallet_type: "card",
      purpose: "card_payments",
      status: "active",
      card_details: {
        masked_number: "",
        expiry: "",
        type: "virtual",
      },
    },
  });

  useEffect(() => {
    fetchLedgersAndIdentities();
  }, []);

  const fetchLedgersAndIdentities = async () => {
    try {
      const [ledgersResponse, identitiesResponse] = await Promise.all([
        fetch("/api/ledgers"),
        fetch("/api/identities"),
      ]);

      if (!ledgersResponse.ok || !identitiesResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [ledgersData, identitiesData] = await Promise.all([
        ledgersResponse.json(),
        identitiesResponse.json(),
      ]);

      setLedgers(ledgersData);
      setIdentities(identitiesData);
    } catch (error) {
      toast.error("Failed to fetch ledgers and identities");
      console.error(error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate expiry date before submission
    if (!validateExpiryDate(formData.meta_data.card_details.expiry)) {
      return; // Prevent submission if expiry date is invalid
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/balances", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create card balance");
      }

      const data = await response.json();
      toast.success("Card balance created successfully");
      router.push("/balances/list");
    } catch (error) {
      toast.error("Failed to create card balance");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateExpiryDate = (expiry: string): boolean => {
    // If the expiry is incomplete, don't validate yet
    if (expiry.length < 5) {
      setExpiryError("");
      return true; // Allow incomplete input
    }

    const regex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!regex.test(expiry)) {
      setExpiryError("Expiry date must be in MM/YY format");
      return false;
    }

    const [month, year] = expiry.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (
      parseInt(year) < currentYear ||
      (parseInt(year) === currentYear && parseInt(month) < currentMonth)
    ) {
      setExpiryError("Card has expired");
      return false;
    }

    setExpiryError("");
    return true;
  };

  const formatExpiryDate = (value: string): string => {
    // Remove any non-digit characters
    const digits = value.replace(/\D/g, "");

    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      if (parent === "meta_data" && child === "card_details") {
        if (grandchild === "expiry") {
          const formattedValue = formatExpiryDate(value);
          if (formattedValue.length > 5) return; // Prevent input longer than MM/YY

          // Update the value without immediate validation
          setFormData((prev) => ({
            ...prev,
            meta_data: {
              ...prev.meta_data,
              card_details: {
                ...prev.meta_data.card_details,
                [grandchild]: formattedValue,
              },
            },
          }));

          // Optional: validate on blur or when format is complete
          if (formattedValue.length === 5) {
            validateExpiryDate(formattedValue);
          } else {
            setExpiryError("");
          }
          return;
        }

        setFormData((prev) => ({
          ...prev,
          meta_data: {
            ...prev.meta_data,
            card_details: {
              ...prev.meta_data.card_details,
              [grandchild]: value,
            },
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Add a blur handler for validation when the user finishes typing
  const handleExpiryBlur = () => {
    validateExpiryDate(formData.meta_data.card_details.expiry);
  };

  if (isLoadingData) {
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
          <span>Back to Balances</span>
        </Button>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-main">Create Card Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ledger" className="text-white/90">Ledger</Label>
                  <Select
                    value={formData.ledger_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, ledger_id: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select a ledger" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      {ledgers.map((ledger) => (
                        <SelectItem
                          key={ledger.ledger_id}
                          value={ledger.ledger_id}
                          className="text-white hover:bg-white/10"
                        >
                          {ledger.name}
                        </SelectItem>
                      ))}
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
                        <SelectItem
                          key={identity.identity_id}
                          value={identity.identity_id}
                          className="text-white hover:bg-white/10"
                        >
                          {identity.first_name} {identity.last_name} ({identity.email_address})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency" className="text-white/90">Currency</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, currency: value })
                    }
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
                  <Label htmlFor="card_number" className="text-white/90">Card Number</Label>
                  <Input
                    type="text"
                    name="meta_data.card_details.masked_number"
                    value={formData.meta_data.card_details.masked_number}
                    onChange={handleInputChange}
                    placeholder="Enter card number"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-white/90">Expiry Date</Label>
                  <Input
                    type="text"
                    name="meta_data.card_details.expiry"
                    value={formData.meta_data.card_details.expiry}
                    onChange={handleInputChange}
                    onBlur={handleExpiryBlur}
                    placeholder="MM/YY"
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    required
                  />
                  {expiryError && (
                    <p className="mt-1 text-sm text-red-400">{expiryError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card_type" className="text-white/90">Card Type</Label>
                  <Select
                    value={formData.meta_data.card_details.type}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        meta_data: {
                          ...formData.meta_data,
                          card_details: {
                            ...formData.meta_data.card_details,
                            type: value,
                          },
                        },
                      })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select card type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="virtual" className="text-white hover:bg-white/10">Virtual</SelectItem>
                      <SelectItem value="physical" className="text-white hover:bg-white/10">Physical</SelectItem>
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
                  disabled={isLoading}
                  className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black-main border-t-transparent rounded-full animate-spin" />
                      Creating...
                    </div>
                  ) : (
                    "Create Card Balance"
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
