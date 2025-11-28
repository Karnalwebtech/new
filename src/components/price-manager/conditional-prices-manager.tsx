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
import { formatCurrency } from "@/services/currency";
import { toast } from "sonner";

interface ConditionalPrice {
  id: string;
  shippingPrice: number;
  minCartTotal: number;
  maxCartTotal: number | null;
}

export default function ConditionalPricesManager() {
  const [prices, setPrices] = useState<ConditionalPrice[]>([
    {
      id: "1",
      shippingPrice: 100.0,
      minCartTotal: 50.0,
      maxCartTotal: 400.0,
    },
    {
      id: "2",
      shippingPrice: 0.0,
      minCartTotal: 1000.0,
      maxCartTotal: null,
    },
  ]);
  console.log(prices);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedPrice, setEditedPrice] = useState<ConditionalPrice | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPrice, setNewPrice] = useState({
    shippingPrice: 0,
    minCartTotal: 0,
    maxCartTotal: null as number | null,
  });

  const handleEdit = useCallback((price: ConditionalPrice) => {
    setEditingId(price.id);
    setEditedPrice({ ...price });
  }, []);

  const handleSave = useCallback(() => {
    if (editedPrice) {
      setPrices((prev) =>
        prev.map((p) => (p.id === editingId ? editedPrice : p))
      );
      setEditingId(null);
      setEditedPrice(null);
    }
  }, [editedPrice, editingId]);

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

  const handleDelete = useCallback((id: string) => {
    setPrices((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleAddNew = useCallback(() => {
    if (newPrice.shippingPrice === undefined || newPrice.shippingPrice < 0) {
      return toast.error("Shipping price must be a positive number");
    }

    if (newPrice.minCartTotal === undefined || newPrice.minCartTotal < 0) {
      return toast.error("Minimum cart total must be a positive number");
    }

    // Validate min/max relationship
    if (newPrice.maxCartTotal !== null && newPrice.maxCartTotal !== undefined) {
      if (newPrice.minCartTotal >= newPrice.maxCartTotal) {
        return toast.error(
          "Maximum cart value should be greater than minimum cart value"
        );
      }
    }
    if (newPrice.shippingPrice >= 0 && newPrice.minCartTotal >= 0) {
      const newConditionalPrice: ConditionalPrice = {
        id: Date.now().toString(),
        shippingPrice: newPrice.shippingPrice,
        minCartTotal: newPrice.minCartTotal,
        maxCartTotal: newPrice.maxCartTotal,
      };
      setPrices((prev) => [...prev, newConditionalPrice]);
      setNewPrice({
        shippingPrice: 0,
        minCartTotal: 0,
        maxCartTotal: null,
      });
      setIsAddingNew(false);
    }
  }, [newPrice]);

  const getPriceDescription = (price: ConditionalPrice) => {
    if (price.maxCartTotal) {
      return `if Cart item total is between ${formatCurrency(
        price.minCartTotal
      )} and ${formatCurrency(price.maxCartTotal)}`;
    } else {
      return `if Cart item total is above ${formatCurrency(
        price.minCartTotal
      )}`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Conditional Prices for Price AED
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
                {prices.map((price) => (
                  <React.Fragment key={price.id}>
                    {editingId === price.id ? (
                      <tr className="border-b bg-blue-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">AED</span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editedPrice?.shippingPrice || 0}
                              onChange={(e) =>
                                setEditedPrice((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        shippingPrice:
                                          parseFloat(e.target.value) || 0,
                                      }
                                    : null
                                )
                              }
                              className="w-32"
                            />
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Min:</span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">AED</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editedPrice?.minCartTotal || 0}
                                  onChange={(e) =>
                                    setEditedPrice((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            minCartTotal:
                                              parseFloat(e.target.value) || 0,
                                          }
                                        : null
                                    )
                                  }
                                  className="w-32"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Max:</span>
                              <div className="flex items-center gap-1">
                                <span className="text-sm">AED</span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editedPrice?.maxCartTotal || ""}
                                  onChange={(e) =>
                                    setEditedPrice((prev) =>
                                      prev
                                        ? {
                                            ...prev,
                                            maxCartTotal: e.target.value
                                              ? parseFloat(e.target.value)
                                              : null,
                                          }
                                        : null
                                    )
                                  }
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
                              onClick={handleSave}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Save size={16} />
                              Save
                            </Button>
                            <Button
                              onClick={handleCancel}
                              variant="outline"
                              size="sm"
                            >
                              <X size={16} />
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr className="border-b hover:bg-gray-50">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-blue-600">
                              {formatCurrency(price.shippingPrice)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <p className="text-gray-700">
                              {getPriceDescription(price)}
                            </p>
                            <div className="text-sm text-gray-500 space-y-1">
                              <div className="flex items-center gap-2">
                                <span>Shipping option price:</span>
                                <span className="font-medium">
                                  AED {price.shippingPrice.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span>Minimum cart item total:</span>
                                <span className="font-medium">
                                  AED {price.minCartTotal.toFixed(2)}
                                </span>
                              </div>
                              {price.maxCartTotal && (
                                <div className="flex items-center gap-2">
                                  <span>Maximum cart item total:</span>
                                  <span className="font-medium">
                                    AED {price.maxCartTotal.toFixed(2)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => handleEdit(price)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit3 size={16} />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(price.id)}
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
                    )}
                  </React.Fragment>
                ))}

                {prices.length === 0 && (
                  <tr>
                    <td colSpan={3} className="p-8 text-center text-gray-500">
                      No conditional prices configured
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
              <Card className="bg-gray-50 border-dashed border-2">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Add New Conditional Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Price (AED)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPrice.shippingPrice}
                        onChange={(e) =>
                          setNewPrice((prev) => ({
                            ...prev,
                            shippingPrice: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Cart Total (AED)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPrice.minCartTotal}
                        onChange={(e) =>
                          setNewPrice((prev) => ({
                            ...prev,
                            minCartTotal: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Maximum Cart Total (AED)
                      </label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newPrice.maxCartTotal || ""}
                        onChange={(e) =>
                          setNewPrice((prev) => ({
                            ...prev,
                            maxCartTotal: e.target.value
                              ? parseFloat(e.target.value)
                              : null,
                          }))
                        }
                        placeholder="No limit"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleAddNew}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save size={16} className="mr-2" />
                      Add Price
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X size={16} className="mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-blue-600 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">
                How Conditional Prices Work
              </h3>
              <p className="text-blue-800 text-sm">
                Conditional prices allow you to set different shipping costs
                based on the cart total. The system will apply the first
                matching condition from top to bottom. Leave maximum cart total
                empty for &ldquo;and above&ldquo; conditions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
