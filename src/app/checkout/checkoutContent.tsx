"use client";

import { paymentAction } from "@/actions/payment";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { useAddressStore } from "@/store/useAddressStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CartItem, useCartStore } from "@/store/useCartStore";
import { Coupon, useCouponStore } from "@/store/useCouponStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useProductStore } from "@/store/UseProductsStore";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CreateOrderData } from "@/store/useOrderStore";

function CheckoutContent() {
  const { addresses, fetchAddresses } = useAddressStore();
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [cartItemsWithDetails, setCartItemsWithDetails] = useState<
    (CartItem & { product: any })[]
  >([]);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponAppliedError, setCouponAppliedError] = useState("");
  const { items, fetchCart, clearCart } = useCartStore();
  const { getProductById } = useProductStore();
  const { fetchCoupons, couponList } = useCouponStore();
  const {
    createPayPalOrder,
    capturePayPalOrder,
    createFinalOrder,
    isPaymentProcessing,
  } = useOrderStore();
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    fetchCoupons();
    fetchAddresses();
    fetchCart();
  }, [fetchAddresses, fetchCart, fetchCoupons]);

  useEffect(() => {
    const findDefaultAddress = addresses.find((address) => address.isDefault);

    if (findDefaultAddress) {
      setSelectedAddress(findDefaultAddress.id);
    }
  }, [addresses]);

  useEffect(() => {
    const fetchIndividualProductDetails = async () => {
      try {
        const itemsWithDetails = await Promise.all(
          items.map(async (item) => {
            const product = await getProductById(item.productId);
            if (!product) {
              console.error(`Product not found for ID: ${item.productId}`);
              return {
                ...item,
                product: {
                  name: "Product Not Found",
                  price: 0,
                  images: ["/fashion-hero2.jpg"],
                },
              };
            }
            return { ...item, product };
          })
        );

        setCartItemsWithDetails(itemsWithDetails);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: "Error loading product details",
          variant: "destructive",
        });
      }
    };

    fetchIndividualProductDetails();
  }, [items, getProductById]);

  function handleApplyCoupon() {
    const getCurrentCoupon = couponList.find((c) => c.code === couponCode);

    if (!getCurrentCoupon) {
      setCouponAppliedError("Invalied Coupon code");
      setAppliedCoupon(null);
      return;
    }

    const now = new Date();

    if (
      now < new Date(getCurrentCoupon.startDate) ||
      now > new Date(getCurrentCoupon.endDate)
    ) {
      setCouponAppliedError(
        "Coupon is not valid in this time or expired coupon"
      );
      setAppliedCoupon(null);
      return;
    }

    if (getCurrentCoupon.usageCount >= getCurrentCoupon.usageLimit) {
      setCouponAppliedError(
        "Coupon has reached its usage limit! Please try a diff coupon"
      );
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(getCurrentCoupon);
    setCouponAppliedError("");
  }

  const handlePrePaymentFlow = async () => {
    const result = await paymentAction(checkoutEmail);
    if (!result.success) {
      toast({
        title: result.error,
        variant: "destructive",
      });

      return;
    }

    setShowPaymentFlow(true);
  };

  const handleFinalOrderCreation = async (data: any) => {
    if (!user) {
      toast({
        title: "User not authenticated",
      });

      return;
    }
    try {
      const orderData = {
        userId: user?.id,
        addressId: selectedAddress,
        items: cartItemsWithDetails.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productCategory: item.product.category,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.product.price,
        })),
        couponId: appliedCoupon?.id,
        total,
        paymentMethod: "CREDIT_CARD" as const,
        paymentStatus: "COMPLETED" as const,
        paymentId: data.id,
      };

      const createFinalOrderResponse = await createFinalOrder(orderData);

      if (createFinalOrderResponse) {
        await clearCart();
        router.push("/account");
      } else {
        toast({
          title: "There is some error while processing final order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "There is some error while processing final order",
        variant: "destructive",
      });
    }
  };

  const subTotal = cartItemsWithDetails.reduce(
    (acc, item) => acc + (item.product?.price || 0) * item.quantity,
    0
  );

  const discountAmount = appliedCoupon
    ? (subTotal * appliedCoupon.discountPercent) / 100
    : 0;

  const total = subTotal - discountAmount;

  useEffect(() => {
    console.log("Payment flow state:", showPaymentFlow);
  }, [showPaymentFlow]);

  if (isPaymentProcessing) {
    return (
      <Skeleton className="w-full h-[600px] rounded-xl">
        <div className="h-full flex justify-center items-center">
          <h1 className="text-3xl font-bold">
            Processing payment...Please wait!
          </h1>
        </div>
      </Skeleton>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Checkout Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-gradient">
            Secure Checkout
          </h1>
          <div className="mt-4 flex items-center justify-center space-x-8">
            <span className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Secure Payment
            </span>
            <span className="flex items-center text-gray-600">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              SSL Encrypted
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Section - Delivery & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Section */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
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
                  </div>
                  <h2 className="text-2xl font-semibold">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`group relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        selectedAddress === address.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <Checkbox
                          id={address.id}
                          checked={selectedAddress === address.id}
                          className="mt-1"
                        />
                        <Label
                          htmlFor={address.id}
                          className="flex-grow cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{address.name}</span>
                            {address.isDefault && (
                              <span className="px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-xs rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {address.address}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {address.city}, {address.country},{" "}
                            {address.postalCode}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {address.phone}
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={() => router.push("/account")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                  >
                    Add New Address
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8">
                {showPaymentFlow ? (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Payment Details
                      </h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-xl mb-6">
                      <p className="text-gray-600 flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-green-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                        All transactions are secure and encrypted
                      </p>
                    </div>
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "black",
                        shape: "rect",
                        label: "pay",
                        height: 40,
                      }}
                      createOrder={async () => {
                        if (
                          !selectedAddress ||
                          cartItemsWithDetails.length === 0
                        ) {
                          toast({
                            title:
                              "Please select an address and ensure cart is not empty",
                            variant: "destructive",
                          });
                          throw new Error("Invalid order data");
                        }

                        const orderId = await createPayPalOrder(
                          cartItemsWithDetails,
                          total
                        );
                        if (orderId === null) {
                          toast({
                            title: "Failed to create payment order",
                            variant: "destructive",
                          });
                          throw new Error("Failed to create paypal order");
                        }
                        return orderId;
                      }}
                      onApprove={async (data, actions) => {
                        try {
                          if (!user?.id) {
                            toast({
                              title: "User not authenticated",
                              variant: "destructive",
                            });
                            return;
                          }

                          const captureData = await capturePayPalOrder(
                            data.orderID
                          );
                          if (!captureData) {
                            toast({
                              title: "Failed to process payment",
                              variant: "destructive",
                            });
                            return;
                          }
                          const orderData: CreateOrderData = {
                            userId: user.id,
                            addressId: selectedAddress,
                            items: cartItemsWithDetails.map((item) => ({
                              productId: item.productId,
                              productName: item.product.name,
                              productCategory: item.product.category.name, // Just send the category name
                              quantity: item.quantity,
                              size: item.size || "",
                              color: item.color || "",
                              price: item.product.price,
                            })),
                            couponId: appliedCoupon?.id,
                            total: total,
                            paymentMethod: "CREDIT_CARD",
                            paymentStatus: "COMPLETED",
                            paymentId: captureData.id,
                          };

                          const finalOrder = await createFinalOrder(orderData);
                          if (finalOrder) {
                            await clearCart();
                            router.push("/account");
                          } else {
                            toast({
                              title: "Failed to create final order",
                              variant: "destructive",
                            });
                          }
                        } catch (error) {
                          console.error("Payment processing error:", error);
                          toast({
                            title: "Payment processing failed",
                            variant: "destructive",
                          });
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-semibold">
                        Contact Information
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="h-12 text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                        value={checkoutEmail}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => setCheckoutEmail(event.target.value)}
                      />
                      <Button
                        onClick={handlePrePaymentFlow}
                        className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 transition-all duration-300"
                      >
                        Continue to Payment
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 sticky top-8">
              <CardContent className="p-8">
                <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {cartItemsWithDetails.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 group hover:bg-gray-100 transition-all duration-300"
                    >
                      <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                        <img
                          src={
                            item?.product?.images?.[0] ||
                            "/placeholder-image.jpg"
                          }
                          alt={item?.product?.name || "Product Image"}
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                        <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                          x{item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">
                          {item?.product?.name || "Product Name"}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.color || "N/A"} / {item.size || "N/A"}
                        </p>
                        <p className="font-medium text-purple-600">
                          $
                          {(
                            (item?.product?.price || 0) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="Enter a Discount code"
                      onChange={(e) => setCouponCode(e.target.value)}
                      value={couponCode}
                      className="h-12 pr-24 border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500 rounded-xl"
                    />
                    <Button
                      onClick={handleApplyCoupon}
                      className="absolute right-1 top-1 bottom-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                    >
                      Apply
                    </Button>
                  </div>
                  {couponAppliedError && (
                    <p className="text-sm text-red-600">{couponAppliedError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="bg-green-50 p-3 rounded-xl">
                      <p className="text-sm text-green-600 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Coupon Applied Successfully!
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 space-y-3 border-t pt-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.discountPercent}%)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-semibold">
                    <span>Total</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutContent;
