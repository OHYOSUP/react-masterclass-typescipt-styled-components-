import { useQuery } from "react-query";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";
import { isDarkAtom } from "../atoms";
import { useRecoilValue } from "recoil";
interface ChartProps {
  coinId: string;
}
interface IHistoricalData {
  time_open: string;
  time_close: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery<IHistoricalData[]>(
    ["ohlcv", coinId],
    () => fetchCoinHistory(coinId),
    {
      refetchInterval: 5000,
    }
  );

  const isDark = useRecoilValue(isDarkAtom);

  return (
    <div>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          type="line"
          series={[
            {
              name: "price",
              data: data?.map((price) => price.close) as number[],
            },
          ]}
          options={{
            theme: {
              mode: "light",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: "transparent",
            },
            grid: { show: false },
            stroke: {
              curve: "smooth",
              width: 4,
            },
            yaxis: { show: false },
            xaxis: {
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              labels: {
                show: false,
              },
              type: "datetime",
              categories: data?.map((price) =>
                new Date(price.time_close * 1000).toISOString()
              ),
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["0be881"], stops: [0.1] },
            },
            colors: ["#0fbcf9"],
            tooltip: {
              y: { formatter: (value) => `${value.toFixed(2)}` },
            },
          }}
        />
      )}
    </div>
  );
}

export default Chart;
