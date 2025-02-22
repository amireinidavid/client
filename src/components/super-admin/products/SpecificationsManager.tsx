"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationsManagerProps {
  specifications: Specification[];
  setSpecifications: (specs: Specification[]) => void;
}

export function SpecificationsManager({
  specifications,
  setSpecifications,
}: SpecificationsManagerProps) {
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (
    index: number,
    field: keyof Specification,
    value: string
  ) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index][field] = value;
    setSpecifications(updatedSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Specifications</h3>
          <p className="text-sm text-muted-foreground">
            Add product specifications
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addSpecification}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Specification
        </Button>
      </div>

      {specifications.map((spec, index) => (
        <div key={index} className="grid grid-cols-[1fr,1fr,auto] gap-4">
          <div>
            <Input
              placeholder="Key"
              value={spec.key}
              onChange={(e) =>
                updateSpecification(index, "key", e.target.value)
              }
            />
          </div>
          <div>
            <Input
              placeholder="Value"
              value={spec.value}
              onChange={(e) =>
                updateSpecification(index, "value", e.target.value)
              }
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => removeSpecification(index)}
          >
            <Trash className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
