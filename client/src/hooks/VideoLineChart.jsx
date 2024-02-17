import React, { useState, useEffect } from 'react';
import { Line } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { Button } from "@/components/ui/button";

function LineChart({ videoInfo, video }) {
    const [filteredData, setFilteredData] = useState({ labels: [], datasets: [] });
    const [filter, setFilter] = useState('7days');

    useEffect(() => {
        if (!videoInfo[video]?.views_data) {
            return;
        }
        const sortedViewsData = videoInfo[video].views_data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        if (filter === '7days') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (filter === '1month') {
            startDate.setMonth(startDate.getMonth() - 1);
        }

        const filteredViewsData = sortedViewsData.filter(v => {
            const viewDate = new Date(v.date);
            viewDate.setHours(0, 0, 0, 0);
            return viewDate >= startDate && viewDate <= new Date();
        });

        setFilteredData({
            labels: filteredViewsData.map(v => v.date),
            datasets: [{
                id: 1,
                label: 'Views',
                data: filteredViewsData.map(v => parseInt(v.count, 10)),
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.3)",
            }]
        });
    }, [videoInfo, video, filter]);

    return (
        <>
            <div>
                <Button onClick={() => setFilter('7days')}>Last 7 Days</Button>
                <Button onClick={() => setFilter('1month')} className="ml-4">Last Month</Button>
            </div>
            <Line datasetIdKey='id' data={filteredData} options={{ maintainAspectRatio: false }} />
        </>
    );
}

export default LineChart;
