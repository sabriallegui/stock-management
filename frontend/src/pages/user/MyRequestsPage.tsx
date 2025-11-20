import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api';

/**
 * User My Requests Page - View request status
 */
export default function MyRequestsPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: requestsApi.getAll,
  });

  const deleteMutation = useMutation({
    mutationFn: requestsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      alert('Request deleted successfully!');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your requests...</div>;
  }

  const pendingRequests = requests?.filter(r => r.status === 'PENDING');
  const processedRequests = requests?.filter(r => r.status !== 'PENDING');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Requests</h2>

      {/* Pending Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Pending Requests ({pendingRequests?.length || 0})
        </h3>
        <div className="space-y-4">
          {pendingRequests?.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{request.gadget?.name}</h3>
                  <p className="text-sm text-gray-500">{request.gadget?.category}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  PENDING
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Quantity</p>
                  <p className="text-sm font-medium text-gray-700">{request.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Requested on</p>
                  <p className="text-sm font-medium text-gray-700">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {request.reason && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Reason</p>
                  <p className="text-sm text-gray-700">{request.reason}</p>
                </div>
              )}

              <button
                onClick={() => handleDelete(request.id)}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400"
              >
                Cancel Request
              </button>
            </div>
          ))}
        </div>

        {(!pendingRequests || pendingRequests.length === 0) && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            You don't have any pending requests.
          </div>
        )}
      </div>

      {/* Processed Requests */}
      {processedRequests && processedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Request History</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gadget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {processedRequests.map((request) => (
                  <tr key={request.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{request.gadget?.name}</div>
                      <div className="text-sm text-gray-500">{request.gadget?.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{request.quantity}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'APPROVED' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
