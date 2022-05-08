import React, { useEffect, useState} from 'react'
import {Button, Card, PageHeader, notification} from "antd";
import {SendOutlined, DollarCircleOutlined, CrownOutlined, StarFilled ,CrownFilled, FrownOutlined, ThunderboltFilled , BugOutlined ,GroupOutlined } from "@ant-design/icons";
import ModalTransferNFT from "../components/ModalTransferNFT";
import {default as PublicKey, transactions, utils} from "near-api-js"
import { functionCall, createTransaction } from "near-api-js/lib/transaction";
import ModalMintNFT from "../components/ModelMintNFT";

import {login, parseTokenAmount} from "../utils";
import BN from "bn.js";
import {baseDecode} from "borsh";
import getConfig from '../config'
import { Progress,Row, Col } from 'antd';
import { Link } from 'react-router-dom'
import element0 from '../assets/element0.png';
import element1 from '../assets/element1.png';
import element2 from '../assets/element2.png';
import element3 from '../assets/element3.png';

const nearConfig = getConfig(process.env.NODE_ENV || 'development')
const { Meta } = Card;

function Profile() {
    const element = [element0,element1,element2,element3]
   const stars = [[<StarFilled style={{color:"#ff9e0d"}}/>,<StarFilled />,<StarFilled />,<StarFilled />,<StarFilled />]
    ,[<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled />,<StarFilled />,<StarFilled />]
   ,[<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled />,<StarFilled />]
   ,[<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled />]
   ,[<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>,<StarFilled  style={{color:"#ff9e0d"}}/>]]
    
   const hungry = [
    [<FrownOutlined style={{color:"rgb(225 14 149)"}}/>, <FrownOutlined style={{color:"rgb(229 162 205)"}} />,<FrownOutlined style={{color:"rgb(229 162 205)"}} />,<FrownOutlined style={{color:"rgb(229 162 205)"}} />],
    [<FrownOutlined style={{color:"rgb(225 14 149)"}}/>, <FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(229 162 205)"}} />,<FrownOutlined style={{color:"rgb(229 162 205)"}} />],
    [<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(229 162 205)"}} />],
    [<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,<FrownOutlined style={{color:"rgb(225 14 149)"}}/>,],
    ];
   
   const [nfts, setNFTs] = useState([]);
    const [totalNft, setTotalNft] =useState(0);



    useEffect(async () => {
        if (window.accountId) {
            let data  = await window.contractNFT.nft_tokens_for_owner({"account_id": window.accountId, "from_index": "0", "limit": 100});
            console.log("Data: ", data);
            setNFTs(data);
        }
    }, []);

    useEffect(async () => {
        let totalNFT  = await window.contractNFT.nft_total_supply();
        setTotalNft(totalNFT);
    }, []);


    return (
        <div>
            {console.log(nfts)}
            <div className='ticket'>
                <h1 className='ticket-tts'>Total NFT Created : {totalNft}</h1>
                  
            </div>

        <Row span={16} >
            <Col span={8}>
                <div style={{ padding: 30, display: "wrap" }}>
                    {
                        nfts.map((nft) => {
                            return (
                                <Card
                                    key={nft.token_id}
                                    hoverable
                                    style={{ width: 240, marginRight: 15, marginBottom: 15, flexWrap: "wrap" }}
                                    cover={<img style={{height: 200, width: "100%", objectFit: "contain"}} alt="nft-cover" src={nft.metadata.media} />}

                                >
                                    <div style={{ fontSize: '20px' }}> Title: {nft.metadata.title} </div>
                                    
                                    <Card>
                                        Description: {nft.metadata.description} <br/>
                                        Price: {nft.metadata.price}
                                    </Card> <br/>
                                
                                    <Meta title={`${"ID: " + nft.token_id} (${nft.approved_account_ids[nearConfig.marketContractName] >= 0 ? "SALE" : "NOT SALE"})`} description={"Owner: " + nft.owner_id} />
                                </Card>
                            )
                        })
                    }
                </div>

            </Col>

            
        </Row>
            

        </div>
    )
}

export default Profile;