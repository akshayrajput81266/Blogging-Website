import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: null,
  });
  const [blogs, setBlogs] = useState([]);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileHandler = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login karo pehle!");
      return;
    }

    if (!formData.image) {
      toast.error("Please select an image");
      return;
    }

    if (!formData.title || !formData.category || !formData.description) {
      toast.error("Saare fields bharo!");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const res = await axios.post("http://localhost:4000/blog/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(res.data.message);
      if (res.data.blog) {
        setBlogs((prev) => [...prev, res.data.blog]);
      }
      setFormData({ title: "", category: "", description: "", image: null });
      setActiveTab("list");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    const allBlogs = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:4000/blog/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBlogs(res.data.blogs);
      } catch (error) {
        console.log("Dashboard error:", error);
        toast.error("Blogs load nahi hue. Server check karo.");
      } finally {
        setLoading(false);
      }
    };
    allBlogs();
  }, []);

  const removeBlog = async (blogId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Login karo pehle!");
      return;
    }

    try {
      const res = await axios.delete(
        `http://localhost:4000/blog/delete/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex h-auto">
      {/* Side bar */}
      <div className="w-64 border-r border-gray-300 bg-gray-800 text-white p-6 min-h-screen">
        <h2 className="text-lg font-semibold mb-6 text-white">Dashboard</h2>
        <button
          className={`w-full text-left py-2 px-4 mb-2 rounded ${
            activeTab === "post" ? "bg-orange-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("post")}
        >
          Post a Blog
        </button>
        <button
          className={`w-full text-left py-2 px-4 rounded ${
            activeTab === "list" ? "bg-orange-500" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("list")}
        >
          List of Blogs
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        {activeTab === "post" ? (
          <div>
            <h2 className="text-xl font-bold">Post a new blog</h2>
            <div className="mt-8">
              <form
                onSubmit={submitHandler}
                className="w-full max-w-lg flex flex-col gap-3"
              >
                <input
                  name="title"
                  value={formData.title}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Title"
                  required
                  className="border border-gray-300 rounded-md p-2 outline-none w-full"
                />
                <input
                  name="category"
                  value={formData.category}
                  onChange={onChangeHandler}
                  type="text"
                  placeholder="Category"
                  required
                  className="border border-gray-300 rounded-md p-2 outline-none w-full"
                />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={onChangeHandler}
                  placeholder="Description"
                  required
                  rows={5}
                  className="border border-gray-300 rounded-md p-2 outline-none w-full"
                />
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Choose Image</label>
                  <input
                    onChange={fileHandler}
                    type="file"
                    accept="image/*"
                    className="border border-gray-300 rounded-md p-2 outline-none w-full"
                  />
                  {formData.image && (
                    <p className="text-sm text-green-600">
                      Selected: {formData.image.name}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-black text-white w-full rounded-full border-none cursor-pointer py-2 hover:bg-gray-800 transition"
                >
                  Post Blog
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="p-4 h-auto">
            <h2 className="text-xl font-semibold mb-4">List of Blogs</h2>
            {loading ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Loading blogs...
              </div>
            ) : blogs.length === 0 ? (
              <div className="text-center py-10 text-gray-500 text-lg">
                Koi blog nahi hai abhi!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-4 py-2">Title</th>
                      <th className="border px-4 py-2">Category</th>
                      <th className="border px-4 py-2">Image</th>
                      <th className="border px-4 py-2">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="text-center">
                        <td className="border px-4 py-2">{blog.title}</td>
                        <td className="border px-4 py-2">{blog.category}</td>
                        <td className="border px-4 py-2">
                          <img
                            src={
                              blog.image?.startsWith("http")
                                ? blog.image
                                : `http://localhost:4000/images/${blog.image}`
                            }
                            alt={blog.title}
                            className="w-16 h-16 object-cover mx-auto"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => removeBlog(blog._id)}
                            className="text-red-500 font-bold hover:text-red-700 transition text-lg cursor-pointer"
                            title="Delete blog"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;