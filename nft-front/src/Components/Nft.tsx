import { useState, useEffect } from "react";
import { Card, InputGroup, FormControl } from "react-bootstrap";
import "./styles.css";

const ethers = require("ethers");

interface TokenProps {
  tokenId: number;
  owner: string;
  name: string;
}

interface NftProps {
  contractAddress: string;
}

const Nft: React.FC<NftProps> = ({ contractAddress }) => {
  const [tokens, setTokens] = useState<TokenProps[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenProps[]>([]);

  useEffect(() => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://data-seed-prebsc-1-s1.binance.org:8545/"
    );
    const contract = new ethers.Contract(
      contractAddress,
      [
        "function ownerOf(uint256 tokenId) public view returns (address owner)",
        "function name() public view returns (string memory)",
      ],
      provider
    );

    const loadTokens = async () => {
      const totalSupply = 12;
      const newTokens = [];

      for (let i = 0; i <= totalSupply; i++) {
        try {
          const owner = await contract.ownerOf(i);
          const name = await contract.name();
          newTokens.push({
            tokenId: i,
            owner,
            name,
          });
        } catch (err) {
          console.error(err);
        }
      }

      setTokens(newTokens);
      setFilteredTokens(newTokens);
    };

    loadTokens();
  }, [contractAddress]);

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase();
    const filtered = tokens.filter((token) =>
      token.tokenId.toString().includes(query)
    );
    setFilteredTokens(filtered);
  };

  return (
    <>
    <div className="nft-container">
      <InputGroup className="nft-input-group">
        <FormControl
          placeholder="Search by tokenId"
          aria-label="Search by tokenId"
          aria-describedby="basic-addon2"
          onChange={handleFilter}
        />
        <h1>
          Address: {contractAddress}
        </h1>
      </InputGroup>
      {filteredTokens.map((token) => (
        <Card key={token.tokenId} className="nft-card">
          <Card.Body className="nft-card-body">
            <Card.Title className="nft-title">{token.name}</Card.Title>
            <Card.Text className="nft-text">
              Token ID: {token.tokenId}
              <br />
              Owner: {token.owner}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
      </div>
    </>
  );
};

export default Nft;
