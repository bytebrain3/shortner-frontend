"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe,
  Laptop,
  Share2,
  BarChart3,
  Clipboard,
  LinkIcon,
  Monitor,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CreateUrlDialog } from "@/components/create-url-dialog";
import URLCardSkeleton from "@/components/urlSkeleton";

import Link from "next/link";
import axios from "axios";
import axiosInstance from "@/lib/axiosInstance";
import { toast } from "sonner";
import { LogOut } from "lucide-react";

export default function URLDashboard() {
  const [expandedUrls, setExpandedUrls] = useState({});
  const [urlData, setUrlData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [urls, setUrls] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/get-urls`);
      setUrlData(res.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Expose fetchData to window
    window.fetchDashboardData = fetchData;

    // Cleanup
    return () => {
      delete window.fetchDashboardData;
    };
  }, []);

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm:ss");
    } catch (error) {
      return dateString;
    }
  };

  const getTotalClicks = () => {
    return urlData.reduce(
      (total, url) => total + (url.Analitics?.Click || 0),
      0
    );
  };

  const getUniqueVisitors = () => {
    const uniqueIPs = new Set();
    urlData.forEach((url) => {
      if (url.Analitics?.IPsWhoVisited) {
        url.Analitics.IPsWhoVisited.forEach((ip) => uniqueIPs.add(ip));
      }
    });
    return uniqueIPs.size;
  };

  const toggleUrlExpansion = (id) => {
    setExpandedUrls((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(`https://url.dipdev.xyz/r/${text}`);
  };

  const handleDelete = async (urlId) => {
    if (!confirm("Are you sure you want to delete this URL?")) {
      return;
    }

    try {
      const res = await axiosInstance.delete(`/delete-url/${urlId}`);
      if (res.status === 200) {
        toast.success("URL deleted successfully");
        fetchData();
      } else {
        toast.error("Failed to delete URL");
      }
    } catch (error) {
      console.error("Error deleting URL:", error);
      toast.error("Failed to delete URL. Please try again.");
    }
  };

  const logout = async () => {
    try {
      const res = await axiosInstance.post("/logout");
      if (res.status === 200) {
        toast.success("Logged out successfully");
        window.location.href = "/";
      } else {
        toast.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out. Please try again.");
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">URL Shortener Dashboard</h1>
          <div className="flex items-center space-x-4">
            <CreateUrlDialog />
            <Button onClick={logout}>
              <span>Logout</span>
              <LogOut />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                ) : (
                  urlData.length
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Clicks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                ) : (
                  getTotalClicks()
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Unique Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
                ) : (
                  getUniqueVisitors()
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="text-start flex flex-col">
                <CardTitle>Your Shortened URLs</CardTitle>
                <CardDescription>
                  Manage and track all your shortened URLs with analytics
                </CardDescription>
              </div>
              <Button onClick={fetchData} variant="outline">
                Referrers
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {loading ? (
              <>
                <URLCardSkeleton />
                <URLCardSkeleton />
                <URLCardSkeleton />
              </>
            ) : (
              urlData.map((url) => (
                <Collapsible
                  key={url.ID}
                  open={!!expandedUrls[url.ID]}
                  className="border rounded-lg"
                >
                  <div className="p-4 bg-card">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold mr-2">
                            {url.ShortCode}
                          </h3>
                          <Badge
                            variant={
                              url.Analitics?.Click > 0 ? "default" : "secondary"
                            }
                            className="mr-2"
                          >
                            {url.Analitics?.Click || 0} clicks
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => copyToClipboard(url.ShortCode)}
                                >
                                  <Clipboard className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Copy short URL</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1 flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(url.CreatedAt)}
                        </div>
                      </div>
                      <div className="flex flex-col md:items-end">
                        <a
                          href={url.FullURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center text-sm truncate max-w-[300px]"
                        >
                          {url.FullURL}
                          <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                        </a>
                        <div className="flex items-center mt-1 space-x-4">
                          <Link
                            href={`https://url.dipdev.xyz/r/${url.ShortCode}`}
                            className="mr-2"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Visit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUrlExpansion(url.ID)}
                          >
                            {expandedUrls[url.ID] ? (
                              <>
                                <ChevronUp className="mr-1 h-3 w-3" />
                                Hide Analytics
                              </>
                            ) : (
                              <>
                                <ChevronDown className="mr-1 h-3 w-3" />
                                View Analytics
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(url.ID)}
                            className="text-destructive hover:bg-destructive"
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <CollapsibleContent>
                    <div className="p-4 pt-0 border-t">
                      {url.Analitics?.Click > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 pt-4">
                          {/* Visitor Stats */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Visitor Statistics</h4>

                            {/* Browsers */}
                            <div>
                              <h5 className="text-sm font-medium mb-3 flex items-center">
                                <Globe className="mr-2 h-4 w-4" />
                                Browsers
                              </h5>
                              <div className="space-y-2">
                                {url.Analitics?.BrowserWhoVisited?.reduce(
                                  (acc, browser) => {
                                    acc[browser] = (acc[browser] || 0) + 1;
                                    return acc;
                                  },
                                  {}
                                ) &&
                                  Object.entries(
                                    url.Analitics?.BrowserWhoVisited?.reduce(
                                      (acc, browser) => {
                                        acc[browser] = (acc[browser] || 0) + 1;
                                        return acc;
                                      },
                                      {}
                                    ) || {}
                                  ).map(([browser, count], index) => (
                                    <div key={index} className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>{browser}</span>
                                        <span className="font-medium">
                                          {count}
                                        </span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary rounded-full"
                                          style={{
                                            width: `${Math.round(
                                              (count /
                                                (url.Analitics?.Click || 1)) *
                                                100
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Devices */}
                            <div>
                              <h5 className="text-sm font-medium mb-3 flex items-center">
                                <Laptop className="mr-2 h-4 w-4" />
                                Devices
                              </h5>
                              <div className="space-y-2">
                                {url.Analitics?.DeviceWhoVisited?.reduce(
                                  (acc, device) => {
                                    acc[device] = (acc[device] || 0) + 1;
                                    return acc;
                                  },
                                  {}
                                ) &&
                                  Object.entries(
                                    url.Analitics?.DeviceWhoVisited?.reduce(
                                      (acc, device) => {
                                        acc[device] = (acc[device] || 0) + 1;
                                        return acc;
                                      },
                                      {}
                                    ) || {}
                                  ).map(([device, count], index) => (
                                    <div key={index} className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>{device}</span>
                                        <span className="font-medium">
                                          {count}
                                        </span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary rounded-full"
                                          style={{
                                            width: `${Math.round(
                                              (count /
                                                (url.Analitics?.Click || 1)) *
                                                100
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>

                          {/* Technical Details */}
                          <div className="space-y-4">
                            <h4 className="font-medium">Technical Details</h4>

                            {/* OS */}
                            <div>
                              <h5 className="text-sm font-medium mb-3 flex items-center">
                                <Monitor className="mr-2 h-4 w-4" />
                                Operating Systems
                              </h5>
                              <div className="space-y-2">
                                {url.Analitics?.OSWhoVisited?.reduce(
                                  (acc, os) => {
                                    acc[os] = (acc[os] || 0) + 1;
                                    return acc;
                                  },
                                  {}
                                ) &&
                                  Object.entries(
                                    url.Analitics?.OSWhoVisited?.reduce(
                                      (acc, os) => {
                                        acc[os] = (acc[os] || 0) + 1;
                                        return acc;
                                      },
                                      {}
                                    ) || {}
                                  ).map(([os, count], index) => (
                                    <div key={index} className="space-y-1">
                                      <div className="flex justify-between text-sm">
                                        <span>{os}</span>
                                        <span className="font-medium">
                                          {count}
                                        </span>
                                      </div>
                                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-primary rounded-full"
                                          style={{
                                            width: `${Math.round(
                                              (count /
                                                (url.Analitics?.Click || 1)) *
                                                100
                                            )}%`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Referrers */}
                            <div>
                              <h5 className="text-sm font-medium mb-3 flex items-center">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Referrers
                              </h5>
                              {url.Analitics?.ReferrerWhoVisited ? (
                                <div className="space-y-2">
                                  {url.Analitics?.ReferrerWhoVisited?.reduce(
                                    (acc, referrer) => {
                                      acc[referrer || "Direct"] =
                                        (acc[referrer || "Direct"] || 0) + 1;
                                      return acc;
                                    },
                                    {}
                                  ) &&
                                    Object.entries(
                                      url.Analitics?.ReferrerWhoVisited?.reduce(
                                        (acc, referrer) => {
                                          acc[referrer || "Direct"] =
                                            (acc[referrer || "Direct"] || 0) +
                                            1;
                                          return acc;
                                        },
                                        {}
                                      ) || {}
                                    ).map(([referrer, count], index) => (
                                      <div key={index} className="space-y-1">
                                        <div className="flex justify-between text-sm">
                                          <span>{referrer}</span>
                                          <span className="font-medium">
                                            {count}
                                          </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div
                                            className="h-full bg-primary rounded-full"
                                            style={{
                                              width: `${Math.round(
                                                (count /
                                                  (url.Analitics?.Click || 1)) *
                                                  100
                                              )}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">
                                  No referrer data available
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <div className="bg-muted/50 rounded-full p-4 mb-4">
                            <BarChart3 className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">
                            No visitor data available yet
                          </h3>
                          <p className="text-muted-foreground max-w-md">
                            Analytics will appear after the first click on your
                            shortened URL.
                          </p>
                          <Button className="mt-4" size="sm">
                            <Share2 className="mr-2 h-4 w-4" />
                            Share URL
                          </Button>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
