use std::collections::HashMap;

use near_sdk::env;

use crate::*;

#[near_bindgen]
impl Contract {
    /**
     * - Require users to top up to cover hosting fees
     * - Add token to token_by_id
     * - Add token metadata
     * - Add token to ds owned by owner
     * - Refund the excess NEAR user deposit
     */
    #[payable]
    pub fn nft_mint(&mut self, title: String, description: String, media: String, receiver_id: AccountId) {
        let deposit = env::attached_deposit();
        assert!(deposit >= 1 , "Attached deposit must = 1 to mint NFT Tree" );

        let before_storage_usage = env::storage_usage();


        let token = Token {
            owner_id: receiver_id,
            approved_account_ids: HashMap::default(),
            next_approval_id: 0,
        };

        let token_id = u128::from(self.nft_total_supply()) + 1;
         
        assert!(
            self.tokens_by_id.insert(&U128(token_id), &token).is_none(),
            "Token already exsits"
        );

       

        let metadata = TokenMetadata {
            title: Some(title), 
            description: Some(description), 
            media: Some(media), 
            media_hash: None, 
            copies: None, 
            issued_at: None, 
            expires_at: None, 
            starts_at: None, 
            updated_at: None, 
            extra: None, 
            reference: None, 
            reference_hash: None,
            price: Some(deposit),
        };

        self.token_metadata_by_id.insert(&U128(token_id), &metadata);

        // set token per owner
        self.internal_add_token_to_owner(&U128(token_id), &token.owner_id);

        // NFT MINT LOG
        let nft_mint_log: EventLog = EventLog {
            standard: "nep171".to_string(),
            version: "1.0.0".to_string(),
            event: EventLogVariant::NftMint(vec![ NftMintLog {
                owner_id: token.owner_id.to_string(),
                token_ids: vec![token_id.to_string()],
                memo: None
            } ])
        };
        env::log(&nft_mint_log.to_string().as_bytes());

        let after_storage_usage = env::storage_usage();
        // Refund near
        refund_deposit(after_storage_usage - before_storage_usage);
    }

    pub fn nft_token(&self, token_id: U128) -> Option<JsonToken> {
        let token = self.tokens_by_id.get(&token_id);

        if let Some(token) = token {
            let metadata = self.token_metadata_by_id.get(&token_id).unwrap();

            Some(JsonToken {
                owner_id: token.owner_id,
                token_id,
                metadata,
                approved_account_ids: token.approved_account_ids,
                
            })
        } else {
            None
        }
    }
}