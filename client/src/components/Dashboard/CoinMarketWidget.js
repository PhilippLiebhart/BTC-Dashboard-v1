import { useEffect } from "react";
import { useContext } from "react";
import styled from "styled-components";
import { DashboardContext } from "../../context/DashboardContext";
import useCoinmarketCap from "../../hooks/useCoinmarketCap";

const CoinMarketWidget = () => {
  const context = useContext(DashboardContext);
  const { handleCoinMarketData } = context;

  const [coinmarketData] = useCoinmarketCap();

  useEffect(() => {
    const winner24h = coinmarketData?.data?.reduce((p, c) =>
      p.quote?.USD.percent_change_24h > c.quote?.USD.percent_change_24h ? p : c
    );
    const loser24h = coinmarketData?.data?.reduce((p, c) =>
      p.quote?.USD.percent_change_24h > c.quote?.USD.percent_change_24h ? c : p
    );

    if (
      coinmarketData.data &&
      coinmarketData.data[0]?.quote.USD.percent_change_24h < 0
    ) {
      handleCoinMarketData({
        direction: "down",
        percent24h: coinmarketData.data[0].quote.USD.percent_change_24h.toFixed(
          2
        ),
        winner24h: winner24h,
        loser24h: loser24h,
      });
    } else if (
      coinmarketData.data &&
      coinmarketData.data[0]?.quote.USD.percent_change_24h > 0
    ) {
      handleCoinMarketData({
        direction: "up",
        percent24h: coinmarketData.data[0].quote.USD.percent_change_24h.toFixed(
          2
        ),
        winner24h: winner24h,
        loser24h: loser24h,
      });
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
          {coinmarketData?.data?.slice(0, 7).map((coin, index) => {
            return (
              <tr key={index}>
                <td className="">{coin.name}</td>
                <td className="">{coin.symbol}</td>
                <td className="">
                  {coin.quote.USD.percent_change_24h.toFixed(2)} %
                </td>
                <td className="">{coin.date_added.slice(0, 7)}</td>
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
  font-size: 0.8rem;
  table {
    margin: 0 auto;
    width: 100%;
    td {
      padding: 13px 0 13px 0;
    }
  }
`;

export default CoinMarketWidget;
