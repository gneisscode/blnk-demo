import { useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CreateIdentity() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity_type: "individual",
    organization_name: "",
    first_name: "",
    last_name: "",
    other_names: "",
    gender: "",
    dob: "",
    email_address: "",
    phone_number: "",
    nationality: "",
    category: "customer",
    street: "",
    country: "",
    state: "",
    post_code: "",
    city: "",
    meta_data: {
      customer_id: "",
      membership_level: "Standard",
      preferred_language: "English",
      verification_data: {
        verified_by: "Manual",
        verification_date: new Date().toISOString(),
        verification_status: "pending"
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/identities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error creating identity");
      }

      toast.success("Identity created successfully");
      router.push(`/identities/details/${data.identity_id}`);
    } catch (error: any) {
      console.error("Error creating identity:", error);
      toast.error(error.message || "Failed to create identity");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Identities</span>
        </Button>

        <Card className="bg-white/5 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-yellow-main">Create New Identity</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Identity Type</label>
                  <Select
                    value={formData.identity_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, identity_type: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="individual" className="text-white hover:bg-white/10">Individual</SelectItem>
                      <SelectItem value="organization" className="text-white hover:bg-white/10">Organization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.identity_type === "organization" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">Organization Name</label>
                    <Input
                      value={formData.organization_name}
                      onChange={(e) =>
                        setFormData({ ...formData, organization_name: e.target.value })
                      }
                      required={formData.identity_type === "organization"}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">First Name</label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    required={formData.identity_type === "individual"}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Last Name</label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    required={formData.identity_type === "individual"}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Other Names</label>
                  <Input
                    value={formData.other_names}
                    onChange={(e) =>
                      setFormData({ ...formData, other_names: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Gender</label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="male" className="text-white hover:bg-white/10">Male</SelectItem>
                      <SelectItem value="female" className="text-white hover:bg-white/10">Female</SelectItem>
                      <SelectItem value="other" className="text-white hover:bg-white/10">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Date of Birth</label>
                  <Input
                    type="date"
                    value={formData.dob.split("T")[0]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dob: new Date(e.target.value).toISOString(),
                      })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Email Address</label>
                  <Input
                    type="email"
                    value={formData.email_address}
                    onChange={(e) =>
                      setFormData({ ...formData, email_address: e.target.value })
                    }
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Phone Number</label>
                  <Input
                    value={formData.phone_number}
                    onChange={(e) =>
                      setFormData({ ...formData, phone_number: e.target.value })
                    }
                    required
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Nationality</label>
                  <Input
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData({ ...formData, nationality: e.target.value })
                    }
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-white/90">Category</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    required
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-black-main border-white/10">
                      <SelectItem value="customer" className="text-white hover:bg-white/10">Customer</SelectItem>
                      <SelectItem value="vendor" className="text-white hover:bg-white/10">Vendor</SelectItem>
                      <SelectItem value="employee" className="text-white hover:bg-white/10">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium mb-4 text-yellow-main">Address Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">Street</label>
                    <Input
                      value={formData.street}
                      onChange={(e) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">State/Province</label>
                    <Input
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">Postal Code</label>
                    <Input
                      value={formData.post_code}
                      onChange={(e) =>
                        setFormData({ ...formData, post_code: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">Country</label>
                    <Input
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-medium mb-4 text-yellow-main">Additional Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white/90">Customer ID</label>
                    <Input
                      value={formData.meta_data.customer_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          meta_data: {
                            ...formData.meta_data,
                            customer_id: e.target.value,
                          },
                        })
                      }
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-yellow-main/50 focus:ring-yellow-main/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
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
                    "Create Identity"
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
