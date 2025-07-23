import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TableManagement = () => {
  const [registeredTables, setRegisteredTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editTable, setEditTable] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/host/host-table-list', {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      setRegisteredTables(data.tables);
    } catch (err) {
      toast.error('Failed to fetch tables');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this table?')) return;

    try {
      const res = await fetch(`/api/host/delete-table/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Delete failed');

      setRegisteredTables(prev => prev.filter(table => table._id !== id));
      toast.success('Table deleted successfully');
    } catch (err) {
      toast.error('Failed to delete table');
      console.error(err);
    }
  };

  const handleEditClick = (table) => {
    setEditTable({ ...table });
    setIsNew(false);
    setShowModal(true);
  };

  const handleAddClick = () => {
    setEditTable({
      tableCode: '',
      tableCapacity: '',
      location: '',
      branch: '',
    });
    setIsNew(true);
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditTable(prev => ({ ...prev, [name]: value }));
  };

  const handleAddNew = async () => {
    if (!editTable.tableCode || !editTable.location || !editTable.branch || !editTable.tableCapacity) {
      toast.warn('All fields are required');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/host/add-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editTable,
          tableCode: Number(editTable.tableCode),
          tableCapacity: Number(editTable.tableCapacity),
        }),
      });

      if (!res.ok) throw new Error('Add failed');

      const data = await res.json();
      setRegisteredTables(data.tables);
      toast.success('New table added successfully');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to add table');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editTable.tableCode || !editTable.location || !editTable.branch || !editTable.tableCapacity) {
      toast.warn('All fields are required');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/host/update-table/${editTable._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...editTable,
          tableCode: Number(editTable.tableCode),
          tableCapacity: Number(editTable.tableCapacity),
        }),
      });

      if (!res.ok) throw new Error('Update failed');

      setRegisteredTables(prev =>
        prev.map(t => (t._id === editTable._id ? editTable : t))
      );

      toast.success('Table updated successfully');
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to update table');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer position="top-center" />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-semibold mb-0">Table Management</h2>
        <button className="btn btn-primary" onClick={handleAddClick}>+ Add Table</button>
      </div>

      <div className="row g-4">
        {loading ? (
          <div className="col-12 text-center">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading tables...</p>
          </div>
        ) : registeredTables.length === 0 ? (
          <div className="col-12 text-center text-muted">No tables registered.</div>
        ) : (
          registeredTables.map((table) => (
            <div key={table._id} className="col-sm-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title text-dark">Table Code: {table.tableCode}</h5>
                  <p className="card-text text-muted mb-2"><strong>Location:</strong> {table.location}</p>
                  <p className="card-text text-muted mb-2"><strong>Capacity:</strong> {table.tableCapacity}</p>
                  <p className="card-text text-muted mb-3"><strong>Branch:</strong> {table.branch}</p>
                  <div className="d-flex justify-content-end gap-2">
                    <button onClick={() => handleEditClick(table)} className="btn btn-sm btn-outline-primary">Edit</button>
                    <button onClick={() => handleDelete(table._id)} className="btn btn-sm btn-outline-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && editTable && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{isNew ? 'Add Table' : 'Edit Table'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group mb-3">
                  <label>Table Code</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tableCode"
                    value={editTable.tableCode}
                    onChange={handleFormChange}
                    disabled={saving}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Location</label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={editTable.location}
                    onChange={handleFormChange}
                    disabled={saving}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="tableCapacity"
                    value={editTable.tableCapacity}
                    onChange={handleFormChange}
                    disabled={saving}
                  />
                </div>
                <div className="form-group mb-3">
                  <label>Branch</label>
                  <select
                    className="form-select"
                    name="branch"
                    value={editTable.branch}
                    onChange={handleFormChange}
                    disabled={saving}
                  >
                    <option value="">-- Select Branch --</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  onClick={isNew ? handleAddNew : handleUpdate}
                  className="btn btn-success"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : isNew ? 'Add Table' : 'Save Changes'}
                </button>
                <button onClick={() => setShowModal(false)} className="btn btn-secondary" disabled={saving}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableManagement;
