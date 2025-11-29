"use client";

import React, { useState, useCallback } from "react";
import { Plus, Trash2, Edit3, Save, X, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency, getCurrencySymbol } from "@/services/currency";
import { toast } from "sonner";
import { useConditionalPrices } from "@/hooks/useConditionalPrices";

export interface ConditionalPrice {
  id: string;
  shippingPrice: number;
  minCartTotal: number;
  maxCartTotal: number | null;
  currencyKey: string;
}

interface ConditionalPricesManagerProps {
  currencyKey: string;
  name: string;
}

interface NewPriceState {
  shippingPrice: number;
  minCartTotal: number;
  maxCartTotal: number | null;
}

type SetEditedPriceType = React.Dispatch<
  React.SetStateAction<ConditionalPrice | null>
>;

export default function ConditionalPricesManager({
  currencyKey = "AFN",
  name = "India",
}: ConditionalPricesManagerProps) {
  const { prices, addPrice, updatePrice, removePrice, getPricesByCurrency } =
    useConditionalPrices();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<ConditionalPrice | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPrice, setNewPrice] = useState<NewPriceState>({
    shippingPrice: 0,
    minCartTotal: 0,
    maxCartTotal: null,
  });

  const filteredPrices = getPricesByCurrency(currencyKey);

  const handleEdit = useCallback((price: ConditionalPrice) => {
    setEditingId(price.id);
    setEditedPrice({ ...price });
  }, []);

  const handleSave = useCallback(() => {
    if (editedPrice) {
      updatePrice(editedPrice.id, {
        shippingPrice: editedPrice.shippingPrice,
        minCartTotal: editedPrice.minCartTotal,
        maxCartTotal: editedPrice.maxCartTotal,
        currencyKey: editedPrice.currencyKey,
      });
      setEditingId(null);
      setEditedPrice(null);
      toast.success("Price updated successfully");
    }
  }, [editedPrice, updatePrice]);

  const handleCancel = useCallback(() => {
    setEditingId(null);
    setEditedPrice(null);
    setIsAddingNew(false);
    setNewPrice({
      shippingPrice: 0,
      minCartTotal: 0,
      maxCartTotal: null,
    });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      removePrice(id);
      toast.success("Price deleted successfully");
    },
    [removePrice]
  );

  const handleAddNew = useCallback(() => {
    if (newPrice.shippingPrice < 0) {
      return toast.error("Shipping price must be a positive number");
    }

    if (newPrice.minCartTotal < 0) {
      return toast.error("Minimum cart total must be a positive number");
    }

    if (
      newPrice.maxCartTotal !== null &&
      newPrice.minCartTotal >= newPrice.maxCartTotal
    ) {
      return toast.error(
        "Maximum cart value should be greater than minimum cart value"
      );
    }

    // Check for duplicate price ranges
    const isDuplicate = prices.some((price) => {
      // Same currency
      if (price.currencyKey !== currencyKey) return false;

      // Same shipping price
      if (price.shippingPrice === newPrice.shippingPrice) return true;
      if (price.shippingPrice !== newPrice.shippingPrice) return false;

      // Same min cart total
      if (price.minCartTotal !== newPrice.minCartTotal) return false;

      // Same max cart total (both null or same value)
      if (price.maxCartTotal !== newPrice.maxCartTotal) return false;

      return true;
    });

    if (isDuplicate) {
      return toast.error(
        "A conditional price with these values already exists"
      );
    }

    // Check for overlapping price ranges
    const hasOverlap = prices.some((price) => {
      if (price.currencyKey !== currencyKey) return false;

      // const existingMin = price.minCartTotal;
      // const existingMax = price.maxCartTotal;
      // const newMin = newPrice.minCartTotal;
      // const newMax = newPrice.maxCartTotal;

      // Case 1: New range starts within existing range
      // if (newMin >= existingMin &&
      //     (existingMax === null || newMin <= existingMax)) {
      //   return true;
      // }

      // Case 2: New range ends within existing range
      // if (newMax !== null &&
      //     newMax >= existingMin &&
      //     (existingMax === null || newMax <= existingMax)) {
      //   return true;
      // }

      // Case 3: New range completely contains existing range
      // if (newMin <= existingMin &&
      //     (newMax === null || newMax >= (existingMax || Infinity))) {
      //   return true;
      // }

      return false;
    });

    if (hasOverlap) {
      return toast.error(
        "This price range overlaps with an existing conditional price"
      );
    }

    const newConditionalPrice: ConditionalPrice = {
      id: `price_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      shippingPrice: newPrice.shippingPrice,
      minCartTotal: newPrice.minCartTotal,
      maxCartTotal: newPrice.maxCartTotal,
      currencyKey,
    };

    addPrice(newConditionalPrice);
    setNewPrice({
      shippingPrice: 0,
      minCartTotal: 0,
      maxCartTotal: null,
    });
    setIsAddingNew(false);
    toast.success("Conditional price added successfully");
  }, [newPrice, currencyKey, addPrice, prices]);
  const getPriceDescription = useCallback(
    (price: ConditionalPrice) => {
      if (price.maxCartTotal) {
        return `if Cart item total is between ${formatCurrency(
          price.minCartTotal,
          currencyKey
        )} and ${formatCurrency(price.maxCartTotal, currencyKey)}`;
      } else {
        return `if Cart item total is above ${formatCurrency(
          price.minCartTotal,
          currencyKey
        )}`;
      }
    },
    [currencyKey]
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Conditional Prices for {name} ({currencyKey})
        </h1>
        <p className="text-gray-600">
          Manage the conditional prices for this shipping option based on the
          cart item total.
        </p>
      </div>

      {/* Current Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Current Conditional Prices</CardTitle>
          <CardDescription>
            Prices will be applied in order from top to bottom
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Shipping Price
                  </th>
                  <th className="text-left p-4 font-semibold text-gray-900">
                    Condition
                  </th>
                  <th className="text-right p-4 font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPrices.map((price) => (
                  <React.Fragment key={price.id}>
                    {editingId === price.id ? (
                      <EditPriceRow
                        currencyKey={currencyKey}
                        editedPrice={editedPrice}
                        setEditedPrice={setEditedPrice}
                        onSave={handleSave}
                        onCancel={handleCancel}
                      />
                    ) : (
                      <PriceRow
                        price={price}
                        currencyKey={currencyKey}
                        getPriceDescription={getPriceDescription}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    )}
                  </React.Fragment>
                ))}

                {filteredPrices.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No conditional prices configured for {currencyKey}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add New Price Section */}
          <div className="mt-6">
            {!isAddingNew ? (
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus size={16} className="mr-2" />
                Add Conditional Price
              </Button>
            ) : (
              <AddPriceForm
                currencyKey={currencyKey}
                newPrice={newPrice}
                setNewPrice={setNewPrice}
                onAdd={handleAddNew}
                onCancel={handleCancel}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <InformationCard />
    </div>
  );
}

// Extracted Components for better readability

interface EditPriceRowProps {
  currencyKey: string;
  editedPrice: ConditionalPrice | null;
  setEditedPrice: SetEditedPriceType;
  onSave: () => void;
  onCancel: () => void;
}

const EditPriceRow: React.FC<EditPriceRowProps> = ({
  currencyKey,
  editedPrice,
  setEditedPrice,
  onSave,
  onCancel,
}) => {
  const handleShippingPriceChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setEditedPrice((prev) =>
      prev ? { ...prev, shippingPrice: numericValue } : null
    );
  };

  const handleMinCartTotalChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setEditedPrice((prev) =>
      prev ? { ...prev, minCartTotal: numericValue } : null
    );
  };

  const handleMaxCartTotalChange = (value: string) => {
    const numericValue = value ? parseFloat(value) : null;
    setEditedPrice((prev) =>
      prev ? { ...prev, maxCartTotal: numericValue } : null
    );
  };

  return (
    <tr className="border-b bg-blue-50">
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{currencyKey}</span>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={editedPrice?.shippingPrice || 0}
            onChange={(e) => handleShippingPriceChange(e.target.value)}
            className="w-32"
          />
        </div>
      </td>
      <td className="p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Min:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">{currencyKey}</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editedPrice?.minCartTotal || 0}
                onChange={(e) => handleMinCartTotalChange(e.target.value)}
                className="w-32"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Max:</span>
            <div className="flex items-center gap-1">
              <span className="text-sm">{currencyKey}</span>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={editedPrice?.maxCartTotal || ""}
                onChange={(e) => handleMaxCartTotalChange(e.target.value)}
                placeholder="No limit"
                className="w-32"
              />
            </div>
          </div>
        </div>
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2">
          <Button
            onClick={onSave}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Save size={16} />
            Save
          </Button>
          <Button onClick={onCancel} variant="outline" size="sm">
            <X size={16} />
            Cancel
          </Button>
        </div>
      </td>
    </tr>
  );
};

interface PriceRowProps {
  price: ConditionalPrice;
  currencyKey: string;
  getPriceDescription: (price: ConditionalPrice) => string;
  onEdit: (price: ConditionalPrice) => void;
  onDelete: (id: string) => void;
}

const PriceRow: React.FC<PriceRowProps> = ({
  price,
  currencyKey,
  getPriceDescription,
  onEdit,
  onDelete,
}) => (
  <tr className="border-b hover:bg-gray-50">
    <td className="p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold text-blue-600">
          {formatCurrency(price.shippingPrice, currencyKey)}
        </span>
      </div>
    </td>
    <td className="p-4">
      <div className="space-y-1">
        <p className="text-gray-700">{getPriceDescription(price)}</p>
        <div className="text-sm text-gray-500 space-y-1">
          <div className="flex items-center gap-2">
            <span>Shipping option price:</span>
            <span className="font-medium">
              {getCurrencySymbol(currencyKey)} {price.shippingPrice.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span>Minimum cart item total:</span>
            <span className="font-medium">
              {getCurrencySymbol(currencyKey)} {price.minCartTotal.toFixed(2)}
            </span>
          </div>
          {price.maxCartTotal && (
            <div className="flex items-center gap-2">
              <span>Maximum cart item total:</span>
              <span className="font-medium">
                {getCurrencySymbol(currencyKey)} {price.maxCartTotal.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </td>
    <td className="p-4 text-right">
      <div className="flex justify-end gap-2">
        <Button onClick={() => onEdit(price)} variant="outline" size="sm">
          <Edit3 size={16} />
          Edit
        </Button>
        <Button
          onClick={() => onDelete(price.id)}
          variant="outline"
          size="sm"
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Delete
        </Button>
      </div>
    </td>
  </tr>
);

interface AddPriceFormProps {
  currencyKey: string;
  newPrice: NewPriceState;
  setNewPrice: React.Dispatch<React.SetStateAction<NewPriceState>>;
  onAdd: () => void;
  onCancel: () => void;
}

const AddPriceForm: React.FC<AddPriceFormProps> = ({
  currencyKey,
  newPrice,
  setNewPrice,
  onAdd,
  onCancel,
}) => {
  const handleShippingPriceChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setNewPrice((prev) => ({
      ...prev,
      shippingPrice: numericValue,
    }));
  };

  const handleMinCartTotalChange = (value: string) => {
    const numericValue = parseFloat(value) || 0;
    setNewPrice((prev) => ({
      ...prev,
      minCartTotal: numericValue,
    }));
  };

  const handleMaxCartTotalChange = (value: string) => {
    const numericValue = value ? parseFloat(value) : null;
    setNewPrice((prev) => ({
      ...prev,
      maxCartTotal: numericValue,
    }));
  };

  return (
    <Card className="bg-gray-50 border-dashed border-2">
      <CardHeader>
        <CardTitle className="text-lg">Add New Conditional Price</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shipping Price ({currencyKey})
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newPrice.shippingPrice}
              onChange={(e) => handleShippingPriceChange(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Cart Total ({currencyKey})
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newPrice.minCartTotal}
              onChange={(e) => handleMinCartTotalChange(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Cart Total ({currencyKey})
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={newPrice.maxCartTotal || ""}
              onChange={(e) => handleMaxCartTotalChange(e.target.value)}
              placeholder="No limit"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button onClick={onAdd} className="bg-green-600 hover:bg-green-700">
            <Save size={16} className="mr-2" />
            Add Price
          </Button>
          <Button onClick={onCancel} variant="outline">
            <X size={16} className="mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const InformationCard: React.FC = () => (
  <Card className="bg-blue-50 border-blue-200">
    <CardContent className="p-4">
      <div className="flex items-start gap-3">
        <Info size={18} className="text-blue-600 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-semibold text-blue-900">
            How Conditional Prices Work
          </h3>
          <p className="text-blue-800 text-sm">
            Conditional prices allow you to set different shipping costs based
            on the cart total. The system will apply the first matching
            condition from top to bottom. Leave maximum cart total empty for
            &ldquo;and above&rdquo; conditions.
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);
