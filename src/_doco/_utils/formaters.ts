export const trimValue = (value: string) => {
  return value
    .replace(/^"|"$/g, "")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};
export const parseFromHeader = (headerValue: string) => {
  // Remove outer quotes and trim
  const cleanValue = trimValue(headerValue);

  // Check if value contains email format
  console.log({ headerValue, cleanValue });
  if (!cleanValue.includes("<") || !cleanValue.includes(">")) {
    if (cleanValue.includes("@"))
      return {
        data: { fromName: "", fromEmail: cleanValue ?? "" },
        isValid: true,
      };
    console.error("Invalid From header format", { cleanValue });
    // return;
    // throw new Error("Invalid From header format");
  }
  // Extract name and email
  const [namePart, emailPart] = cleanValue.split("<");
  const name = namePart.trim();
  const email = emailPart.replace(">", "").trim();

  // Validate email format
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new Error(`Invalid email format: ${email}`);
  }

  return {
    data: { fromName: name ?? "", fromEmail: email ?? "" },
    isValid: true,
  };
};
