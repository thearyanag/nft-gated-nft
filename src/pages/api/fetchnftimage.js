import axios from "axios";
import { getProject } from "@/functions/graphql";

export default async (req, res) => {
  let image = await getProject();

  return res.status(200).json({ imageURL: image });
};
