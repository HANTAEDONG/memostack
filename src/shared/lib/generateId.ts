import { v4 as uuidv4 } from "uuid";

const generateId = (): string => {
  return uuidv4();
};

export default generateId;
