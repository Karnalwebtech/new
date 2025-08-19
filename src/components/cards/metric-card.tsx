"use client"
import { ArrowDownIcon, ArrowUpIcon, Minus, Plus } from 'lucide-react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNumber } from '@/services/helpers';
interface MetricCardProps {
    value: number;
    changePercent: number;
    label: string;
    Icon: React.ElementType;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, changePercent, label, Icon }) => {
    const isPositive = changePercent >= 0;
    const formattedPercent = Math.abs(changePercent).toFixed(1);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatNumber(value)}</div>
                <p className="text-xs text-muted-foreground flex gap-2">

                    <span
                        className={`flex items-center text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {isPositive ? (
                            <ArrowUpIcon className="h-4 w-4 flex-shrink-0" />
                        ) : (
                            <ArrowDownIcon className="h-4 w-4 flex-shrink-0" />
                        )}
                        <span className="sr-only">{isPositive ? 'Increased' : 'Decreased'} by</span>
                        {isPositive ? (
                            <Plus size={8} />
                        ) : (
                            <Minus size={8} />
                        )}
                        {formattedPercent}%
                    </span>
                    from last month</p>
            </CardContent>
        </Card>

    );
};

export default MetricCard;