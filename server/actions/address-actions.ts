import { db } from "@/drizzle/db";
import { addresses } from "@/drizzle/schema";
import axios from "axios";
import { eq, and, ne, ilike } from "drizzle-orm";
import { string } from "zod";

// Find suggested addresses; return an array or null if none found
export async function findSuggestedAddress(encoded_address: string) {
  try {
    const geocode_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      encoded_address
    )}&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`;

    const response = await axios.get(geocode_url);
    const suggestions = response.data.results;

    if (!suggestions || suggestions.length === 0) return null;

    const formattedSuggestions = suggestions.map((item: any) => {
      let address_line_1 = "";
      let address_line_2 = "";
      let city = "";
      let state = "";
      let zip = "";
      let country = "";
      let longitude = "";
      let latitude = "";

      item.address_components.forEach((component: any) => {
        if (component.types.includes("street_number")) {
          address_line_1 = component.long_name;
        }
        if (component.types.includes("route")) {
          address_line_1 += ` ${component.long_name}`;
        }
        if (component.types.includes("subpremise")) {
          address_line_2 = component.long_name;
        }
        if (
          component.types.includes("neighborhood") ||
          component.types.includes("sublocality")
        ) {
          address_line_2 = component.long_name;
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

      if (item.geometry && item.geometry.location) {
        latitude = item.geometry.location.lat;
        longitude = item.geometry.location.lng;
      }

      return {
        address_line_1: address_line_1.trim(),
        address_line_2: address_line_2.trim(),
        city,
        state,
        zip,
        country,
        latitude,
        longitude,
      };
    });

    return formattedSuggestions;
  } catch (error) {
    console.error("Error fetching suggested addresses:", error);
    throw new Error("Error searching for matching addresses.");
  }
}

// Address type
export type SuggestedAddress = {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
};

// Create address
export async function createAddress(
  user_uuid: string,
  title: string,
  address_line_1: string,
  address_line_2: string | undefined,
  city: string,
  state: string,
  country: string,
  zip_code: string,
  location: [number, number]
) {
  try {
    await db.insert(addresses).values({
      user_uuid,
      title,
      address_line_1,
      address_line_2,
      city,
      state,
      country,
      zip_code,
      location: { x: location[0], y: location[1] },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create address.");
  }
}

// Update address
export async function updateAddress(
  id: number,
  title: string,
  address_line_1: string,
  address_line_2: string | undefined,
  city: string,
  state: string,
  country: string,
  zip_code: string,
  location: [number, number]
) {
  try {
    await db
      .update(addresses)
      .set({
        title,
        address_line_1,
        address_line_2,
        city,
        state,
        country,
        zip_code,
        location: { x: location[0], y: location[1] },
      })
      .where(eq(addresses.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update address.");
  }
}

// Get user addresses
export async function getUserAddresses(user_uuid: string) {
  try {
    const result = await db
      .select()
      .from(addresses)
      .where(
        and(eq(addresses.user_uuid, user_uuid), eq(addresses.visible, true))
      );
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get user addresses.");
  }
}
export type Address = Awaited<ReturnType<typeof getUserAddresses>>[number];

// Delete address; soft delete
export async function deleteAddress(id: number) {
  try {
    await db
      .update(addresses)
      .set({
        visible: false,
      })
      .where(eq(addresses.id, id));
  } catch (error) {
    console.log(error);
    throw new Error("Failed to delete address.");
  }
}

// Get address info
export async function getAddressInfo(id: number) {
  try {
    const result = await db
      .select()
      .from(addresses)
      .where(eq(addresses.id, id))
      .limit(1);
    if (result.length > 0) return result[0];
    return null;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to get address info.");
  }
}
