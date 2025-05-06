import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { User, Plus, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Identity {
  identity_id: string;
  identity_type: string;
  first_name: string;
  last_name: string;
  email_address: string;
  phone_number: string;
  category: string;
  created_at: string;
  meta_data: {
    verification_data: {
      verification_status: string;
    };
  };
}

export default function IdentityList() {
  const [identities, setIdentities] = useState<Identity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchIdentities();
  }, []);

  const fetchIdentities = async () => {
    try {
      const response = await fetch("/api/identities");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching identities");
      }
      setIdentities(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching identities");
      setLoading(false);
      toast.error("Failed to load identities");
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

  return (
    <div className="min-h-screen p-8 bg-black-main">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-yellow-main">Identities</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage and view all identities in the system
            </p>
          </div>
          <Button
            onClick={() => router.push("/identities/create")}
            className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Identity</span>
          </Button>
        </div>

        {identities.length === 0 ? (
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="w-12 h-12 text-yellow-main mb-4" />
              <h3 className="text-lg font-medium text-white mb-1">No identities found</h3>
              <p className="text-sm text-white/70 mb-4">
                Get started by creating a new identity
              </p>
              <Button
                onClick={() => router.push("/identities/create")}
                className="bg-yellow-main text-black-main hover:bg-yellow-main/90 transition-colors duration-200 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Identity</span>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {identities.map((identity) => (
              <Card key={identity.identity_id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-white">
                          {identity.first_name} {identity.last_name}
                        </h3>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            identity.meta_data.verification_data.verification_status === "verified"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {identity.meta_data.verification_data.verification_status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        <p>{identity.email_address}</p>
                        <p>{identity.phone_number}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4 text-sm text-white/60">
                        <span>Type: {identity.identity_type}</span>
                        <span>Category: {identity.category}</span>
                        <span>
                          Created: {new Date(identity.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(`/identities/details/${identity.identity_id}`)}
                      className="text-yellow-main hover:text-yellow-main/90 hover:bg-yellow-main/10 flex items-center space-x-2"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
