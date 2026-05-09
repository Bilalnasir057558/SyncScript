import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import Button from "../components/Button";
import axiosInstance from "../api/axios";

export default function AcceptInvitePage() {
  const { token } = useParams();
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const navigate = useNavigate();


  const handleAccept = async () => {
    setAccepting(true);
    try {
        const response = await axiosInstance.post(`/invitations/${token}/accept`);
        alert('Invitation accepted! Redirecting to vault...');

        navigate(`/vaults/${response.data.data.vaultId}`);
    } catch (error) {
        setError(error.response?.data?.message || 'Failed to accept invitations')
    } finally {
        setAccepting(false);
    }
  };

  const handleReject = async () => {
    try {
        const response = await axiosInstance.post(`/invitations/${token}/reject`);
        alert('Invitation rejected');
        navigate('/dashboard');
    } catch(err) {
        setError(err.response?.data?.message || "Failed to reject invitation")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        {error ? (
          <div>
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-700 mb-6">{error}</p>
            <button
              onClick={() => navigate("/")}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vault Invitation
            </h1>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                You've been invited to join a vault in{" "}
                <strong>SyncScript</strong>!
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleAccept}
                disabled={accepting}
                children={`${accepting ? "Accepting..." : "Accept"}`}
                variant="blue"
              />
              <Button
                onClick={handleReject}
                variant="gray"
                children="Reject"
              />
            </div>
              
          </div>
        )}
      </div>
    </div>
  );
}
