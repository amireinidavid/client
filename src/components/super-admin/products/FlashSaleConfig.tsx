"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FlashSaleProduct {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    productImages: {
      url: string;
      mediumUrl: string;
    }[];
    // ... other product fields
  };
  discountPrice: number;
  discountPercentage: number;
  originalPrice: number;
  stock: number;
  soldCount: number;
  order: number;
}

interface FlashSale {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  discountPercentage: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  products: FlashSaleProduct[];
}

interface FlashSaleConfigProps {
  flashSale: FlashSale;
  setFlashSale: (sale: FlashSale) => void;
}

export function FlashSaleConfig({
  flashSale,
  setFlashSale,
}: FlashSaleConfigProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFlashSale({
      ...flashSale,
      [e.target.name]: e.target.value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFlashSale({
      ...flashSale,
      isActive: checked,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Flash Sale</h3>
          <p className="text-sm text-muted-foreground">
            Configure flash sale settings
          </p>
        </div>
        <Switch
          checked={flashSale.isActive}
          onCheckedChange={handleSwitchChange}
        />
      </div>

      {flashSale.isActive && (
        <div className="space-y-4">
          <div>
            <Label>Discount Percentage</Label>
            <Input
              name="discountPercentage"
              type="number"
              value={flashSale.discountPercentage}
              onChange={handleInputChange}
              placeholder="Enter discount percentage"
              min="0"
              max="100"
              className="mt-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Input
                name="startTime"
                type="datetime-local"
                value={flashSale.startTime}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                name="endTime"
                type="datetime-local"
                value={flashSale.endTime}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
