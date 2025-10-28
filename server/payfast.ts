import crypto from "crypto";

export interface PayFastPaymentData {
  merchant_id: string;
  merchant_key: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  amount: string;
  item_name: string;
  email_address?: string;
  m_payment_id?: string;
  [key: string]: string | undefined;
}

/**
 * Generate PayFast signature for payment data
 * https://developers.payfast.co.za/docs#signature_generation
 */
export function generatePayFastSignature(
  data: PayFastPaymentData,
  passphrase?: string
): string {
  // Create parameter string
  let paramString = "";
  
  // Sort parameters alphabetically
  const sortedKeys = Object.keys(data).sort();
  
  for (const key of sortedKeys) {
    const value = data[key];
    if (value !== undefined && value !== "") {
      paramString += `${key}=${encodeURIComponent(value).replace(/%20/g, "+")}&`;
    }
  }

  // Remove last ampersand
  paramString = paramString.slice(0, -1);

  // Add passphrase if provided
  if (passphrase) {
    paramString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`;
  }

  // Generate MD5 hash
  return crypto.createHash("md5").update(paramString).digest("hex");
}

/**
 * Verify PayFast ITN signature
 */
export function verifyPayFastSignature(
  data: Record<string, string>,
  passphrase?: string
): boolean {
  const signature = data.signature;
  
  if (!signature) {
    return false;
  }

  // Remove signature from data
  const dataWithoutSignature = { ...data };
  delete dataWithoutSignature.signature;

  // Generate signature
  const generatedSignature = generatePayFastSignature(
    dataWithoutSignature as PayFastPaymentData,
    passphrase
  );

  return signature === generatedSignature;
}

/**
 * Get PayFast config from environment
 */
export function getPayFastConfig() {
  const merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100"; // Sandbox default
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a"; // Sandbox default
  const passphrase = process.env.PAYFAST_PASSPHRASE || "";
  const mode = process.env.NODE_ENV === "production" ? "production" : "sandbox";
  
  const baseUrl = mode === "production" 
    ? "https://www.payfast.co.za/eng/process"
    : "https://sandbox.payfast.co.za/eng/process";

  return {
    merchantId,
    merchantKey,
    passphrase,
    mode,
    baseUrl,
  };
}
