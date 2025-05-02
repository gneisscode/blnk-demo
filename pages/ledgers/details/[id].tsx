import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, BookOpen, Users, Wallet, Activity, DollarSign } from 'lucide-react';

interface LedgerDetails {
  ledger_id: string;
  name: string;
  created_at: string;
  meta_data: {
    description?: string;
    project_owner?: string;
  };
}

export default function LedgerDetails() {
  const [ledger, setLedger] = useState<LedgerDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchLedgerDetails();
    }
  }, [id]);

  const fetchLedgerDetails = async () => {
    try {
      const response = await fetch(`/api/ledgers/${id}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error fetching ledger details');
      }
      setLedger(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || 'Error fetching ledger details');
      setLoading(false);
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

  if (!ledger) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
            Ledger not found
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
            Back to Ledgers
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-indigo-500" />
              <h1 className="text-3xl font-bold">{ledger.name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Project Owner</h3>
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {ledger.meta_data?.project_owner || 'Not specified'}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <Activity className="w-5 h-5 text-gray-400" />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {new Date(ledger.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {ledger.meta_data?.description || 'No description provided'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Ledger ID</dt>
                <dd className="mt-1 text-sm text-gray-900">{ledger.ledger_id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 