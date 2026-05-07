import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import SideMenu from '../components/Sidemenu';
import Header from "../components/HeaderNavbar";
import MobileNav from "../components/MobileNav";
import AnnotationCard from "../components/AnnotationCard";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/auth.context";

export default function ResourceDetail() {
  const { resourceId } = useParams(); // Get ID from URL: /resource/:resourceId
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("My Vaults");
  const location = useLocation();

  // 1. Updated State to handle real data
  const [resource, setResource] = useState(location.state?.resource || null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(!resource);
  const {user} = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const editorRef = useRef(null);
  const [noteText, setNoteText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    if (activeTab !== "My Vaults") {
      navigate("/dashboard");
    }
  }, [activeTab, navigate]);

  // 2. Fetch Resource Details on mount
  useEffect(() => {
    const fetchResourceAndAnnotations = async () => {
      try {
        const resourcePromise = await axiosInstance.get(
          `/resources/${resourceId}`,
        );

        const annotationPromise = await axiosInstance.get(
          `/resources/${resourceId}/annotations`,
        );

        const [resResource, resAnnotations] = await Promise.all([
          resourcePromise,
          annotationPromise,
        ]);

        setResource(resResource.data.data);
        setEditTitle(resResource.data.data.title);
        setEditUrl(resResource.data.data.url || "");


        setAnnotations(
          Array.isArray(resAnnotations.data.data)
            ? resAnnotations.data.data
            : [],
        );        
        
      } catch (error) {
        console.error("Failed to fetch resource details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResourceAndAnnotations();
  }, [resourceId]);

  const handleSubmit = async () => {
    if (!noteText) {
      alert("invalid annotation");
      return;
    }

    // temp annotation for immediate update
    const tempId = `temp-${Date.now()}`;

    const tempAnnotation = {
      _id: tempId,
      content: noteText,
      username: user?.username,
      createdAt: new Date().toLocaleDateString(),
      status: "saving",
      createdAt: new Date(),
      username: "You",
    };

    setAnnotations((prev) => [tempAnnotation, ...prev]);

    try {
      const response = await axiosInstance.post(
        `/resources/${resourceId}/annotations`,
        {
          content: noteText,
        },
      );

      const savedAnnotation = {
        ...response.data.data,
        username:
          response.data.data.username ||
          response.data.data.userId?.username ||
          "You",
      };

      setAnnotations((prev) =>
        prev.map((note) =>
          note._id === tempId
            ? { ...savedAnnotation, status: "saved" }
            : note
        )
      );

      setNoteText("");
      alert("Annotation synced to sanctuary!");
    } catch (error) {
      console.error("Save failed:", error);
      setAnnotations((prev) => prev.filter((note) => note.id !== tempId));
      alert("Failed to save note.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Loading and Error Guards
  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">
        Unlocking research data...
      </div>
    );
  if (!resource)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">
        Resource not found.
      </div>
    );

  const annotationCount = Array.isArray(annotations) ? annotations.length : 0;

  const handleDelete = async (annotationId) => {
    try {
      await axiosInstance.delete(`/annotations/${annotationId}`);

      setAnnotations((prev) =>
        prev.filter((note) => note._id !== annotationId)
      );

      alert("Annotation deleted successfully.");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  const handleEdit = async (annotationId, updatedContent) => {
    try {
      const response = await axiosInstance.put(
        `/annotations/${annotationId}`,
        {
          content: updatedContent,
        }
      );

      setAnnotations((prev) =>
        prev.map((note) =>
          note._id === annotationId
            ? response.data.data
            : note
        )
      );

      alert("Annotation updated successfully.");
    } catch (error) {
      console.log(error);
      alert("Update failed");
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure? This will permanently delete this resource and all its notes.",
      )
    ) {
      try {
        const response = await axiosInstance.delete(`/resources/${resourceId}`);
        if (response.data.success) {
          alert("Resource removed from archives.");
          navigate(`/vault/${resource.vaultId}`); // Redirect back to parent vault
        }
      } catch (err) {
        alert(err.response?.data?.message || "Remove failed.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SideMenu
        activeItem={activeTab}
        setActiveItem={setActiveTab}
      />

      <div className="grow flex flex-col">
        <Header />

        <main className="grow ml-0 md:ml-64 p-6 md:p-10 pb-24 md:pb-10">
          {/* Title and Header Actions */}
          <div className="flex justify-between items-start mb-8 mt-16">
            <div className="max-w-3xl flex-grow">
              {isEditing ? (
                /* --- EDITING UI --- */
                <div className="flex flex-col gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <input
                    className="text-2xl font-bold text-[#0B3C5D] border-b border-sky-200 focus:outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Resource Title"
                  />
                  <input
                    className="text-sm text-sky-600 focus:outline-none"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="Resource URL"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="blue" onClick={handleUpdate} className="py-1 px-4 text-xs">Save Changes</Button>
                    <Button variant="gray" onClick={() => setIsEditing(false)} className="py-1 px-4 text-xs">Cancel</Button>
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors p-2 rounded-lg"
                    >
                      <Icon name="trash" size="14px" />
                      Remove Resource
                    </button>
                  </div>
                </div>
              ) : (
                /* --- DISPLAY UI --- */
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl font-extrabold text-[#0B3C5D] leading-tight">
                      {resource.title}
                    </h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                    >
                      <Icon name="edit" size="18px" />
                    </button>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-sm text-sky-600 font-medium hover:underline mb-1"
                  >
                    <Icon name="link" size="14px" />
                    {resource.url || "No link available"}
                  </a>
                  <a
                    className={`flex items-center gap-2 text-sm font-medium ${resource.files?.[0] ? "text-sky-600 hover:underline" : "text-gray-500"}`}
                    target="_blank"
                    href={resource.files?.[0]?.filePath}
                  >
                    <Icon name="file" size="14px" />
                    {resource.files?.[0]?.fileName || "No file attached"}
                  </a>
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className={`${isEditing ? 'cursor-default': 'cursor-pointer hover:text-sky-600'} p-3 text-slate-600  transition-colors border border-slate-200 rounded-xl`}
                disabled={isEditing}
              >
                <Icon name="edit" size="20px" />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Icon name="share" size="20px" className="text-slate-600" />
              </button>
              <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Icon name="bookmark" size="20px" className="text-slate-600" />
              </button>
            </div>
          </div>

          {/* Two-Column Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column: Annotations (8/12) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 text-xl md:text-2xl font-bold text-[#0B3C5D]">
                  <Icon name="note" size="20px" /> Annotations / Notes
                </h3>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {annotationCount} Notes Total
                </span>
              </div>

              {/* Note Drafting Area */}
              {/* Editor remains the same, but using real handleSubmit */}
              <div className="flex flex-col gap-3">
                <Editor
                  apiKey={import.meta.env.VITE_TINY_MCE_EDITOR_API_KEY}
                  value={noteText}
                  onInit={(_evt, editor) => (editorRef.current = editor)}
                  onEditorChange={(newValue) => {
                    setNoteText(newValue);
                  }}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist",
                      "autolink",
                      "lists",
                      "link",
                      "image",
                      "charmap",
                      "anchor",
                      "searchreplace",
                      "visualblocks",
                      "code",
                      "fullscreen",
                      "insertdatetime",
                      "media",
                      "table",
                      "preview",
                      "help",
                      "wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks | " +
                      "bold italic forecolor | alignleft aligncenter " +
                      "alignright alignjustify | bullist numlist outdent indent | " +
                      "removeformat | help",
                    content_style:
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
                <Button
                  onClick={handleSubmit}
                  variant="blue"
                  className="px-8 rounded-lg self-start"
                >
                  Save Note
                </Button>
              </div>

              {/* Mapping Real Annotations */}
              {annotationCount > 0 ? (
                annotations.map((note) => (
                  <AnnotationCard
                    key={note._id || note.id}
                    user={note.username || "Researcher"}
                    date={new Date(note.createdAt).toLocaleDateString()}
                    time={new Date(note.createdAt).toLocaleTimeString()}
                    text={note.content}
                    canEdit={true}
                    onDelete={() => handleDelete(note._id)}
                    onEdit={(updatedText) =>
                      handleEdit(note._id, updatedText)
                    }
                  />
                ))
              ) : (
                <p className="text-gray-400 col-span-3 text-center border-2 border-dashed rounded-xl p-5">
                  No annotations yet.
                </p>
              )}
            </div>

            {/* Right Column: Insight Sidebar (4/12) */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="h-40 bg-[url('/src/assets/insight-bg.png')] bg-cover bg-center flex items-end p-6 relative">
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent"></div>
                <h3 className="relative text-white font-bold text-lg">
                  Resource Insight
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Complexity
                    </p>
                    <p className="text-sm font-bold text-[#0B3C5D]">
                      Academic (PhD)
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Time to Digest
                    </p>
                    <p className="text-sm font-bold text-[#0B3C5D]">45 mins</p>
                  </div>
                </div>

                <div className="mt-8 bg-[#0B3C5D] p-6 rounded-2xl text-white">
                  <p className="text-xs font-bold mb-4">Shared With</p>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] bg-slate-400"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] bg-slate-500"></div>
                      <div className="w-8 h-8 rounded-full border-2 border-[#0B3C5D] flex items-center justify-center bg-sky-800 text-[10px]">
                        +4
                      </div>
                    </div>
                  </div>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                    Invite Researcher
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <MobileNav activeItem={activeTab} setActiveItem={setActiveTab} />
    </div>
  );
}