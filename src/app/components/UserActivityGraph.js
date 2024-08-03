import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import moment from 'moment';
import 'chartjs-adapter-moment';
import { Colors } from 'chart.js';

const UserActivityGraph = ({ userTimelineData }) => {
    console.log(userTimelineData);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (userTimelineData) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            const today = moment().startOf('day');
            const chartData = userTimelineData
                .filter(({ loginTime, logoutTime, location }) => moment(loginTime) && logoutTime && location)
                .map(({ loginTime, logoutTime, location }) => {
                    const dataPoints = [{
                        x: moment(loginTime),
                        y: moment(loginTime),
                        label: `Login: ${moment(loginTime).format('MMM D, YYYY h:mm:ss A')}, Location: ${location.city}`,
                    }];

                    if (logoutTime) {
                        dataPoints.push({
                            x: moment(logoutTime),
                            y: moment(logoutTime),
                            label: `Logout: ${moment(logoutTime).format('MMM D, YYYY h:mm:ss A')}, Location: ${location.city}`,

                        });
                    }

                    return dataPoints;
                })
                .flat();

            const ctx = chartRef.current.getContext('2d');
            const colors = ['blue', 'pink'];

            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    datasets: [
                        {
                            label: 'User Daily Activity',
                            data: chartData,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                            pointRadius: 5,
                            pointHoverRadius: 7,
                            pointBackgroundColor: (context) =>
                                colors[context.dataIndex % colors.length],
                        },

                    ],
                },
                options: {
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: (context) => context.dataset.data[context.dataIndex].label
                            }
                        },
                        annotation: {
                            annotations: {
                                box1: {
                                    type: 'box',
                                    xMin: moment().startOf('day').valueOf(),
                                    xMax: moment().endOf('day').valueOf(),
                                    yMin: moment().startOf('day').valueOf(),
                                    yMax: moment().endOf('day').valueOf(),
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                },
                            },
                        },
                    },
                    title: {
                        display: true,
                        text: 'Blue Dots(Login Time), Pink Dots(Logout Time)',
                    },
                    scales: {
                        x: {
                            type: 'time',
                            time: {
                                unit: 'day',
                                displayFormats: {
                                    day: 'MMM D, YYYY h:mm:ss A'
                                }
                            },
                            title: {
                                display: true,
                                text: "Blue Dot (Login Time)",
                                color: 'Blue',
                                font: {
                                    size: 10,

                                }
                            },
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)', // Color of the grid lines
                                z: -1 // Set the z-index to -1 to show the grid lines behind the chart data
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: "Pink Dot (Logout Time)",
                                color: 'Pink',
                                font: {
                                    size: 10,

                                }
                            },

                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)', // Color of the grid lines
                                z: -1 // Set the z-index to -1 to show the grid lines behind the chart data
                            },
                            ticks: {
                                display: false, // Hide the y-axis numbers
                            }
                        },

                    },

                }


            });

        }
    }, [userTimelineData]);

    return (
        <div>
            <canvas id="userActivityChart" ref={chartRef}></canvas>
        </div>
    );
};

export default UserActivityGraph;
