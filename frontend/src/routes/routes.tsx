import { Routes } from "../interface/route";
import SmartContract from "../pages/SmartContract";
import Home from "../pages/Home";
import Transaction from "../pages/Transaction";

export const routers: Routes[] = [
  {
    href: "/",
    id: "home",
    name: "Home",
    element: <Home />,
  },
  {
    href: "/transaction",
    id: "transaction",
    name: "Transaction",
    element: <Transaction />,
  },
  {
    href: "/smart-contract",
    id: "smart-contract",
    name: "Smart Contract",
    element: <SmartContract />,
  },
];
