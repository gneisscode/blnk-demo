import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Building, Tag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

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

  if (!identity) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Identity not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Identities
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-indigo-500" />
                <span>Basic Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {identity.first_name} {identity.last_name}
                    {identity.other_names && ` (${identity.other_names})`}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Identity Type</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.identity_type}</dd>
                </div>
                {identity.organization_name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Organization</dt>
                    <dd className="mt-1 text-sm text-gray-900">{identity.organization_name}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {identity.category}
                    </span>
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-indigo-500" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.email_address}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.phone_number}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-indigo-500" />
                <span>Address Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Street</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.street}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">City</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.city}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">State/Province</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.state}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.post_code}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Country</dt>
                  <dd className="mt-1 text-sm text-gray-900">{identity.country}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-5 h-5 text-indigo-500" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Customer ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {identity.meta_data.customer_id || "Not specified"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Membership Level</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {identity.meta_data.membership_level}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Preferred Language</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {identity.meta_data.preferred_language}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Verification Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        identity.meta_data.verification_data.verification_status === "verified"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {identity.meta_data.verification_data.verification_status}
                    </span>
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
