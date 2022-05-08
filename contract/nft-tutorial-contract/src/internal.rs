use std::collections::HashMap;

use crate::*;


#[near_bindgen]
impl Contract {
    pub(crate) fn internal_add_token_to_owner(&mut self, token_id: &TokenId, account_id: &AccountId) {

        // If account_id already has a list of tokens, it will get a list of existing tokens
        // If account_id is not already in tokens_per_owner then create new tokens_Set
        let mut tokens_set = self.tokens_per_owner.get(account_id).unwrap_or_else(|| {
            UnorderedSet::new(StorageKey::TokenPerOwnerInnerKey {
                account_id_hash: hash_account_id(account_id)
            }.try_to_vec().unwrap())
        });

        tokens_set.insert(token_id);

        self.tokens_per_owner.insert(account_id, &tokens_set);
    }
    
}