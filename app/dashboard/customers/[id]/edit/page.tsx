"use client";

import { useState, useEffect, use } from "react";
import { Customer } from "@/lib/db/schema";
import { CustomerResponse } from "@/lib/types/customer";
import { CustomerForm } from "@/components/customers/customer-form";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

interface EditCustomerPageProps {
  params: Promise<{ id: string }>;
}

export default function EditCustomerPage({ params }: EditCustomerPageProps) {
  const resolvedParams = use(params);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/customers/${resolvedParams.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Customer not found");
          }
          throw new Error("Failed to fetch customer");
        }

        const data: CustomerResponse = await response.json();
        setCustomer(data.data);
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load customer",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Loading...</span>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href="/dashboard/customers"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Customers
        </Link>
        <div className="flex items-center justify-center p-8 text-red-600">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return <CustomerForm customer={customer} isEditing={true} />;
}
