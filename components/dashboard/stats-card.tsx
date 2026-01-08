import { Card, CardContent } from "../ui/card";
import { LucideIcon } from "lucide-react";

type CardDetails = {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBackground?: string;
};

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  iconBackground,
}: CardDetails) => {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs sm:text-sm font-medium text-gray-600">
              {title}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">
              {value}
            </p>
          </div>
          <div
            className={`h-10 w-10 sm:h-12 sm:w-12 ${iconBackground} rounded-lg flex items-center justify-center`}
          >
            {Icon && (
              <Icon
                className={`className="h-5 w-5 sm:h-5 sm:w-6 ${iconColor}`}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
