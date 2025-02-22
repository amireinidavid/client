"use client";

import { useEffect, useState } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  ArrowUpDown,
  LayoutGrid,
  LayoutList,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function PromotionalBannerListPage() {
  const {
    promotionalBanners,
    fetchPromotionalBanners,
    deletePromotionalBanner,
  } = useHomepageStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "active">(
    "newest"
  );

  useEffect(() => {
    const loadBanners = async () => {
      try {
        await fetchPromotionalBanners();
      } catch (error) {
        toast.error("Failed to fetch banners");
      } finally {
        setIsLoading(false);
      }
    };
    loadBanners();
  }, [fetchPromotionalBanners]);

  const handleDelete = async (id: string) => {
    try {
      await deletePromotionalBanner(id);
      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  const filteredBanners = promotionalBanners
    ?.filter(
      (banner) =>
        banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        banner.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "active":
          return Number(b.isActive) - Number(a.isActive);
        default:
          return 0;
      }
    });

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 dark:bg-gray-800" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold">Promotional Banners</h2>
        <Link href="/super-admin/promotional-banner/add">
          <Button className="bg-gradient-to-r from-primary to-purple-600">
            <Plus className="mr-2 h-4 w-4" /> Add New Banner
          </Button>
        </Link>
      </div>

      {/* Filters and Controls */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("newest")}>
                    Newest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("oldest")}>
                    Oldest First
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("active")}>
                    Active Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="flex items-center gap-2 border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Banners Grid/List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filteredBanners?.map((banner) => (
          <Card
            key={banner.id}
            className={`group overflow-hidden transition-all duration-300 hover:shadow-lg ${
              viewMode === "list" ? "flex" : ""
            }`}
          >
            <div
              className={`relative ${
                viewMode === "list" ? "w-48" : "aspect-video"
              }`}
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button size="icon" variant="ghost" className="text-white">
                  <Eye className="h-4 w-4" />
                </Button>
                <Link
                  href={`/super-admin/promotional-banner/edit/${banner.id}`}
                >
                  <Button size="icon" variant="ghost" className="text-white">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="text-white">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this banner? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(banner.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <CardContent
              className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {banner.subtitle}
                  </p>
                </div>
                <Switch checked={banner.isActive} />
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">
                  {banner.position.charAt(0).toUpperCase() +
                    banner.position.slice(1)}
                </Badge>
                <Badge variant={banner.isActive ? "default" : "secondary"}>
                  {banner.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredBanners?.length === 0 && (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-gray-100 p-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">No banners found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or create a new banner
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}
