/* eslint-disable @typescript-eslint/no-unsafe-return */
import axios from "axios";

const baseUrl = "http://localhost:8080/api/v1";

export async function getTransactions() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { content } = await (await axios.get(`${baseUrl}/transaction`)).data;
    console.log(JSON.stringify(content));

    return content;
  } catch (error) {
    console.error(error);
  }
}
