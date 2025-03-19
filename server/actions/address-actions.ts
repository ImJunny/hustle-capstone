import axios from "axios";

// Find suggested address; return null if none found
export async function findSuggestedAddress(encoded_address: string) {
  try {
    const geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      encoded_address
    )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(geocode_url);
    const suggestion = response.data.results[0];

    if (!suggestion) return null;

    let address_line_1 = "";
    let address_line_2 = "";
    let city = "";
    let state = "";
    let zip = "";
    let country = "";

    suggestion.address_components.forEach((component: any) => {
      if (component.types.includes("street_number")) {
        address_line_1 = component.long_name;
      }
      if (component.types.includes("route")) {
        address_line_1 += ` ${component.long_name}`;
      }
      if (component.types.includes("locality")) {
        city = component.long_name;
      }
      if (component.types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }
      if (component.types.includes("postal_code")) {
        zip = component.long_name;
      }
      if (component.types.includes("country")) {
        country = component.long_name;
      }
    });

    const address_parts = address_line_1.split(", ");
    address_line_1 = address_parts[0];
    address_line_2 = address_parts[1] ? address_parts.slice(1).join(", ") : "";

    return {
      address_line_1,
      address_line_2,
      city,
      state,
      zip,
      country,
    };
  } catch (error) {
    console.log(error);
    throw new Error("Error searching for matching addresses.");
  }
}
