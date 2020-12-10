import { useEffect, useRef } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { DashboardContext } from "../../context/DashboardContext";
import useCoinmarketCap from "../../hooks/useCoinmarketCap";

const CoinMarketWidget = () => {
  const context = useContext(DashboardContext);
  const { handleDirection } = context;

  const [coinmarketData] = useCoinmarketCap();

  useEffect(() => {
    if (
      coinmarketData.data &&
      coinmarketData.data[0]?.quote.USD.percent_change_24h < 0
    ) {
      console.log("DOWN");
      handleDirection("down");
    } else if (
      coinmarketData.data &&
      coinmarketData.data[0]?.quote.USD.percent_change_24h > 0
    ) {
      console.log("UP");

      handleDirection("up");
    }
  }, [coinmarketData]);

  return (
    <CoinMarketWrapper>
      <table className="">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">symbol</th>
            <th scope="col">24h % change</th>
            <th scope="col">Year added</th>
          </tr>
        </thead>
        <tbody>
          {coinmarketData?.data?.slice(0, 5).map((coin, index) => {
            return (
              <tr key={index}>
                <td className="">{coin.name}</td>
                <td className="">{coin.symbol}</td>
                <td className="">
                  {coin.quote.USD.percent_change_24h.toFixed(2)} %
                </td>
                <td className="">{coin.date_added.slice(0, 4)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </CoinMarketWrapper>
  );
};

const CoinMarketWrapper = styled.div`
  padding: 16px;
  text-align: center;
  table {
    margin: 0 auto;
    width: 100%;
    td {
      padding: 13px 0 13px 0;
    }
  }
`;

export default CoinMarketWidget;
