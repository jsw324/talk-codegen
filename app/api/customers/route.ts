import { NextRequest, NextResponse } from 'next/server';
import { customerService, EmailExistsError } from '@/lib/services/customer-service';
import { createCustomerSchema, customerFiltersSchema } from '@/lib/types/customer';
import { ZodError } from 'zod';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());

    // Parse and validate query parameters
    const filters = customerFiltersSchema.parse(params);

    const result = await customerService.getAllCustomers(filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/customers error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createCustomerSchema.parse(body);

    const customer = await customerService.createCustomer(validatedData);

    return NextResponse.json({
      data: customer,
      message: 'Customer created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/customers error:', error);

    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof EmailExistsError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
