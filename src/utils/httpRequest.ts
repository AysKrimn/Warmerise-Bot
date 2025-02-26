const httpRequest = async (
  url: string,
  asText: boolean = false,
  options?: RequestInit
) => {
  const request = await fetch(url, options);

  if (!request.ok) {
    return { status: false, message: "Failed to fetch data from service" };
  }

  const data = asText ? await request.text() : await request.json();
  return { status: true, data };
};

export default httpRequest;
