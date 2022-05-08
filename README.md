
# Step 1: Prepare the development environment 
To be able to start developing on the NEAR blockhain, you need to prepare the environment for development:
- **NodeJs**: You need to install NodeJs version 14 or higher. Please download NodeJs from here: https://nodejs.org/en/
- **Yarn**: Install yarn using below command:
```
npm i -g yarn
```
- **near-sdk-as**: We will write the contract in AssemblyScript language, so we need to install near-sdk-as with the following command:
```
yarn add -D near-sdk-as
```
- **near-cli**: A tool that provides an interface for manipulating the NEAR blockchain. We use it to deploy Smart Contract and call Smart Contract functions
```
npm i -g near-cli
```
- **near-api-js**: 
If you need to program on NodeJs to connect to the NEAR Blockchain, the near-api-js library is essential. Before using on NodeJs you must install this library with command:
```
npm install near-api-js
```

If you know how to program at least 1 of NodeJs, Javascript, RUST and AsemblyScript languages, there will be more advantages.

# Step 2: Create app
* Using Create Near App to creat project:
   https://github.com/near/create-near-app

   Use command in terminal to create project with [Option] : React and rust 

   yarn create near-app --frontend=react --contract=rust week4-tutorial

 
- In contract folder:  I create nft-tutorial-contract folder inside it then move all file to it
  You can see src folder. This is code rust contract.
  Main file contract is lib.rs. I created some extra files to separate the code for transparency
  
    I created some extra files to separate the code for transparency. Then i import them: 
    
        use crate::utils::*;
        pub use crate::metadata::*;
        pub use crate::mint::*;
        pub use crate::enumeration::*;
        pub use crate::event::*;


        mod metadata;
        mod mint;
        mod internal;
        mod utils;
        mod enumeration;
        mod event;

    The main struct is:

        #[near_bindgen]
        #[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
        struct Contract {
            pub owner_id: AccountId,

            pub tokens_per_owner: LookupMap<AccountId, UnorderedSet<TokenId>>, // Save the list of tokens that the user owns

            pub tokens_by_id: LookupMap<TokenId, Token>, //Mapping token id with token extension data
            pub token_metadata_by_id: UnorderedMap<TokenId, TokenMetadata>, // Mapping token id with token metadata

            pub metadata: LazyOption<NFTContractMetadata>  // Metadate
        }

    I created a function that initializes the contract's metadata:

        #[near_bindgen]
        impl Contract {
            #[init]
            pub fn new(owner_id: AccountId, token_metadata: NFTContractMetadata) -> Self {
                Self {
                    owner_id,
                    metadata: LazyOption::new(
                        StorageKey::ContractMetadataKey.try_to_vec().unwrap(),
                        Some(&token_metadata)
                    ),
                    tokens_per_owner: LookupMap::new(StorageKey::TokenPerOwnerKey.try_to_vec().unwrap()),
                    tokens_by_id: LookupMap::new(StorageKey::TokenByIdKey.try_to_vec().unwrap()),
                    token_metadata_by_id: UnorderedMap::new(StorageKey::TokenMetadataByIdKey.try_to_vec().unwrap())
                }
            }

            #[init]
            pub fn new_default_metadata(owner_id: AccountId) -> Self {
                Self::new(
                    owner_id, 
                NFTContractMetadata {
                    spec: "nft-tutorial-1.0.0".to_string(),
                    name: "NFT TUTORIAL".to_string(),
                    symbol: "NFT".to_string(),
                    icon: None,
                    base_uri: None,
                    reference: None,
                    reference_hash: None
                })
            }
        }

    In metadata.rs file: 
        We create the Token structs, for use in the lib.rs . file

        struct JsonToken to send information of NFT Token to frontend

        struct NFTContractMetadata to generate initial metadata for the contract

        struct TokenMetadata to generate metadata for the NFTs we will be creating

    The next important file is: mint.rs. The place to store the main caves to create mint NFT


        We have two main functions, nft_mint and nft_token:

        The nft_mint function passes parameters such as (title, description, media, receiver_id) to mint the NFT. This NFT will be assigned to receiver_id as the owner.We are also interested in // NFT MINT LOG. Used to log data for checking NFT from Near wallet

        Next is the nft_token function. Used to get NFT data from token_id

    
    Next is the file enumeration.rs. Here I create functions to call the api from the frontend to get data about the NFTs for rendering to the web page.

        We have functions like:
            nft_total_supply //Get the total number of tokens in the contract

            nft_supply_for_owner //Get the total number of existing tokens of account_id

            nft_tokens // Get a list of tokens with paging


    Additional functions are created in the file : internal.rs
        The internal_add_token_to_owner function is used to add tokens to the owner when we use the mint NFT function

    I also create utility functions in the file utils.rs


    In the event.rs file. We have log functions used to log information about NFT to Near Wallet:
         like EventLog, NftMintLog function


* The build.sh file is where the build contract command is stored in the .wasm file. Used to deploy contract to Near testnet or main net

        The built file will be in the directory out/nft-contract.wasm


    In terminal, you need to login near wallet via near cli command:
    near login

    -Create a sub account to deploy the contract eg: with my louiskate.testnet account

        near create-account nft.louiskate.testnet --masterAccount louiskate.testnet --initialBalance 20

    - deploy contract

        near deploy --wasmFile out/nft-contract.wasm --accountId nft.louiskate.testnet --initFunction new_default_metadata --initArgs '{"owner_id":"louiskate.testnet"}'
        
# Step 3: Config front end
    In src\config.js: Add here the contract we just deployed

        const NFT_CONTRACT_NAME = process.env.NFT_CONTRACT_NAME ||'2nft.louiskate.testnet'

    Install dependencies:
        yarn
    
    Start front-end:
        yarn start


# Step 4: More resources
In addition, you should read more in the following pages:
- **NEAR Account**: https://docs.near.org/docs/concepts/account
- **Near 101**: https://learn.figment.io/protocols/near
- **Near Example**: https://examples.near.org/
- **AssemplyScript**: https://www.assemblyscript.org/introduction.html
- **Hackathon Startup Guide**: https://docs.near.org/docs/develop/basics/hackathon-startup-guide
- **NEAR Tutorials**: https://docs.near.org/docs/tutorials/overview
