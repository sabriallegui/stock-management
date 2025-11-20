import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../../api';

/**
 * Admin Requests Management Page
 */
export default function RequestsPage() {
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['requests'],
    queryFn: requestsApi.getAll,
  });

  const approveMutation = useMutation({
    mutationFn: requestsApi.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['gadgets'] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: requestsApi.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: requestsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
    },
  });

  const handleApprove = (id: string) => {
    if (window.confirm('Approve this request and assign the gadget to the user?')) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    if (window.confirm('Reject this request?')) {
      rejectMutation.mutate(id);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this request?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading requests...</div>;
  }

  const pendingRequests = requests?.filter(r => r.status === 'PENDING');
  const processedRequests = requests?.filter(r => r.status !== 'PENDING');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gadget Requests</h2>

      {/* Pending Requests Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Pending Requests ({pendingRequests?.length || 0})
        </h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gadget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{request.user?.name}</div>
                    <div className="text-sm text-gray-500">{request.user?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{request.gadget?.name}</div>
                    <div className="text-sm text-gray-500">Available: {request.gadget?.quantity}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{request.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.reason || 'No reason provided'}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={approveMutation.isPending}
                      className="text-green-600 hover:text-green-800 disabled:text-gray-400"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={rejectMutation.isPending}
                      className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {(!pendingRequests || pendingRequests.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No pending requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processed Requests Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Request History</h3>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gadget</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedRequests?.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{request.user?.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{request.gadget?.name}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(request.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
