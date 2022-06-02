import { config } from "dotenv";
import Tokel from "./rpc/tokel";

config();

let instance;

export function createInstance() {
  return new Tokel(`http://${process.env.RPC_USER}:${process.env.RPC_PASS}@localhost:${process.env.RPC_PORT}`);
}

export function getInstance() {
  if (!instance) {
    instance = createInstance();
  }
  return instance;
}
