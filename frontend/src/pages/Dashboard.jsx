import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Copy, Trash2, ExternalLink, Search, Link2 } from "lucide-react";
import { format } from "date-fns";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { linkService } from "../services/api";

const Dashboard = ({ showToast }) => {
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ targetUrl: "", code: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await linkService.getLinks();
      setLinks(data);
    } catch (error) {
      showToast("Failed to fetch links", "error");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    //validating the given url before submitting the form
    const errors = {}; //objec to catch all errors

    if (!formData.targetUrl.trim()) {
      errors.targetUrl = "Target URL is required";
    } else {
      try {
        new URL(formData.targetUrl); //checks the url format if the url is Target url is given
      } catch {
        errors.targetUrl = "Invalid URL format";
      }
    }

    //checking the format of the code or the custorm short url word
    if (formData.code && !/^[A-Za-z0-9]{6,8}$/.test(formData.code)) {
      errors.code = "Custom code must be 6-8 alphanumeric characters";
    }

    //saving errors if occurs
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);
      await linkService.createLink(formData.targetUrl, formData.code);
      showToast("Link created successfully!", "success");
      setShowModal(false);
      setFormData({ targetUrl: "", code: "" });
      setFormErrors({});
      fetchLinks();
    } catch (error) {
      if (error.response?.status === 409) {
        setFormErrors({ code: "This code is already taken" });
      } else {
        showToast("Failed to create link", "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    try {
      await linkService.deleteLink(code);
      showToast("Link deleted successfully", "success");
      fetchLinks();
    } catch (error) {
      showToast("Failed to delete link", "error");
    }
  };

  const handleCopy = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl); //Copies the short URL to the clipboard.
      showToast("Link copied to clipboard!", "success");
    } catch (error) {
      showToast("Failed to copy link", "error");
    }
  };

  const filteredLinks = links.filter(
    (link) =>
      link.targetUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
      link.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
  };

  return (
    <div className="min-h-screen bg-github-canvas">
      <div className="github-header">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link2 size={32} className="text-github-accent" />
            <h1 className="text-2xl font-semibold text-github-text">
              TinyLink
            </h1>
            <span className="text-github-text-secondary">URL Shortener</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Card className="animate-fade-in">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-github-text-secondary"
                  size={20}
                />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                className="w-full md:w-auto"
              >
                <Plus size={16} className="inline mr-2" />
                Create Link
              </Button>
            </div>
          </Card>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader size="lg" />
          </div>
        ) : filteredLinks.length === 0 ? (
          <Card className="text-center animate-fade-in">
            <div className="py-12">
              <Link2
                size={64}
                className="mx-auto text-github-text-secondary mb-4"
              />
              <h3 className="text-xl font-semibold text-github-text mb-2">
                No links found
              </h3>
              <p className="text-github-text-secondary mb-6">
                {searchTerm
                  ? "No links match your search"
                  : "Create your first short link to get started"}
              </p>
              {!searchTerm && (
                <Button variant="primary" onClick={() => setShowModal(true)}>
                  <Plus size={16} className="inline mr-2" />
                  Create Your First Link
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="github-table animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-github-canvas-subtle border-b border-github-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-github-text">
                      Short Link
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-github-text">
                      Original URL
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-github-text">
                      Clicks
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-github-text">
                      Created
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-github-text">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLinks.map((link, index) => (
                    <tr
                      key={link.code}
                      className={`border-b border-github-border hover:bg-github-canvas-subtle transition-colors ${
                        index === 0 ? "animate-fade-in" : ""
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-lg text-github-accent">
                            {link.code}
                          </span>
                          <button
                            onClick={() => handleCopy(link.shortUrl)}
                            className="text-github-text-secondary hover:text-github-accent transition-colors"
                            title="Copy link"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={link.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="github-link flex items-center gap-1 group"
                        >
                          <span className="group-hover:underline">
                            {truncateUrl(link.targetUrl)}
                          </span>
                          <ExternalLink
                            size={14}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="github-badge">{link.clicks}</span>
                      </td>
                      <td className="px-6 py-4 github-text-secondary">
                        {format(new Date(link.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/code/${link.code}`)}
                          >
                            Stats
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(link.code)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setFormErrors({});
            setFormData({ targetUrl: "", code: "" });
          }}
          title="Create New Short Link"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="url"
              label="Target URL"
              placeholder="https://example.com"
              value={formData.targetUrl}
              onChange={(e) =>
                setFormData({ ...formData, targetUrl: e.target.value })
              }
              error={formErrors.targetUrl}
              disabled={submitting}
              required
            />

            <Input
              type="text"
              label="Custom Code (Optional)"
              placeholder="6-8 alphanumeric characters"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              error={formErrors.code}
              disabled={submitting}
              maxLength={8}
            />

            <div className="text-xs text-github-text-secondary">
              Leave empty for auto-generated code
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Creating..." : "Create Link"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowModal(false);
                  setFormErrors({});
                  setFormData({ targetUrl: "", code: "" });
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
