"use client";

import { useState, useRef } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Image as ImageIcon,
  Link,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AddPromotionalBannerPage() {
  const { createPromotionalBanner } = useHomepageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerType, setBannerType] = useState<"full-width" | "half-width">(
    "full-width"
  );
  const [isActive, setIsActive] = useState(true);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    backgroundColor: "#000000",
    textColor: "#ffffff",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) {
      toast.error("Please select an image for the banner");
      return;
    }

    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formDataToSend.append("image", file);
      }

      formDataToSend.append("title", formData.title);
      formDataToSend.append("subtitle", formData.subtitle);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("buttonText", formData.buttonText);
      formDataToSend.append("href", formData.buttonLink);
      formDataToSend.append(
        "position",
        bannerType === "full-width" ? "center" : "left"
      );
      formDataToSend.append("order", "0");
      formDataToSend.append("isActive", String(isActive));

      await createPromotionalBanner(formDataToSend);
      toast.success("Promotional banner created successfully!");

      setFormData({
        title: "",
        subtitle: "",
        description: "",
        buttonText: "",
        buttonLink: "",
        backgroundColor: "#000000",
        textColor: "#ffffff",
      });
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.push("/super-admin/promotional-banner/list");
    } catch (error) {
      toast.error("Failed to create promotional banner");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Preview */}
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-0 shadow-xl">
            <CardHeader>
              <h3 className="text-xl font-semibold text-white">
                Banner Preview
              </h3>
            </CardHeader>
            <CardContent>
              <div
                className={`relative rounded-lg overflow-hidden group`}
                style={{
                  aspectRatio: bannerType === "full-width" ? "21/9" : "16/9",
                  width: "100%",
                }}
              >
                {previewUrl ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewUrl}
                      alt="Banner preview"
                      fill
                      className="object-cover w-full h-full"
                      priority
                    />
                    <div
                      className="absolute inset-0 flex flex-col justify-end"
                      style={{
                        background: `linear-gradient(to top, ${formData.backgroundColor}ee, ${formData.backgroundColor}00)`,
                        padding: "2rem",
                      }}
                    >
                      <div className="space-y-4">
                        <h3
                          className="text-4xl font-bold"
                          style={{ color: formData.textColor }}
                        >
                          {formData.title || "Banner Title"}
                        </h3>
                        <p
                          className="text-xl opacity-90"
                          style={{ color: formData.textColor }}
                        >
                          {formData.subtitle || "Banner Subtitle"}
                        </p>
                        {formData.buttonText && (
                          <Button
                            variant="secondary"
                            className="hover:scale-105 transition-transform mt-4"
                          >
                            {formData.buttonText}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-sm text-gray-400">
                        Upload banner image
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Type Indicator */}
              <div className="mt-4 flex items-center justify-between">
                <Badge variant="outline" className="text-white">
                  {bannerType === "full-width"
                    ? "Full Width (21:9)"
                    : "Half Width (16:9)"}
                </Badge>
                {previewUrl && (
                  <Badge variant="outline" className="text-white">
                    Preview Mode
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Form */}
          <Card className="bg-white dark:bg-gray-800 shadow-xl">
            <CardHeader>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Banner Details
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Banner Image</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select Image
                  </Button>
                  {previewUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        setPreviewUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {/* Banner Type */}
              <div className="space-y-2">
                <Label>Banner Type</Label>
                <Select
                  value={bannerType}
                  onValueChange={(value: "full-width" | "half-width") =>
                    setBannerType(value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select banner type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-width">Full Width</SelectItem>
                    <SelectItem value="half-width">Half Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Title, Subtitle & Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter banner title"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="Enter banner subtitle"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter banner description"
                  />
                </div>
              </div>

              {/* Button Configuration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Button Text</Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) =>
                      setFormData({ ...formData, buttonText: e.target.value })
                    }
                    placeholder="Enter button text"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Button Link</Label>
                  <div className="relative">
                    <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      value={formData.buttonLink}
                      onChange={(e) =>
                        setFormData({ ...formData, buttonLink: e.target.value })
                      }
                      placeholder="Enter button link"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.backgroundColor}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backgroundColor: e.target.value,
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData({ ...formData, textColor: e.target.value })
                      }
                      className="w-12 h-12 p-1"
                    />
                    <Input
                      type="text"
                      value={formData.textColor}
                      onChange={(e) =>
                        setFormData({ ...formData, textColor: e.target.value })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              {/* Active Status */}
              <div className="flex items-center justify-between">
                <Label>Active Status</Label>
                <Switch checked={isActive} onCheckedChange={setIsActive} />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Banner"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
