import React from "react";
import { Address, useAddressStore } from "@/store/useAddressStore";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
}

const AddressCard = ({ address, onEdit }: AddressCardProps) => {
  const { deleteAddress } = useAddressStore();

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold">{address.name}</h3>
        {address.isDefault && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
            Default
          </span>
        )}
      </div>
      <div className="text-gray-600 text-sm space-y-1">
        <p>{address.address}</p>
        <p>{`${address.city}, ${address.country} ${address.postalCode}`}</p>
        <p>{address.phone}</p>
      </div>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onEdit(address)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => deleteAddress(address.id)}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
