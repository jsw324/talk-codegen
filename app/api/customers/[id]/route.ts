import { NextRequest, NextResponse } from "next/server";
import {
  customerService,
  CustomerNotFoundError,
  EmailExistsError,
} from "@/lib/services/customer-service";
import { updateCustomerSchema } from "@/lib/types/customer";
import { ZodError } from "zod";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;

  try {
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 },
      );
    }

    const customer = await customerService.getCustomerById(id);

    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: customer });
  } catch (error) {
    console.error(`GET /api/customers/${idParam} error:`, error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;

  try {
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = updateCustomerSchema.parse(body);

    const customer = await customerService.updateCustomer(id, validatedData);

    return NextResponse.json({
      data: customer,
      message: "Customer updated successfully",
    });
  } catch (error) {
    console.error(`PUT /api/customers/${idParam} error:`, error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof CustomerNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (error instanceof EmailExistsError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id: idParam } = await params;

  try {
    const id = parseInt(idParam);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid customer ID" },
        { status: 400 },
      );
    }

    await customerService.deleteCustomer(id);

    return NextResponse.json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(`DELETE /api/customers/${idParam} error:`, error);

    if (error instanceof CustomerNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
