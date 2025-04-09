import { Routes } from "@/interface/route";
import SmartContract from "@/pages/SmartContract";
import Home from "@/pages/Home";
import Transaction from "@/pages/Transaction";
import Vesting from "@/pages/Vesting";
import Mint from "@/pages/Mint";

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
    href: "/mint",
    id: "mint",
    name: "Mint",
    element: <Mint />,
  },
  {
    href: "/smart-contract",
    id: "smart-contract",
    name: "Smart Contract",
    element: <SmartContract />,
  },
  {
    href: "/vesting",
    id: "vesting",
    name: "vesting",
    element: <Vesting />,
  },
];
