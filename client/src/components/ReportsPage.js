import { useEffect, useState, useCallback } from "react";

const SERVICE_URL = "http://localhost:3002";

const preview = (pc) => {
  if (typeof pc === "string") return pc;
  if (pc && typeof pc === "object") return pc.content ?? JSON.stringify(pc);
  return "";
};

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${SERVICE_URL}/reports`);
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data = await res.json();
      data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // newest first
      setReports(data);
    } catch (e) {
      setError(e.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const dismissReport = async (reportId) => {
    setBusyId(reportId);
    setError("");
    try {
      const res = await fetch(`${SERVICE_URL}/report/${reportId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete report");
      setReports((prev) => prev.filter((r) => r.reportId !== reportId));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const deletePostAndReports = async (postId) => {
    setBusyId(postId);
    setError("");

    try {
      const token = localStorage.getItem("id_token");
      const res = await fetch(`${SERVICE_URL}/reportedPost/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to delete post");
      }

      // remove all reports for that post from the UI
      setReports((prev) => prev.filter((r) => r.postId !== postId));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="h-10 w-64 rounded bg-gradient-to-r from-zomp-600 via-persian_green-500 to-kelly_green-500 animate-pulse" />
        <div className="mt-6 h-48 rounded-xl bg-white shadow animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zomp-600 to-persian_green-500 p-6">
      {/* Page title styled like the rest of the app */}
      <div className="inline-block rounded-lg px-4 py-2 text-white bg-gradient-to-r from-zomp-600 via-persian_green-500 to-kelly_green-500 shadow">
        <h1 className="text-xl font-bold tracking-wide">Reports</h1>
      </div>

      {error && (
        <div className="mt-4 mb-4 rounded-lg bg-rose_quartz-100 text-rose_quartz-800 px-4 py-2">
          {error}
        </div>
      )}

      {reports.length === 0 ? (
        <p className="mt-4 text-slate-600">No reports 🎉</p>
      ) : (
        <div className="mt-4 overflow-x-auto bg-white rounded-xl shadow">
          <table className="min-w-full text-left">
            <thead className="bg-slate-50">
              <tr className="text-slate-700">
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Reporter</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Post ID</th>
                <th className="px-4 py-3">Post Content</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.reportId} className="border-t">
                  <td className="px-4 py-3 text-sm">
                    {r.timestamp ? new Date(r.timestamp).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm">{r.reporter || "—"}</td>
                  <td className="px-4 py-3 text-sm">{r.reason || "—"}</td>
                  <td className="px-4 py-3 text-xs font-mono">{r.postId}</td>
                  <td
                    className="px-4 py-3 text-sm max-w-[28rem] truncate"
                    title={preview(r.postContent)}
                  >
                    {preview(r.postContent)}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    <button
                      disabled={busyId === r.reportId}
                      onClick={() => dismissReport(r.reportId)}
                      className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-50"
                    >
                      Dismiss
                    </button>
                    <button
                      disabled={busyId === r.postId}
                      onClick={() => deletePostAndReports(r.postId)}
                      className="px-3 py-1 rounded-lg bg-rose_quartz-500 text-white hover:bg-rose_quartz-600 disabled:opacity-50"
                    >
                      Delete Post
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex gap-3">
        <button
          onClick={load}
          className="px-4 py-2 rounded-lg text-white bg-persian_green-600 hover:bg-persian_green-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}
