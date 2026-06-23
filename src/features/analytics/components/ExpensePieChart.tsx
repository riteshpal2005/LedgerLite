import { View, Text, Dimensions } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import { CategorySpending } from "../db/analyticsQueries";
import { useSelector } from "react-redux";
import { RootState } from "../../../core/store/store";
import { useTheme } from "../../../core/theme/ThemeContext";

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M",
    x,
    y,
    "L",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "Z",
  ].join(" ");
}

interface ExpensePieChartProps {
  spendingData: CategorySpending[];
}

export function ExpensePieChart({ spendingData }: ExpensePieChartProps) {
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const { activeThemeClass } = useTheme();

  const getBorderColor = () => {
    if (
      activeThemeClass === "theme-dark" ||
      activeThemeClass === "theme-pitch-black"
    )
      return "#d4d4d8";
    return "#71717a";
  };

  const totalPopulation = spendingData.reduce(
    (sum, item) => sum + item.totalSpent,
    0,
  );

  let currentAngle = 0;
  const chartData = spendingData.map((item) => {
    const category = categories.find((c) => c.id === item.categoryId);
    const angle = (item.totalSpent / totalPopulation) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle += angle;

    return {
      name: category?.name || "Unknown",
      population: item.totalSpent,
      color: category?.color || "#52525b",
      startAngle,
      endAngle,
      percentage: ((item.totalSpent / totalPopulation) * 100).toFixed(1),
    };
  });

  if (chartData.length === 0) {
    return (
      <View className="items-center justify-center h-48 bg-surface rounded-3xl border border-bordercolor">
        <Text className="text-tertiary text-lg">No expenses in this range</Text>
      </View>
    );
  }

  const chartSize = 180;
  const center = chartSize / 2;
  const strokeW = 1;
  const radius = center - strokeW;

  return (
    <View className="bg-surface rounded-3xl border border-bordercolor overflow-hidden items-center justify-center p-6 mb-8">
      <View className="flex-row items-center w-full justify-between">
        <View style={{ width: chartSize, height: chartSize }}>
          <Svg
            width={chartSize}
            height={chartSize}
            viewBox={`0 0 ${chartSize} ${chartSize}`}
          >
            <G>
              {chartData.map((slice, index) => {
                if (slice.endAngle - slice.startAngle === 360) {
                  return (
                    <Path
                      key={index}
                      d={`M ${center}, ${center} m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`}
                      fill={slice.color}
                      stroke={getBorderColor()}
                      strokeWidth={strokeW}
                    />
                  );
                }
                const d = describeArc(
                  center,
                  center,
                  radius,
                  slice.startAngle,
                  slice.endAngle,
                );
                return (
                  <Path
                    key={index}
                    d={d}
                    fill={slice.color}
                    stroke={getBorderColor()}
                    strokeWidth={strokeW}
                  />
                );
              })}
            </G>
          </Svg>
        </View>

        <View className="flex-1 ml-6 justify-center">
          {chartData.map((item, idx) => (
            <View key={idx} className="flex-row items-center mb-3">
              <View
                style={{ backgroundColor: item.color }}
                className="w-4 h-4 rounded-full mr-3"
              />
              <View>
                <Text className="text-primary font-bold text-sm">
                  {item.name}
                </Text>
                <Text className="text-secondary text-xs">
                  {item.percentage}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
