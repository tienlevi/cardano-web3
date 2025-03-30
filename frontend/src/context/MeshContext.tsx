import { CardanoWallet, MeshProvider } from "@meshsdk/react";
import { ReactNode } from "react";
import { provider } from "../utils/provider";

function MeshContext({ children }: { children: ReactNode }) {
  return (
    <MeshProvider>
      <div className="hidden">
        <CardanoWallet
          label="Connect Wallet"
          persist={true}
          burnerWallet={{ networkId: 1, provider: provider }}
        />
      </div>
      {children}
    </MeshProvider>
  );
}

export default MeshContext;
