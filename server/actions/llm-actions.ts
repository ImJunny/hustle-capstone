import axios from "axios";
export async function getIsDataSafe(text: string) {
  try {
    const formattedText = text.replaceAll(" ", "%20");
    const result = await axios.get(
      `${process.env.FLY_IO_BASE_URL}/getIsDataSafe?input_text=${formattedText}`
    );
    const data = result.data.response;
    return data;
  } catch (error) {
    console.error("Error getting post safety:", error);
    return true;
  }
}
