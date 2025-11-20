import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gadgetsApi, requestsApi, Gadget } from '../../api';

/**
 * User Gadget List Page - Browse and request gadgets
 */
export default function GadgetListPage() {
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const queryClient = useQueryClient();

  const { data: gadgets, isLoading } = useQuery({
    queryKey: ['gadgets'],
    queryFn: gadgetsApi.getAll,
  });

  const requestMutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests'] });
      setSelectedGadget(null);
      alert('Request submitted successfully!');
    },
  });

  const availableGadgets = gadgets?.filter(g => g.status === 'AVAILABLE' && g.quantity > 0);

  if (isLoading) {
    return <div className="text-center py-8">Loading gadgets...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Gadgets</h2>

      {/* Gadgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableGadgets?.map((gadget) => (
          <div key={gadget.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{gadget.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{gadget.category}</p>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{gadget.description}</p>

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs text-gray-500">Available</span>
                <p className="text-lg font-bold text-gray-800">{gadget.quantity}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {gadget.status.replace('_', ' ')}
              </span>
            </div>

            <button
              onClick={() => setSelectedGadget(gadget)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Gadget
            </button>
          </div>
        ))}
      </div>

      {(!availableGadgets || availableGadgets.length === 0) && (
        <div className="bg-white rounded-lg shadow p-12 text-center text-gray-500">
          No gadgets available at the moment.
        </div>
      )}

      {/* Request Form Modal */}
      {selectedGadget && (
        <RequestFormModal
          gadget={selectedGadget}
          onClose={() => setSelectedGadget(null)}
          onSubmit={(data) => requestMutation.mutate(data)}
          isSubmitting={requestMutation.isPending}
        />
      )}
    </div>
  );
}

/**
 * Request Form Modal
 */
function RequestFormModal({
  gadget,
  onClose,
  onSubmit,
  isSubmitting,
}: {
  gadget: Gadget;
  onClose: () => void;
  onSubmit: (data: { gadgetId: string; reason: string; quantity: number }) => void;
  isSubmitting: boolean;
}) {
  const [formData, setFormData] = useState({
    reason: '',
    quantity: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      gadgetId: gadget.id,
      reason: formData.reason,
      quantity: formData.quantity,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">Request Gadget</h3>

        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <p className="font-medium text-gray-800">{gadget.name}</p>
          <p className="text-sm text-gray-500">{gadget.description}</p>
          <p className="text-sm text-gray-600 mt-2">Available: {gadget.quantity}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              required
              min="1"
              max={gadget.quantity}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Request (optional)
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Why do you need this gadget?"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
