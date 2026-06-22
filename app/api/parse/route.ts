import { NextResponse } from "next/server";
import { precheckPdf, parsePdf, ParseError } from "@/lib/parse/formats/pdf";

const PAGE_LIMIT = 20;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_FILE", message: "No file was provided." } },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();

    // Validate and check page count from raw bytes before touching pdf.js
    const precheck = precheckPdf(arrayBuffer, PAGE_LIMIT);
    if (!precheck.valid) {
      return NextResponse.json(
        { success: false, error: precheck.error },
        { status: 422 }
      );
    }

    const document = await parsePdf(arrayBuffer);

    return NextResponse.json({ success: true, document });
  } catch (error) {
    if (error instanceof ParseError) {
      return NextResponse.json(
        { success: false, error: { code: error.code, message: error.message } },
        { status: 422 }
      );
    }

    console.error("Parse API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "PARSE_FAILED", message: "An unexpected error occurred while parsing the document." },
      },
      { status: 500 }
    );
  }
}