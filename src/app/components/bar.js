import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarChart = (counts) => {
    console.log(counts)
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartRef.current) {
            const ctx = chartRef.current.getContext('2d');
            if (ctx) {
                const totalDialledCallCount =
                    counts.counts.FollowUp +
                    counts.counts.Intrested +
                    counts.counts.NotInterested +
                    counts.counts.NotReachable +
                    counts.counts.Prospect +
                    counts.counts.Qualified +
                    counts.counts.RSPVCount +
                    counts.counts.RNR;
                console.log("totalDialledCallCount", totalDialledCallCount)

                const totalConnctedCallCount =
                    counts.counts.FollowUp +
                    counts.counts.Intrested +
                    counts.counts.NotInterested +
                    counts.counts.Prospect +
                    counts.counts.Qualified +
                    counts.counts.RSPVCount;
                console.log("totalConnctedCallCount", totalConnctedCallCount)

                const Totalfoolowup = counts.counts.FollowUp;
                console.log("Totalfoolowup", Totalfoolowup)
                const meetingCount = counts.counts.meetingCount
                console.log("meetingCount", meetingCount)
                const Todaymeeting = counts.counts.Todaymeeting
                console.log("Todaymeeting", Todaymeeting)
                const Totalmeeting = counts.counts.Totalmeeting
                console.log("Totalmeeting", Totalmeeting)

                chartInstance.current = new Chart(ctx, {

                    type: 'bar',
                    data: {
                        labels: ['Total Dialled Call', 'Total Connected Call ', 'Total Follow Up', 'Meeting Fixed', 'Todays Meeting', 'Total Meeting', 'Potentials'],
                        datasets: [
                            {
                                label: 'My Bar Chart',
                                data: [totalDialledCallCount, totalConnctedCallCount, Totalfoolowup, meetingCount, Todaymeeting, Totalmeeting, 0],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.5)',
                                    'rgba(54, 162, 235, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(153, 102, 255, 0.5)',
                                    'rgba(255, 159, 64, 0.5)',
                                    'rgba(75, 192, 192, 0.5)',
                                    'rgba(255, 206, 86, 0.5)',
                                ],
                                borderColor: [
                                    'rgba(255, 99, 132, 1)',
                                    'rgba(54, 162, 235, 1)',
                                    'rgba(255, 206, 86, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(153, 102, 255, 1)',
                                    'rgba(255, 159, 64, 1)',
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(255, 206, 86, 1)',
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true,
                            },
                        },
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [counts]);

    return <canvas ref={chartRef} />;
};

export default BarChart;
