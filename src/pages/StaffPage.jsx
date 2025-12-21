import React, { useState, useEffect } from 'react';
import { staffAPI, campaignStaffAPI, campaignAPI } from '../services/api';
import StaffList from '../components/Staff/StaffList';
import { useNavigate } from 'react-router-dom';
import StaffForm from '../components/Staff/StaffForm';
import FormModal from '../components/FormModal';

export default function StaffPage() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffCampaignAssignments, setStaffCampaignAssignments] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [showCampaigns, setShowCampaigns] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [assignCampaignId, setAssignCampaignId] = useState('');
  const [assignRole, setAssignRole] = useState('');

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffAPI.getAll();
      setStaffList(response.data);
      console.log('✅ Staff loaded:', response.data);
    } catch (error) {
      console.error('❌ Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffCampaignAssignments = async (staffId) => {
    try {
      const response = await campaignStaffAPI.getAll();
      // Filter assignments for this specific staff
      const assignments = response.data.filter(a => a.staff === staffId);
      setStaffCampaignAssignments(assignments);
      setSelectedStaffId(staffId);
      setShowCampaigns(true);
    } catch (error) {
      console.error('❌ Error fetching campaign assignments:', error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const r = await campaignAPI.getAll();
      setCampaigns(r.data);
    } catch (err) {
      console.error('Error fetching campaigns', err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchCampaigns();
  }, []);

  const navigate = useNavigate();

  const handleAdd = () => {
    setEditingStaff(null);
    setShowForm(true);
  };

  const handleEdit = (staff) => {
    setEditingStaff(staff);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this staff?')) {
      try {
        await staffAPI.delete(id);
        setStaffList(staffList.filter(s => s.id !== id));
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
  };

  const handleSave = () => {
    setShowForm(false);
    fetchStaff();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Add Staff
        </button>
      </div>

      {showForm && (
        <FormModal
          title={editingStaff ? 'Edit Staff' : 'Add New Staff'}
          onClose={() => setShowForm(false)}
        >
          <StaffForm
            staff={editingStaff}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </FormModal>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading staff...</p>
        </div>
      ) : (
        <>
          <StaffList
            staff={staffList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewCampaigns={fetchStaffCampaignAssignments}
          />
          
          {/* Staff Campaign Assignments Modal */}
          {showCampaigns && (
            <FormModal
              title={`Campaigns for ${staffList.find(s => s.id === selectedStaffId)?.user_details?.first_name} ${staffList.find(s => s.id === selectedStaffId)?.user_details?.last_name}`}
              onClose={() => setShowCampaigns(false)}
            >
              <div className="p-4">
                  {/* Assign form */}
                  <div className="mb-4 p-3 border rounded bg-white">
                    <h5 className="font-semibold mb-2">Assign to Campaign</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={assignCampaignId}
                        onChange={(e) => setAssignCampaignId(e.target.value)}
                        className="border px-3 py-2 rounded"
                      >
                        <option value="">Select campaign</option>
                        {campaigns.map(c => (
                          <option key={c.id} value={c.id}>{c.title || `#${c.id}`}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Role (e.g. Art Director)"
                        value={assignRole}
                        onChange={(e) => setAssignRole(e.target.value)}
                        className="border px-3 py-2 rounded"
                      />
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={async () => {
                          if (!assignCampaignId) return alert('Select a campaign');
                          try {
                            await campaignAPI.assignStaff(assignCampaignId, {
                              staff_id: selectedStaffId,
                              role: assignRole || 'Contributor'
                            });
                            await fetchStaffCampaignAssignments(selectedStaffId);
                            setAssignRole('');
                            setAssignCampaignId('');
                          } catch (err) {
                            console.error('Assign error', err);
                            alert(err.response?.data?.error || 'Assignment failed');
                          }
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => { setAssignRole(''); setAssignCampaignId(''); }}
                        className="px-4 py-2 bg-gray-200 rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                {staffCampaignAssignments.length === 0 ? (
                  <p className="text-gray-500 text-center py-6">No campaigns assigned yet</p>
                ) : (
                  <div className="space-y-3">
                    {staffCampaignAssignments.map((assignment) => (
                      <div key={assignment.id} className="p-4 border rounded-lg bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              <button
                                onClick={() => navigate('/campaigns', { state: { editId: assignment.campaign } })}
                                className="text-indigo-600 hover:underline font-semibold"
                              >
                                {assignment.campaign_title || `Campaign #${assignment.campaign}`}
                              </button>
                            </h4>
                            <p className="text-sm text-gray-600">Role: <span className="font-medium">{assignment.role}</span></p>
                            <p className="text-sm text-gray-500">Assigned: {new Date(assignment.assigned_date).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowCampaigns(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </FormModal>
          )}
        </>
      )}
    </div>
  );
}
