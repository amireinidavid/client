"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Address, useAddressStore } from "@/store/useAddressStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";

const initialAddressFormState = {
  name: "",
  address: "",
  city: "",
  country: "",
  postalCode: "",
  phone: "",
  isDefault: false,
};

function UserAccountPage() {
  const {
    isLoading: addressesLoading,
    addresses,
    error: addressesError,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
  } = useAddressStore();
  const [showAddresses, setShowAddresses] = useState(false);
  const [editingAddress, setEditingAddress] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialAddressFormState);
  const { toast } = useToast();
  const { userOrders, getOrdersByUserId, isLoading } = useOrderStore();

  useEffect(() => {
    fetchAddresses();
    getOrdersByUserId();
  }, [fetchAddresses, getOrdersByUserId]);

  console.log(userOrders, "userOrders");

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress, formData);
        if (result) {
          fetchAddresses();
          setEditingAddress(null);
        }
      } else {
        const result = await createAddress(formData);
        if (result) {
          fetchAddresses();
          toast({
            title: "Address created successfully",
          });
        }
      }

      setShowAddresses(false);
      setFormData(initialAddressFormState);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEditAddress = (address: Address) => {
    setFormData({
      name: address.name,
      address: address.address,
      city: address.city,
      country: address.country,
      phone: address.phone,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    });

    setEditingAddress(address.id);
    setShowAddresses(true);
  };

  const handleDeleteAddress = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you wanna delete this address?"
    );

    if (confirmed) {
      try {
        const success = await deleteAddress(id);
        if (success) {
          toast({
            title: "Address is deleted successfully",
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  console.log(addresses);

  const getStatusColor = (
    status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED"
  ) => {
    switch (status) {
      case "PENDING":
        return "bg-blue-500";

      case "PROCESSING":
        return "bg-yellow-500";

      case "SHIPPED":
        return "bg-purple-500";

      case "DELIVERED":
        return "bg-green-500";

      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              My Account
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your orders and addresses
            </p>
          </div>
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
            <span className="text-white text-xl">👤</span>
          </div>
        </div>

        <Tabs defaultValue="orders" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 p-1 bg-gray-100 rounded-lg">
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md transition-all duration-300"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger
              value="addresses"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-600 data-[state=active]:shadow-md transition-all duration-300"
            >
              Addresses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                  <span className="text-purple-600">📦</span> Order History
                </h2>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <div className="text-6xl mb-4">🛍️</div>
                    <h1 className="text-2xl font-bold text-gray-700">
                      No Orders Yet
                    </h1>
                    <p className="text-gray-500 mt-2">
                      Start shopping to create your first order
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-lg border border-gray-100">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            Order #
                          </TableHead>
                          <TableHead className="font-semibold">Date</TableHead>
                          <TableHead className="font-semibold">Items</TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map((order) => (
                          <TableRow
                            key={order.id}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {order.items.length}{" "}
                              {order.items.length > 1 ? "Items" : "Item"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={`${getStatusColor(order.status)}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>${order.total.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses">
            <Card className="border-none shadow-lg">
              <CardContent className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <span className="text-purple-600">📍</span> Addresses
                  </h2>
                  <Button
                    onClick={() => {
                      setEditingAddress(null);
                      setFormData(initialAddressFormState);
                      setShowAddresses(true);
                    }}
                    className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                  >
                    + Add New Address
                  </Button>
                </div>

                {showAddresses ? (
                  <form
                    onSubmit={handleAddressSubmit}
                    className="w-full bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
                  >
                    <div className="mb-8">
                      <h3 className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                        {editingAddress ? "Update Address" : "Add New Address"}
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Fill in the details for your address
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="name"
                          value={formData.name}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                          placeholder="John Doe"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Phone Number
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="phone"
                          value={formData.phone}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div className="space-y-3 md:col-span-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Street Address
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="address"
                          value={formData.address}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          placeholder="1234 Main Street, Apt 4B"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          City
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="city"
                          value={formData.city}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              city: e.target.value,
                            })
                          }
                          placeholder="New York"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Postal Code
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="postalCode"
                          value={formData.postalCode}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              postalCode: e.target.value,
                            })
                          }
                          placeholder="10001"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                          Country
                        </Label>
                        <Input
                          className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 rounded-xl"
                          id="country"
                          value={formData.country}
                          required
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              country: e.target.value,
                            })
                          }
                          placeholder="United States"
                        />
                      </div>

                      <div className="md:col-span-2 flex items-center space-x-2 bg-gray-50 p-4 rounded-xl">
                        <Checkbox
                          id="default"
                          checked={formData.isDefault}
                          onCheckedChange={(checked) =>
                            setFormData({
                              ...formData,
                              isDefault: checked as boolean,
                            })
                          }
                          className="h-5 w-5 border-2 border-purple-500"
                        />
                        <Label
                          className="text-gray-700 font-medium"
                          htmlFor="default"
                        >
                          Set as default address
                        </Label>
                      </div>

                      <div className="md:col-span-2 flex space-x-4 pt-6">
                        <Button
                          type="submit"
                          className="flex-1 h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                        >
                          {editingAddress ? "Update" : "Save"} Address
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setShowAddresses(false);
                            setEditingAddress(null);
                          }}
                          className="flex-1 h-12 text-lg border-2 hover:bg-gray-50"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <Card
                        key={address.id}
                        className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 overflow-hidden relative bg-white"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardContent className="p-8 relative">
                          <div className="flex flex-col space-y-4">
                            {/* Header Section */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-center space-x-3">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    {address.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                                    {address.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {address.phone}
                                  </p>
                                </div>
                              </div>
                              {address.isDefault && (
                                <Badge className="bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 text-sm font-medium">
                                  <span className="flex items-center gap-1">
                                    ⭐ Default
                                  </span>
                                </Badge>
                              )}
                            </div>

                            {/* Address Details Section */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 group-hover:bg-gray-100/80 transition-colors duration-300">
                              <div className="flex items-start space-x-2">
                                <svg
                                  className="w-5 h-5 text-purple-500 mt-1"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <div className="flex-1">
                                  <p className="text-gray-700 font-medium leading-relaxed">
                                    {address.address}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                                    <span className="px-2 py-1 bg-white rounded-md shadow-sm">
                                      {address.city}
                                    </span>
                                    <span>•</span>
                                    <span className="px-2 py-1 bg-white rounded-md shadow-sm">
                                      {address.country}
                                    </span>
                                    <span>•</span>
                                    <span className="px-2 py-1 bg-white rounded-md shadow-sm">
                                      {address.postalCode}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-3 pt-2">
                              <Button
                                onClick={() => handleEditAddress(address)}
                                variant="outline"
                                className="flex-1 bg-white hover:bg-purple-50 border-2 border-purple-200 hover:border-purple-500 text-purple-600 transition-all duration-300"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleDeleteAddress(address.id)}
                                variant="destructive"
                                className="flex-1 bg-white hover:bg-red-50 border-2 border-red-200 hover:border-red-500 text-red-600 transition-all duration-300"
                              >
                                <svg
                                  className="w-4 h-4 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default UserAccountPage;
