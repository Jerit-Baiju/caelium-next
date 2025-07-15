import { Client, Functions } from 'appwrite';
import { NextResponse } from 'next/server';

// Initialize Appwrite client

const client = new Client().setEndpoint(process.env.APPWRITE_ENDPOINT!).setProject(process.env.APPWRITE_PROJECT_ID!);

const functions = new Functions(client);

export async function GET() {
  try {
    const result = await functions.createExecution(process.env.APPWRITE_FUNCTION_ID!);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
