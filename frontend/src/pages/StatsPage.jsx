import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Copy,
  Calendar,
  MousePointer,
  Link2,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import Card from "../components/Card";
import Button from "../components/Button";
import Loader from "../components/Loader";
import { linkService } from "../services/api";

const StatsPage = ({ showToast }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLinkStats();
  }, [code]);

  const fetchLinkStats = async () => {
    try {
      setLoading(true);
      const data = await linkService.getLinkStats(code);
      setLink(data);
      setError(null);
    } catch (error) {
      if (error.response?.status === 404) {
        setError("Link not found");
      } else {
        setError("Failed to fetch link statistics");
        showToast("Failed to fetch link statistics", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", "success");
    } catch (error) {
      showToast("Failed to copy link", "error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-github-canvas">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-github-canvas">
        <Card className="text-center max-w-md">
          <Link2
            size={64}
            className="mx-auto text-github-text-secondary mb-4"
          />
          <h1 className="text-2xl font-bold mb-2 text-github-text">{error}</h1>
          <p className="text-github-text-secondary mb-6">
            The short link you're looking for doesn't exist.
          </p>
          <Button variant="primary" onClick={() => navigate("/")}>
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-github-canvas">
      <div className="github-header">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft size={16} className="inline mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Link2 size={24} className="text-github-accent" />
              <h1 className="text-xl font-semibold text-github-text">
                Link Statistics
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="github-text-secondary">
            Detailed analytics for your short link
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-github-accent/20 rounded-md">
                <Link2 className="text-github-accent" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-github-text">
                Short Link
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl text-github-accent">
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
              <a
                href={link.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 github-link"
              >
                {link.shortUrl}
                <ExternalLink size={14} />
              </a>
            </div>
          </Card>

          <Card className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-github-success/20 rounded-md">
                <MousePointer className="text-github-text-success" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-github-text">
                Click Statistics
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-github-text-success">
                  {link.clicks}
                </div>
                <div className="github-text-secondary">Total clicks</div>
              </div>
              {link.lastClicked && (
                <div className="text-sm github-text-secondary">
                  Last clicked:{" "}
                  {formatDistanceToNow(new Date(link.lastClicked), {
                    addSuffix: true,
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-github-text-link/20 rounded-md">
                <ExternalLink className="text-github-text-link" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-github-text">
                Target URL
              </h2>
            </div>
            <div className="space-y-3">
              <a
                href={link.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block github-link hover:underline break-all"
              >
                {link.targetUrl}
              </a>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleCopy(link.targetUrl)}
              >
                <Copy size={14} className="inline mr-1" />
                Copy URL
              </Button>
            </div>
          </Card>

          <Card className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-github-warning/20 rounded-md">
                <Calendar className="text-github-text-warning" size={24} />
              </div>
              <h2 className="text-lg font-semibold text-github-text">
                Timeline
              </h2>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-sm github-text-secondary">Created</div>
                <div className="font-medium text-github-text">
                  {format(new Date(link.createdAt), "MMMM d, yyyy")} at{" "}
                  {format(new Date(link.createdAt), "h:mm a")}
                </div>
              </div>
              {link.lastClicked && (
                <div>
                  <div className="text-sm github-text-secondary">
                    Last clicked
                  </div>
                  <div className="font-medium text-github-text">
                    {format(new Date(link.lastClicked), "MMMM d, yyyy")} at{" "}
                    {format(new Date(link.lastClicked), "h:mm a")}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center animate-fade-in">
          <Button variant="secondary" onClick={() => navigate("/")}>
            <ArrowLeft size={16} className="inline mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
