use aiken/collection/list
use aiken/crypto
use cardano/assets.{PolicyId}
use types/mint.{MintAction, MintTransaction}

validator mint_token {
  mint(redeemer: MintAction, policy_id: PolicyId, tx: MintTransaction) {
    // Hardcoded public key hash (Blake2b-224 hash of a public key) 
    let is_signed = list.has(tx.extra_signatories, policy_id)
    let name_redeemer = redeemer.name == "USDT"
    let description = redeemer.description == "USDT NFT"
    let token = redeemer.token == 10000
    is_signed && name_redeemer && description && token
  }

  else(_) {
    fail
  }
}

test mint_action() {
  let redeemer =
    MintAction {
      owner: crypto.blake2b_224(
        #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
      ),
      token: 10000,
      name: "USDT",
      description: "USDT NFT",
      image: "123",
    }
  let policy_id: PolicyId =
    crypto.blake2b_224(
      #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
    )
  let tx = MintTransaction { extra_signatories: [policy_id] }
  mint_token.mint(redeemer, policy_id, tx)
}
