use aiken/collection/list
use aiken/crypto.{Blake2b_256, Hash}
use cardano/assets.{PolicyId} as value
use cardano/transaction.{NoDatum, Transaction}
use types/mint.{
  Address, Input, MintAction, MintTransaction, Output, OutputReference,
  TransactionContext,
}

// validator mint_token {
//   mint(redeemer: MintAction, policy_id: PolicyId, tx: MintTransaction) {
//     let is_signed = list.has(tx.extra_signatories, policy_id)
//     let name_redeemer = redeemer.name == "USDT"
//     let description = redeemer.description == "USDT NFT"
//     let token = redeemer.token == 10000
//     is_signed && name_redeemer && description && token
//   }

//   else(_) {
//     fail
//   }
// }

validator usdt_token {
  mint(
    _redeemer: Data,
    tx_id: Hash<Blake2b_256, Transaction>,
    tx: TransactionContext,
  ) {
    let utxo_ref = OutputReference { transaction_id: tx_id, output_index: 0 }
    let input =
      Input(
        utxo_ref,
        Output {
          address: Address {
            payment_credential: #"abcd",
            stake_credential: None,
          },
          value: value.from_lovelace(1),
          datum: NoDatum,
          reference_script: None,
        },
      )
    when tx is {
      TransactionContext(_) -> list.has(inputs(utxo_ref), input)
    }
  }

  else(_) {
    fail
  }
}

pub fn inputs(utxo_ref: OutputReference) -> List<Input> {
  [
    Input(
      utxo_ref,
      Output {
        address: Address { payment_credential: #"abcd", stake_credential: None },
        value: value.from_lovelace(1),
        datum: NoDatum,
        reference_script: None,
      },
    ),
  ]
}

test can_mint() {
  let own_policy_id = #"ab"
  let utxo_ref =
    OutputReference {
      transaction_id: #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
      output_index: 0,
    }
  let tx = TransactionContext(#"231231")
  usdt_token.mint(own_policy_id, utxo_ref.transaction_id, tx)
}
// test mint_action() {
//   let redeemer =
//     MintAction {
//       owner: crypto.blake2b_224(
//         #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
//       ),
//       token: 10000,
//       name: "USDT",
//       description: "USDT NFT",
//       image: "123",
//     }
//   let policy_id: PolicyId =
//     crypto.blake2b_224(
//       #"6213d54eac79892450e0125a0ced7a86711f0522b8b44e62f9e2b3ea",
//     )
//   let tx = MintTransaction { extra_signatories: [policy_id] }
//   mint_token.mint(redeemer, policy_id, tx)
// }
