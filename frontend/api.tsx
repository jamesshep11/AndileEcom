export function GET(uri: string, options?: RequestInit): Promise<any> {
  return fetch("/api" + uri, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function PUT(uri: string, options?: RequestInit): Promise<any> {
  return fetch("/api" + uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ?? "{}",
  });
}

export function POST(uri: string, options?: RequestInit): Promise<any> {
  return fetch("/api" + uri, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: options?.body ?? "{}",
  });
}
