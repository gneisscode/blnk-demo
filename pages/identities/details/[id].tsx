import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Building, Tag, BookOpen, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Identity {
  identity_id: string;
  identity_type: string;
  organization_name: string;
  first_name: string;
  last_name: string;
  other_names: string;
  gender: string;
  dob: string;
  email_address: string;
  phone_number: string;
  nationality: string;
  category: string;
  street: string;
  country: string;
  state: string;
  post_code: string;
  city: string;
  created_at: string;
  meta_data: {
    customer_id: string;
    membership_level: string;
    preferred_language: string;
    verification_data: {
      verified_by: string;
      verification_date: string;
      verification_status: string;
    };
  };
}

export default function IdentityDetails() {
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchIdentityDetails();
    }
  }, [id]);

  const fetchIdentityDetails = async () => {
    try {
      const response = await fetch(`/api/identities/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Error fetching identity details");
      }
      setIdentity(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Error fetching identity details");
      setLoading(false);
      toast.error("Failed to load identity details");
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

  if (!identity) {
    return (
      <div className="min-h-screen p-8 bg-black-main">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-3 rounded">
            Identity not found
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
          <span>Back to Identities</span>
        </Button>

        <div className="grid gap-6">
          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-yellow-main">Identity Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Identity ID</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.identity_id}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">First Name</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.first_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Last Name</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.last_name}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Email</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.email_address}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Additional Information</h3>
                  <dl className="space-y-4">
                    <div>
                      <dt className="text-sm font-medium text-white/70">Phone Number</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.phone_number}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-white">{identity?.dob}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-white/70">Verification Status</dt>
                      <dd className="mt-1">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            identity?.meta_data.verification_data.verification_status === "verified"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-yellow-500/20 text-yellow-400"
                          }`}
                        >
                          {identity?.meta_data.verification_data.verification_status}
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
                <Calendar className="w-5 h-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-white/70">Created At</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(identity?.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-white/70">Last Updated</dt>
                  <dd className="mt-1 text-sm text-white">
                    {new Date(identity?.created_at).toLocaleString()}
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
