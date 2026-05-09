import { useState } from "react";
import Icon from "./Icon";
import Button from "./Button";
import axiosInstance from "../api/axios";

export default function InviteMemberForm({ vaultId, onInviteSent, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    role: "Viewer",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email");
        return;
      }

      const res = await axiosInstance.post(`/vaults/${vaultId}/invite`, {
        invitedEmail: formData.email,
        role: formData.role,
      });

      setSuccess(res.data.message);
      setFormData({ email: "", role: "Viewer" });

      if (onInviteSent) onInviteSent();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 min-h-screen bg-black/30 backdrop-blur-sm flex flex-col justify-center items-center p-10">
      <div className="w-md md:w-lg max-w-lg bg-white rounded-xl relative p-5">
        <div className="flex justify-between mb-5">
          <h1 className="text-xl text-[#00263F] font-bold">Share Vault</h1>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {error && (
          <p className="text-red-700 border border-red-300 bg-red-100 mb-4 p-3 rounded">
            {error}
          </p>
        )}

        {success && (
          <p className="text-green-700 border border-green-300 bg-green-100 mb-4 p-3 rounded">
            {success}
          </p>
        )}

        <p className="text-[#42474E] text-sm">
          Invite colleagues to collaborate on{" "}
          <span className="text-[#00263F] font-semibold">
            Advanced Quantum Cryptography
          </span>
          . Collaborators will receive an email invitation.
        </p>

        <form className="mt-7">
          <div className="flex gap-3 mb-5">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="researcher@university.edu"
                className="bg-gray-300 py-2 px-4 rounded-lg focus:outline-none w-65"
                required
              />
            </div>

            <div className="flex-1 mt-5.75">
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="bg-gray-300 py-2 px-4 rounded-lg focus:outline-none text-[#00263F] font-semibold w-33"
              >
                <option value="Viewer">Viewer</option>
                <option value="Contributor">Contributor</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-100 rounded-md p-3 flex justify-start gap-3 mb-5">
            <Icon name="resource" size="16px" />

            <div className="flex flex-col justify-center">
              <h5 className="text-sm text-[#00263F]font-semibold">Contributor Role Permissions</h5>
              <p className="text-gray-500 text-xs">Contributors can edit documents, add new resources, and manage
existing files, but cannot delete the vault or manage other members.</p>
            </div>
          </div>

          <h4 className="text-gray-700 text-sm uppercase mb-1">Vault Access</h4>

          <div className="flex gap-3 justify-center items-center mb-5">
            <Icon name="user" size="16px"/>
            <p className="flex-1">You (Bilal Nasir)</p>
            <div className="bg-gray-200 rounded text-gray-700 w-15 h-8 flex justify-center items-center font-semibold">
              Owner
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} children="Cancel" variant="gray" />
            <Button onClick={handleSubmit} children="Invite" variant="blue" />
          </div>
        </form>
      </div>
    </div>
  );
}
