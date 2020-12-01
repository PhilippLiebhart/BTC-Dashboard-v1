import { useState, useEffect } from "react";

// const PHEMEX_TICK_CONFIG = {
//   id: 1234,
//   method: "tick.subscribe",
//   params: [".BTC"],
// };

// const PHEMEX_24HTICK_CONFIG = {
//   id: 12345,
//   method: "market24h.subscribe",
//   params: [],
// };

// const PHEMEX_HEARTBEAT = {
//   id: 123456,
//   method: "server.ping",
//   params: [],
// };

// const WEBSOCKET_STATUS = {
//   Open: "green",
//   Closed: "red",
//   Connecting: "yellow",
// };

let ws = new WebSocket("wss://phemex.com/ws");

const usePhemexTicker = () => {
  const { readyState } = ws;

  const [connStatus, setConnStatus] = useState();
  const [tickerData, setTickerData] = useState();
  const [dayMarket, setDayMarket] = useState({});
  const [orderbook, setOrderbook] = useState({ data: 0, fetched: false });
  console.log("*******IN usePHEMEX*********", tickerData);

  const sendHeartbeat = () => {
    let heartbeatMessage = {
      //todo id egal?
      id: 123456,
      method: "server.ping",
      params: [],
    };
    if (readyState === 0) {
      ws.send(JSON.stringify(heartbeatMessage));
    } else {
      return;
    }
  };

  useEffect(() => {
    setConnStatus(readyState);

    const heartbeat = setInterval(() => {
      sendHeartbeat();
    }, 3000);

    const reqTickMessage = {
      id: 1234,
      method: "tick.subscribe",
      params: [".BTC"],
    };
    const req24hTickMessage = {
      method: "market24h.subscribe",
      params: [],
      id: 12345,
    };
    const reqOrderbookMessage = {
      id: 123456,
      method: "orderbook.subscribe",
      params: ["BTCUSD"],
    };

    ws.onopen = () => {
      //TODO 2 anfragen in einem schicken?
      ws.send(JSON.stringify(reqTickMessage));
      ws.send(JSON.stringify(req24hTickMessage));
      ws.send(JSON.stringify(reqOrderbookMessage));
    };

    return () => {
      clearInterval(heartbeat);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ws.onmessage = (message) => {
    let { tick, market24h, book } = JSON.parse(message.data);
    //console.log(JSON.parse(message.data));
    if (tick) {
      setTickerData({ tick, last: tick.last });
    } else if (market24h?.symbol === "BTCUSD") {
      setDayMarket({ market24h });
    } else if (book) {
      setOrderbook({ data: { ...book }, fetched: true });

      //todo ob das hier so richtig ist?
      const unsubscribeOrderbook = {
        id: 123456,
        method: "orderbook.unsubscribe",
        params: [],
      };
      ws.send(JSON.stringify(unsubscribeOrderbook));
    } else {
      //console.log("tick undefined");
    }
  };

  return [tickerData, dayMarket, orderbook, connStatus];
};

export default usePhemexTicker;