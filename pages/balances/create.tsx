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
      <div className="min-h-screen p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Card Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ledger">Ledger</Label>
                <Select
                  value={formData.ledger_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, ledger_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a ledger" />
                  </SelectTrigger>
                  <SelectContent>
                    {ledgers.map((ledger) => (
                      <SelectItem
                        key={ledger.ledger_id}
                        value={ledger.ledger_id}
                      >
                        {ledger.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="identity">Customer</Label>
                <Select
                  value={formData.identity_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, identity_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {identities.map((identity) => (
                      <SelectItem
                        key={identity.identity_id}
                        value={identity.identity_id}
                      >
                        {identity.first_name} {identity.last_name} (
                        {identity.email_address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, currency: value }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="masked_number">Card Number</Label>
                <Input
                  id="masked_number"
                  name="meta_data.card_details.masked_number"
                  value={formData.meta_data.card_details.masked_number}
                  onChange={handleInputChange}
                  required
                  placeholder="xxxx-xxxx-xxxx-1234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="meta_data.card_details.expiry"
                  value={formData.meta_data.card_details.expiry}
                  onChange={handleInputChange}
                  onBlur={handleExpiryBlur}
                  required
                  placeholder="MM/YY"
                  maxLength={5}
                  inputMode="numeric"
                />
                {expiryError && (
                  <p className="text-sm text-red-500">{expiryError}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="card_type">Card Type</Label>
                <Select
                  value={formData.meta_data.card_details.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      meta_data: {
                        ...prev.meta_data,
                        card_details: {
                          ...prev.meta_data.card_details,
                          type: value,
                        },
                      },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Card Balance"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
