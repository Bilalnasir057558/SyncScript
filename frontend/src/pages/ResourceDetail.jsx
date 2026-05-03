import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router";
import SideMenu from '../components/Sidemenu';
import Header from "../components/HeaderNavbar";
import AnnotationCard from "../components/AnnotationCard";
import Icon from "../components/Icon";
import Button from "../components/Button";
import { Editor } from "@tinymce/tinymce-react";
import axiosInstance from "../api/axios";

export default function ResourceDetail() {
  const { resourceId } = useParams(); // Get ID from URL: /resource/:resourceId
  
  // 1. Updated State to handle real data
  const [resource, setResource] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");

  const editorRef = useRef(null);
  const [noteText, setNoteText] = useState("");
  const textareaRef = useRef(null);

  // 2. Fetch Resource Details on mount
  useEffect(() => {
    const fetchResourceData = async () => {
      try {
        setLoading(true);
        // Endpoint #17: Fetch resource metadata
        const response = await axiosInstance.get(`/resources/detail/${resourceId}`);
        const data = response.data.data;
        setResource(data);
        setEditTitle(data.title);
        setEditUrl(data.url || "");
        
        // TODO: Once annotations endpoint #21 is ready, fetch them here:
        // const annRes = await axiosInstance.get(`/resources/${resourceId}/annotations`);
        // setAnnotations(annRes.data.data);
        
      } catch (error) {
        console.error("Failed to fetch resource details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (resourceId) fetchResourceData();
  }, [resourceId]);

  const handleSubmit = async () => {
    if (!noteText) {
      alert("invalid annotation");
      return;
    }

    try {
      // Endpoint #20: Create Annotation (assuming this is the structure)
      const response = await axiosInstance.post(`/resources/${resourceId}/annotations`, {
        content: noteText,
        type: 'note'
      });

      if (response.data.success) {
        setAnnotations((prev) => [response.data.data, ...prev]);
        setNoteText("");
        alert("Annotation synced to sanctuary!");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save note.");
    }
  };

  // 3. Loading and Error Guards
  if (loading) return <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">Unlocking research data...</div>;
  if (!resource) return <div className="h-screen flex items-center justify-center bg-[#F7F9FC]">Resource not found.</div>;

  const handleUpdate = async () => {
  try {
    const response = await axiosInstance.put(`/resources/detail/${resourceId}`, {
      title: editTitle,
      url: editUrl
    });
    setResource(response.data.data);
    setIsEditing(false);
    alert("Archival data updated.");
  } catch (err) {
    alert(err.response?.data?.message || "Update failed.");
  }
};

  return (
    <div className="flex min-h-screen bg-[#F7F9FC]">
      <SideMenu activeItem="My Vaults" />

      <div className="grow flex flex-col">
        {/* <Header /> */}

        <main className="mt-16 ml-0 md:ml-64 p-8 md:p-12">
          {/* Title and Header Actions */}
          <div className="flex justify-between items-start mb-8">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-extrabold text-[#0B3C5D] leading-tight mb-4">
                {resource.title}
              </h1>
              <a
                href={resource.url || (resource.file?.[0]?.filePath)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-sky-600 font-medium hover:underline"
              >
                <Icon name={resource.url ? "link" : "file"} size="14px" />
                {resource.url || "View Attached Document"}
              </a>
            </div>
            <div className="flex gap-3">
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
                <h3 className="flex items-center gap-2 text-lg font-bold text-[#0B3C5D]">
                  <Icon name="note" size="20px" /> Annotations / Notes
                </h3>
                <span className="bg-sky-100 text-sky-700 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                  {annotations.length} Notes Total
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
              {annotations.length > 0 ? (
                annotations.map((note) => (
                  <AnnotationCard 
                    key={note._id} 
                    user={note.userId?.username || "Researcher"} 
                    date={new Date(note.createdAt).toLocaleDateString()}
                    text={note.content} 
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
              ={" "}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
