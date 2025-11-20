import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assignmentsApi } from '../../api';

/**
 * User My Gadgets Page - View assigned gadgets and return them
 */
export default function MyGadgetsPage() {
  const queryClient = useQueryClient();

  const { data: assignments, isLoading } = useQuery({
    queryKey: ['assignments'],
    queryFn: assignmentsApi.getAll,
  });

  const returnMutation = useMutation({
    mutationFn: assignmentsApi.returnGadget,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      queryClient.invalidateQueries({ queryKey: ['gadgets'] });
      alert('Gadget returned successfully!');
    },
  });

  const handleReturn = (id: string, gadgetName: string) => {
    if (window.confirm(`Are you sure you want to return "${gadgetName}"?`)) {
      returnMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading your gadgets...</div>;
  }

  const activeAssignments = assignments?.filter(a => !a.returned);
  const returnedAssignments = assignments?.filter(a => a.returned);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Gadgets</h2>

      {/* Active Assignments */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Currently Assigned ({activeAssignments?.length || 0})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeAssignments?.map((assignment) => (
            <div key={assignment.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{assignment.gadget?.name}</h3>
                <p className="text-sm text-gray-500">{assignment.gadget?.category}</p>
              </div>

              <p className="text-gray-600 text-sm mb-4">{assignment.gadget?.description}</p>

              <div className="mb-4">
                <p className="text-xs text-gray-500">Assigned on</p>
                <p className="text-sm font-medium text-gray-700">
                  {new Date(assignment.startDate).toLocaleDateString()}
                </p>
              </div>

              {assignment.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-xs text-gray-500">Notes</p>
                  <p className="text-sm text-gray-700">{assignment.notes}</p>
                </div>
              )}

              <button
                onClick={() => handleReturn(assignment.id, assignment.gadget?.name || 'gadget')}
                disabled={returnMutation.isPending}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
              >
                Return Gadget
              </button>
            </div>
          ))}
        </div>

        {(!activeAssignments || activeAssignments.length === 0) && (
          <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
            You don't have any gadgets assigned at the moment.
          </div>
        )}
      </div>

      {/* Returned Assignments History */}
      {returnedAssignments && returnedAssignments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">History</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gadget</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Returned</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {returnedAssignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{assignment.gadget?.name}</div>
                      <div className="text-sm text-gray-500">{assignment.gadget?.category}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(assignment.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {assignment.returnedAt && new Date(assignment.returnedAt).toLocaleDateString()}
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
