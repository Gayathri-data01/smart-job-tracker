import { useEffect, useState } from "react";
import axios from "axios";

/* IMPORTANT:
   Use relative URL so it works in Render + local
*/
const API = "/api/jobs";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [search, setSearch] = useState("");

  /* ---------------- FETCH JOBS ---------------- */
  const fetchJobs = async () => {
    try {
      const res = await axios.get(API);
      setJobs(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    }
  };

  /* ---------------- ADD JOB ---------------- */
  const addJob = async () => {
    if (!company.trim() || !role.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(API, {
        company: company.trim(),
        role: role.trim(),
        status: status || "Applied"
      });

      console.log("Added job:", res.data);

      // Clear form safely
      setCompany("");
      setRole("");
      setStatus("Applied");

      // Refresh after slight delay (avoids Render lag issues)
      setTimeout(() => {
        fetchJobs();
      }, 200);

    } catch (error) {
      console.error(
        "ADD JOB ERROR:",
        error.response?.data || error.message
      );
    }
  };

  /* ---------------- DELETE JOB ---------------- */
  const deleteJob = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchJobs();
    } catch (err) {
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  /* ---------------- LOAD JOBS ---------------- */
  useEffect(() => {
    fetchJobs();
  }, []);

  /* ---------------- SEARCH FILTER ---------------- */
  const filteredJobs = jobs.filter((job) => {
    const companyMatch = (job.company || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const roleMatch = (job.role || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    return companyMatch || roleMatch;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-4xl font-bold text-center mb-6">
        Smart Job Tracker 🚀
      </h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="grid md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Company Name"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option>Applied</option>
            <option>Interview</option>
            <option>Rejected</option>
            <option>Offer</option>
          </select>

          <button
            onClick={addJob}
            className="bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Add Job
          </button>

        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full mt-4"
        />

      </div>

      {/* TABLE */}
      <div className="mt-6 overflow-x-auto">

        <table className="w-full bg-white shadow-md rounded-lg">

          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Company</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {filteredJobs.length > 0 ? (

              filteredJobs.map((job) => (

                <tr key={job.id} className="text-center border-t">

                  <td className="p-3">{job.company}</td>
                  <td className="p-3">{job.role}</td>
                  <td className="p-3">{job.status}</td>

                  <td className="p-3">
                    <button
                      onClick={() => deleteJob(job.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="4" className="p-4 text-center">
                  No jobs found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default Dashboard;