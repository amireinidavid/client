"use client";

import { useEffect, useState } from "react";
import { useHomepageStore } from "@/store/useHomepageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  Plus,
  Calendar,
  Package,
  Trash2,
  Edit,
  Eye,
  AlertCircle,
  Timer,
  Tag,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FlashSaleListPage() {
  const { fetchFlashSaleConfigs, deleteFlashSaleConfig } = useHomepageStore();
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [filteredSales, setFilteredSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    const loadFlashSales = async () => {
      try {
        const response = await fetchFlashSaleConfigs();
        setFlashSales(response.data);
        setFilteredSales(response.data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load flash sales");
        setIsLoading(false);
      }
    };
    loadFlashSales();
  }, [fetchFlashSaleConfigs]);

  useEffect(() => {
    let filtered = flashSales;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (sale) =>
          sale.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sale.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((sale) => getStatus(sale) === statusFilter);
    }

    setFilteredSales(filtered);
  }, [searchTerm, statusFilter, flashSales]);

  const handleDelete = async (id: string) => {
    try {
      await deleteFlashSaleConfig(id);
      setFlashSales((prev) => prev.filter((sale) => sale.id !== id));
      toast.success("Flash sale deleted successfully");
    } catch (error) {
      toast.error("Failed to delete flash sale");
    }
  };

  const getStatus = (sale: any) => {
    const now = new Date();
    const startTime = new Date(sale.startTime);
    const endTime = new Date(sale.endTime);

    if (!sale.isActive) return "inactive";
    if (now < startTime) return "upcoming";
    if (now >= startTime && now <= endTime) return "active";
    return "expired";
  };

  const getStatusBadge = (sale: any) => {
    const status = getStatus(sale);
    const statusConfig = {
      inactive: { bg: "bg-gray-100", text: "text-gray-700", label: "Inactive" },
      upcoming: { bg: "bg-blue-100", text: "text-blue-700", label: "Upcoming" },
      active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
      expired: { bg: "bg-red-100", text: "text-red-700", label: "Expired" },
    };

    const config = statusConfig[status];
    return (
      <Badge
        variant="secondary"
        className={`${config.bg} ${config.text} font-medium`}
      >
        {config.label}
      </Badge>
    );
  };

  const getTimeRemaining = (sale: any) => {
    const now = new Date();
    const startTime = new Date(sale.startTime);
    const endTime = new Date(sale.endTime);
    const status = getStatus(sale);

    if (status === "upcoming") {
      const diff = startTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      return `Starts in ${days} days`;
    }

    if (status === "active") {
      const diff = endTime.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      return `${days}d ${hours}h remaining`;
    }

    return null;
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Flash Sales
          </h1>
          <p className="text-gray-500 mt-1">
            Manage your time-limited promotional campaigns
          </p>
        </div>
        <Button
          onClick={() => router.push("/super-admin/flashsale/add")}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Flash Sale
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search flash sales..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flash Sales Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-[300px]" />
            </Card>
          ))}
        </div>
      ) : (
        <AnimatePresence>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSales.map((sale) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="group"
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg border-gray-200 hover:border-purple-200">
                  <CardHeader className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl mb-2 text-gray-800">
                          {sale.title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">{sale.subtitle}</p>
                      </div>
                      {getStatusBadge(sale)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {getTimeRemaining(sale) && (
                      <div className="flex items-center gap-2 text-sm bg-indigo-50 p-2 rounded-md">
                        <Timer className="h-4 w-4 text-indigo-500" />
                        <span className="text-indigo-600 font-medium">
                          {getTimeRemaining(sale)}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>
                          {format(new Date(sale.startTime), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>
                          {format(new Date(sale.endTime), "MMM dd, yyyy")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm bg-gray-50 p-2 rounded-md">
                      <Package className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {sale.products.length} Products
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sale.products.slice(0, 3).map((product: any) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-2 bg-white border border-gray-200 p-2 rounded-md text-sm hover:border-purple-200 transition-colors"
                        >
                          <Tag className="h-4 w-4 text-purple-500" />
                          <span className="truncate max-w-[150px]">
                            {product.product.name}
                          </span>
                        </div>
                      ))}
                      {sale.products.length > 3 && (
                        <Badge variant="secondary" className="bg-gray-100">
                          +{sale.products.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/super-admin/flashsale/${sale.id}`)
                        }
                        className="hover:bg-purple-50 hover:text-purple-600"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/super-admin/flashsale/edit/${sale.id}`)
                        }
                        className="hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-red-50 hover:text-red-600 border-red-200"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Flash Sale
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this flash sale?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(sale.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* Empty State */}
      {!isLoading && filteredSales.length === 0 && (
        <Card className="p-8 text-center border-dashed">
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-purple-100 p-3">
              <AlertCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                No Flash Sales Found
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters or search terms"
                  : "Create your first flash sale to get started"}
              </p>
            </div>
            <Button
              onClick={() => router.push("/super-admin/flashsale/add")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Flash Sale
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
