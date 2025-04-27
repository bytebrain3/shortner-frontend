"use client"



import { useState } from "react"
import { Check, Copy, Link, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"



export function CreateUrlDialog() {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [customCode, setCustomCode] = useState("")
  const [useCustomCode, setUseCustomCode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState("")
  const [activeTab, setActiveTab] = useState("create")

  const isValidUrl = (urlString) => {
    try {
      new URL(urlString)
      return true
    } catch (err) {
      return false
    }
  }

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCustomCode(result)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!url) {
      toast.error("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      toast.error("Please enter a valid URL");
      return;
    }

    if (useCustomCode && !customCode) {
      toast.error("Please enter a custom code");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/create-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          customCode: useCustomCode ? customCode : undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Call the dashboard refresh function
        if (window.fetchDashboardData) {
          window.fetchDashboardData();
        }

        setGeneratedUrl(`https://url.dipdev.xyz/r/${data.data.short}`);
        setActiveTab("success");
        toast.success("URL shortened successfully!");
      } else {
        toast.error(data.error || "Failed to create shortened URL");
      }
    } catch (error) {
      console.error("Error creating shortened URL:", error);
      toast.error("An error occurred while creating the URL");
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl)
    toast.success("URL copied to clipboard!")
  }

  const resetForm = () => {
    setUrl("")
    setCustomCode("")
    setUseCustomCode(false)
    setGeneratedUrl("")
    setActiveTab("create")
  }

  const handleDialogChange = (open) => {
    setOpen(open)
    if (!open) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger asChild>
        <Button>
          <Link className="mr-2 h-4 w-4" />
          Create New URL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create" disabled={activeTab === "success"}>
              Create URL
            </TabsTrigger>
            <TabsTrigger value="success" disabled={activeTab === "create"}>
              Success
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <DialogHeader>
              <DialogTitle>Create Shortened URL</DialogTitle>
              <DialogDescription>
                Enter the URL you want to shorten. You can optionally customize the short code.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="url">URL to shorten</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/very-long-url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>
              <div className="hidden items-center space-x-2">
                <Switch id="custom-code" checked={false} onCheckedChange={setUseCustomCode} />
                <Label htmlFor="custom-code">Use custom short code</Label>
              </div>
              {useCustomCode && (
                <div className="space-y-2">
                  <Label htmlFor="custom-code-input">Custom short code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="custom-code-input"
                      placeholder="abc123"
                      value={customCode}
                      onChange={(e) => setCustomCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your URL will be: https://url.dipdev.xyz/{customCode || "custom-code"}
                  </p>
                </div>
              )}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create URL"}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
          <TabsContent value="success">
            <DialogHeader>
              <DialogTitle>URL Created Successfully!</DialogTitle>
              <DialogDescription>Your shortened URL is ready to use.</DialogDescription>
            </DialogHeader>
            <div className="py-6 space-y-4">
              <div className="space-y-2">
                <Label>Your shortened URL</Label>
                <div className="flex items-center space-x-2">
                  <Input value={generatedUrl} readOnly className="flex-1" />
                  <Button variant="outline" size="icon" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-md">
                <div className="flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-500" />
                  <span>URL has been added to your dashboard</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>
                Create Another
              </Button>
              <Button onClick={() => setOpen(false)}>Done</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
